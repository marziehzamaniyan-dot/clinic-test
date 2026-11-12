# مستند فنی معماری امنیتی، جریان داده (DFD)، لاگ‌های ممیزی و احراز هویت دومرحله‌ای (2FA)
## سامانه مدیریت بالینی و پنل ادمین کلینیک تخصصی دکتر مرضیه زمانیان

---

## ۱. دیاگرام جریان داده (Data Flow Diagram - DFD Level 1 & 2)

### ۱.۱. ماتریس تعامل نقش‌ها با جریان‌های داده

```
[کاربران و پرسنل]             [درگاه امنیتی و کنترل دسترسی]               [سرویس‌های هسته]                 [لایه‌های ذخیره‌سازی]
+-------------------+        +---------------------------------+        +---------------------+        +--------------------+
|                   |        |                                 |        |                     |        |                    |
| ۱. مدیر کل        |------->| WAF / Rate Limiter              |------->| RBAC Auth Guard     |------->| Audit Trail DB     |
|   (Super Admin)   |        | (IP Blacklist, 5 attempts/15min)|        | (Full Permissions)  |        | (Write-Once Log)   |
|                   |        +---------------------------------+        +---------------------+        +--------------------+
|                   |                        |                                     |                              |
|                   |                        v                                     v                              v
| ۲. مدیر پذیرش     |------->| Session & MFA Engine            |------->| Clinical Shift &    |------->| Clinical & Patient |
| (Reception Staff) |        | (HttpOnly Strict, 15m timeout)  |        | Appointments Service|        | Database           |
|                   |        +---------------------------------+        +---------------------+        +--------------------+
|                   |                        |                                     |                              |
|                   |                        v                                     v                              v
| ۳. مدیر محتوا     |------->| Sanitizer & Input Validator     |------->| CMS & Announcement  |------->| Content & Media    |
| (Content Editor)  |        | (OWASP Zod/Joi, No XSS, CSP)    |        | Service             |        | Storage            |
|                   |        +---------------------------------+        +---------------------+        +--------------------+
+-------------------+
```

### ۱.۲. جریان داده به‌تفکیک نقش‌های سیستمی

#### الف) جریان داده سوپر ادمین (Super Admin Data Flow)
1. **احراز هویت:** ارسال گذرواژه قوی + کد پویا ۶ رقمی TOTP از طریق کانال امن TLS 1.3.
2. **بررسی گیت‌وی:** صدور توکن نشست با نقش `SUPER_ADMIN` در کوکی رمزنگاری‌شده (`AES-256-GCM`).
3. **عملیات:**
   - دسترسی کامل خواندن/نوشتن به پرونده‌های درمانی، پروتکل‌های ART، آزمایشگاه جنین‌شناسی، و تانک‌های کرایو.
   - دسترسی یک‌طرفه (Read-Only) به جدول تغییرناپذیر لاگ‌های ممیزی امنیتی (`audit_logs`).
   - مدیریت کاربران پنل، ابطال اجباری نشست‌های مشکوک (`Force Logout`).
4. **ردگیری:** هر اقدام مدیر ارشد بلافاصله با هش رمزنگاری‌شده در لاگ سیستم ثبت می‌گردد.

#### ب) جریان داده مدیر پذیرش (Receptionist Data Flow)
1. **احراز هویت:** گذرواژه + پیامک یکبارمصرف (OTP) یا اپلیکیشن 2FA.
2. **سد دسترسی (RBAC Barrier):**
   - **مجاز:** خواندن و بروزرسانی شیفت‌های روزانه پزشکان، وضعیت صف مراجعین، تعیین مرخصی پزشک، خواندن پیام‌های صندوق تماس، و ثبت یادداشت اداری.
   - **مسدودشده:** عدم دسترسی به داده‌های حساس ژنتیک، آزمایش‌های بالینی ناباروری، جدول لاگ‌های امنیتی، و تغییر دسترسی ادمین‌ها.
3. **ردگیری:** هر تغییر در وضعیت شیفت پزشک یا تغییر وضعیت پیام با شناسه کاربر و IP وی در لاگ درج می‌شود.

#### ج) جریان داده مدیر محتوا (Content Editor Data Flow)
1. **احراز هویت:** اعتبارسنجی دو مرحله‌ای 2FA.
2. **سد دسترسی (RBAC Barrier):**
   - **مجاز:** ماژول ویرایش متون سایت (درباره ما، اطلاعیه‌ها، بنرهای اضطراری تعطیلی کلینیک).
   - **مسدودشده:** دسترسی به نوبت‌ها، لیست مراجعین، پرونده‌ها، پیام‌های مراجعین و لاگ‌ها کاملاً قطع است (`HTTP 403 Forbidden`).

---

## ۲. ساختار پایگاه‌داده برای لاگ‌های امنیتی (Security Audit Logs Schema)

برای رعایت استانداردهای ممیزی پزشکی و قانونی (HIPAA و مقررات حاکمیت داده‌های بالینی)، جدول لاگ‌ها به شیوه **تنها-افزودنی (Append-Only / WORM)** طراحی شده و هیچ عملیات `UPDATE` یا `DELETE` روی آن مجاز نیست.

### ۲.۱. اسکریپت ساختار جدول در PostgreSQL (DDL Schema)

```sql
-- ایجاد انوم اکشن‌های امنیتی
CREATE TYPE audit_action_enum AS ENUM (
    'LOGIN_SUCCESS',
    'LOGIN_FAILED',
    'MFA_VERIFIED',
    'MFA_FAILED',
    'LOGOUT',
    'SESSION_EXPIRED',
    'PASSWORD_CHANGED',
    'DOCTOR_SHIFT_UPDATED',
    'DOCTOR_LEAVE_TOGGLED',
    'PATIENT_EHR_VIEWED',
    'PATIENT_NOTE_CREATED',
    'HCG_TRIGGER_SENT',
    'CMS_ANNOUNCEMENT_UPDATED',
    'SECURITY_POLICY_CHANGED',
    'UNAUTHORIZED_ACCESS_ATTEMPT'
);

-- ایجاد انوم سطوح اهمیت وقایع
CREATE TYPE log_severity_enum AS ENUM (
    'INFO',
    'NOTICE',
    'WARNING',
    'CRITICAL',
    'ALERT'
);

-- جدول لاگ‌های امنیتی و ممیزی
CREATE TABLE security_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID NULL REFERENCES admin_users(id) ON DELETE SET NULL,
    actor_username VARCHAR(100) NOT NULL,
    actor_role VARCHAR(50) NOT NULL,
    action audit_action_enum NOT NULL,
    severity log_severity_enum NOT NULL DEFAULT 'INFO',
    
    -- جزئیات شیفت یا نهاد تحت تاثیر
    target_entity VARCHAR(100) NOT NULL,         -- e.g. "DoctorShift", "PatientEHR", "CMSBanner"
    target_entity_id VARCHAR(100) NULL,          -- e.g. "dr-sohrabi", "pat-1042"
    
    -- ثبت تفاوت داده (Delta Tracking) برای پیگیری تغییرات
    old_values JSONB NULL,                       -- داده قبلی قبل از ویرایش
    new_values JSONB NULL,                       -- داده جدید بعد از ویرایش
    
    -- امضای فراداده‌های کلاینت و شبکه
    ip_address INET NOT NULL,
    user_agent TEXT NOT NULL,
    session_id VARCHAR(128) NULL,
    device_fingerprint VARCHAR(64) NULL,
    geo_location VARCHAR(150) NULL,             -- e.g. "Tehran, Iran (MCI)"
    
    -- اعتبارسنجی ضد دستکاری لاگ با زنجیره هش (Tamper-evident Hash Chain)
    previous_log_hash CHAR(64) NOT NULL,
    current_log_hash CHAR(64) NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- شاخص‌ها (Indexes) جهت جستجوی آنی و مانیتورینگ بلادرنگ
CREATE INDEX idx_audit_created_at ON security_audit_logs (created_at DESC);
CREATE INDEX idx_audit_actor_id ON security_audit_logs (actor_id);
CREATE INDEX idx_audit_action ON security_audit_logs (action);
CREATE INDEX idx_audit_severity ON security_audit_logs (severity) WHERE severity IN ('CRITICAL', 'ALERT');
CREATE INDEX idx_audit_ip_address ON security_audit_logs (ip_address);
CREATE INDEX idx_audit_target ON security_audit_logs (target_entity, target_entity_id);

-- جلوگیری از حذف یا ویرایش رکوردهای لاگ (Append-Only Trigger)
CREATE OR REPLACE FUNCTION prevent_audit_log_modification()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'خطای امنیتی: حذف یا تغییر در سوابق جدول security_audit_logs اکیداً غیرمجاز است.';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_audit_logs_immutable
BEFORE UPDATE OR DELETE ON security_audit_logs
FOR EACH ROW EXECUTE FUNCTION prevent_audit_log_modification();
```

### ۲.۲. تضمین ضد دستکاری با زنجیره هش (Tamper-Evident Hashing)
هر رکورد لاگ دارای دو فیلد `previous_log_hash` و `current_log_hash` است. هش هر لاگ با فرمول زیر ساخته می‌شود:
$$\text{current\_hash} = \text{HMAC-SHA256}(\text{previous\_hash} + \text{actor\_id} + \text{action} + \text{timestamp} + \text{new\_values}, \text{SecretKey})$$
اگر هر گونه نفوذگری یا فرد دارای دسترسی ادمین دیتابیس بخواهد رکوردی را تغییر دهد، شکست پیوستگی زنجیره در بازرسی هفتگی کشف و زنگ هشدار امنیتی به صدا درمی‌آید.

---

## ۳. استراتژی احراز هویت دومرحله‌ای (2FA Strategy) برای پنل ادمین

### ۳.۱. استاندارد فنی انتخابی: TOTP (RFC 6238)
- **پروتکل اصلی:** Time-Based One-Time Password با پنجره زمانی ۳۰ ثانیه‌ای و ارقام ۶ رقمی بر پایه الگوریتم HMAC-SHA1/SHA256 سازگار با اپلیکیشن‌های استاندارد (Google Authenticator, Microsoft Authenticator).
- **پروتکل پشتیبان:** ارسال پیامک اعتبارسنجی اختصاصی (خدماتی) به شماره تلفن همراه شخص دکتر زمانیان و مدیران ثبت‌شده در صورت عدم دسترسی به نرم‌افزار.

### ۳.۲. چرخه عمر راه‌اندازی و فعال‌سازی (Enrollment Flow)

```
[مرحله ۱: درخواست فعال‌سازی 2FA در پنل ادمین]
                     │
                     ▼
[مرحله ۲: سرور یک Secret Key به طول ۱۶۰ بیت با فرمت Base32 تولید می‌کند]
                     │
                     ▼
[مرحله ۳: تولید بارکد اختصاصی امنیتی به فرمت استاندارد:]
otpauth://totp/DrZamanianClinic:admin_username?secret=JBSWY3DPEHPK3PXP&issuer=DrZamanianClinic&algorithm=SHA256&digits=6&period=30
                     │
                     ▼
[مرحله ۴: صدور ۸ کد بازیابی اضطراری (Backup Codes) ۱۰ کاراکتری یکبارمصرف]
(کدها با الگوریتم Argon2id در دیتابیس هش می‌شوند و اصل آن فقط یک‌بار به مدیر نشان داده می‌شود)
                     │
                     ▼
[مرحله ۵: الزام به ورود کد تستی توسط کاربر برای تأیید صحت راه‌اندازی]
                     │
                     ▼
[مرحله ۶: فعال‌سازی قطعی فلگ is_2fa_enabled در پروفایل کاربر و ذخیره Secret به شکل رمزگذاری‌شده AES-256]
```

### ۳.۳. جریان اعتبارسنجی در لحظه ورود (Login Verification Flow)

```
[فرم لاگین: نام کاربری + کلمه عبور]
                 │
                 ▼
      [بررسی صحت گذرواژه] ────(نادرست)────> [افزایش شمارنده شکست لاگین + هشدار Rate-Limit]
                 │
            (درست بود)
                 │
                 ▼
[بررسی وضعیت 2FA کاربر]
   │
   ├─► در صورتی که غیرفعال باشد (نقش‌های پایه): ورود به پنل
   │
   └─► در صورتی که فعال باشد (اجباری برای Super Admin و پذیرش):
                 │
                 ▼
   [صدور توکن موقت احراز هویت (Pre-Auth Token با طول عمر ۳ دقیقه)]
                 │
                 ▼
   [درخواست کد ۶ رقمی ۲FA یا کد بازیابی پشتیبان]
                 │
                 ▼
   [بررسی در پنجره زمانی (Tolerance = ±1 Interval برای پوشش اختلاف ساعت کلاینت)]
                 │
         ┌───────┴───────┐
      (معتبر)         (نامعتبر)
         │               │
         │               ▼
         │        [ثبت در audit_logs با عنوان MFA_FAILED]
         │        [مسدودسازی بعد از ۳ بار ورود کد اشتباه ۲FA]
         │
         ▼
[ایجاد سشن نهایی با مشخصات:]
- انقضای سشن: ۱۵ دقیقه عدم فعالیت
- کوکی با فلگ‌های: HttpOnly, Secure, SameSite=Strict
- ابطال هرگونه سشن فعال قبلی این کاربر (Single Active Session)
- ثبت رخداد MFA_VERIFIED در لاگ‌های امنیتی با آدرس IP و شناسه دستگاه
```

### ۳.۴. استراتژی مقابله با حملات و سناریوهای بحرانی (Incident Response)

| سناریوی تهدید | مکانیزم دفاعی در معماری سیستم | اقدام خودکار سامانه |
| :--- | :--- | :--- |
| **حمله Brute-force روی کد ۶ رقمی 2FA** | محدودیت نرخ در سطح ردیف Pre-Auth Token | قفل شدن موقت پس از ۳ تلاش ناموفق؛ نیاز به ورود مجدد کلمه عبور اصلی. |
| **گم شدن تلفن همراه مدیر ارشد** | استفاده از کدهای بازیابی هش‌شده (Backup Codes) | با مصرف هر کد، رکورد آن در دیتابیس باطل می‌شود (`used = true`). |
| **سرقت کوکی سشن (Session Hijacking)** | تطابق پیوسته اثرانگشت نشست (Session Fingerprinting) | در هر درخواست، User-Agent و Subnet IP بررسی شده و در صورت مغایرت، سشن فوراً منهدم می‌گردد. |
| **طولانی شدن زمان باز بودن پنل توسط منشی** | سیستم Auto-Logout بر پایه زمان‌سنج غیرفعالی | بعد از ۱۵ دقیقه بدون حرکت ماوس/کلیک، سشن منقضی شده و صفحه به `/login?timeout=1` منتقل می‌گردد. |

---

## ۴. استانداردهای کدنویسی و گیت‌های دفاعی در لایه‌های نرم‌افزار

1. **لایه وب‌سرور و گیت‌وی (Reverse Proxy / Edge):**
   - پیکربندی هدرهای امنیتی اجباری:
     - `Content-Security-Policy: default-src 'self'; script-src 'self'; object-src 'none'; frame-ancestors 'none';`
     - `X-Frame-Options: DENY`
     - `X-Content-Type-Options: nosniff`
     - `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
2. **لایه اعتبارسنجی ورودی‌ها (Input Sanitization):**
   - تمامی ورودی‌های فرم پیام‌ها، شیفت‌ها و فیلدهای متنی توسط اسکیماهای سخت‌گیرانه تایپ‌سیف (Zod) اعتبارسنجی شده و تمام کاراکترهای مخرب HTML خنثی می‌گردند (`DOMPurify / sanitize-html`).
3. **رمزنگاری در حالت سکون و حین انتقال (Data-at-Rest & In-Transit):**
   - ارتباطات منحصراً بر بستر `TLS 1.3`.
   - کلیدهای سکرت 2FA و کدهای پرونده در دیتابیس با کلید متقارن `AES-256-GCM` ذخیره می‌شوند.
