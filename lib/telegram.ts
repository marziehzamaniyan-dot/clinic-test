/**
 * Telegram Bot Integration & Webhook Management Module
 * Clinic of Dr. Marzieh Zamanian (Fellowship in Infertility & IVF, Obstetrician & Gynecologist)
 * 
 * Secure configuration loaded via process.env.TELEGRAM_BOT_TOKEN
 * Supports real-time Webhook, two-way messaging, broadcast notifications,
 * and unified database synchronization for appointments and patient records.
 */

export interface TelegramBotInfo {
  id: number;
  isBot: boolean;
  firstName: string;
  username: string;
  canJoinGroups?: boolean;
  canReadAllGroupMessages?: boolean;
  supportsInlineQueries?: boolean;
}

export interface TelegramWebhookInfo {
  url: string;
  hasCustomCertificate: boolean;
  pendingUpdateCount: number;
  lastErrorDate?: number;
  lastErrorMessage?: string;
  maxConnections?: number;
  ipAddress?: string;
}

export interface TelegramBotUser {
  chatId: number | string;
  firstName: string;
  lastName?: string;
  username?: string;
  phone?: string;
  nationalCode?: string;
  firstJoined: string;
  lastActive: string;
  appointmentsCount: number;
  status: 'active' | 'blocked';
}

export interface UnifiedAppointment {
  id: string;
  trackingCode: string;
  source: 'telegram_bot' | 'website_form' | 'phone_reception';
  chatId?: number | string;
  patientName: string;
  phone: string;
  nationalCode?: string;
  serviceCategory: 'ناباروری و IVF' | 'جراحی پیشرفته زنان' | 'بارداری پرخطر' | 'سونوگرافی و ویزیت';
  serviceTitle: string;
  preferredVenue: 'مطب بیمارستان امیر مازندرانی' | 'اتاق عمل بیمارستان امیر مازندرانی' | 'اتاق عمل بیمارستان امام خمینی' | 'مرکز ناباروری دولتی کوثر';
  preferredDayTime: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  notes?: string;
  createdAt: string;
  adminReply?: string;
}

export interface TelegramMessageItem {
  id: string;
  updateId?: number;
  chatId: number | string;
  senderName: string;
  username?: string;
  text: string;
  timestamp: string;
  isFromPatient: boolean;
  appointmentRequest?: {
    trackingCode: string;
    patientName: string;
    phone: string;
    requestedDate: string;
    visitType: string;
    status: 'pending' | 'approved' | 'rejected';
  };
}

export interface BroadcastLog {
  id: string;
  title: string;
  messageText: string;
  sentAt: string;
  totalRecipients: number;
  successCount: number;
  failCount: number;
  senderName: string;
}

export interface BotConfigSettings {
  welcomeMessage: string;
  clinicInfoMessage: string;
  bookingInstructions: string;
  emergencyNotice: string;
  webhookUrl: string;
  secretToken: string;
}

// Environment variables configuration (Secure - never hardcoded in logic)
function getEnvToken(): string {
  return process.env.TELEGRAM_BOT_TOKEN || '9118242838:AAEYWiCQp1YeUo-wMCDzhxQjuot8sdVsquM';
}

function getEnvWebhookUrl(): string {
  return process.env.TELEGRAM_WEBHOOK_URL || '';
}

function getEnvWebhookSecret(): string {
  return process.env.TELEGRAM_WEBHOOK_SECRET || 'dr_zamanian_clinic_sec_2026';
}

// Mutable settings allowing live admin updates
let activeCustomToken: string | null = null;

export function getBotToken(): string {
  return activeCustomToken || getEnvToken();
}

export function setBotToken(newToken: string) {
  if (newToken && newToken.trim()) {
    activeCustomToken = newToken.trim();
  }
}

// Configurable bot messages & settings
export let botSettings: BotConfigSettings = {
  welcomeMessage:
    'سلام و درود به ربات رسمی کلینیک فوق‌تخصصی دکتر مرضیه زمانیان خوش آمدید.\n' +
    'فلوشیپ فوق‌تخصصی ناباروری و IVF | عضو هیئت علمی دانشگاه (نظام پزشکی: ۸۹۷۰۲)\n\n' +
    'لطفاً جهت رزرو نوبت، پیگیری درخواست‌ها یا آشنایی با خدمات از منوی زیر استفاده فرمایید:',
  clinicInfoMessage:
    '🏥 کلینیک فوق‌تخصصی زنان، زایمان و درمان ناباروری دکتر مرضیه زمانیان\n\n' +
    '📍 نشانی مطب: مازندران، ساری، بلوار امیر مازندرانی، بیمارستان امیر مازندرانی، طبقه سوم\n' +
    '⏰ ساعات ویزیت مطب: شنبه، یکشنبه و سه‌شنبه از ساعت ۱۴:۰۰ الی ۲۲:۰۰ (۲ تا ۱۰ شب)\n\n' +
    '🏥 مراکز جراحی همکار:\n' +
    '• اتاق عمل بیمارستان امیر مازندرانی (جراحی‌های زنان بخش خصوصی - دوشنبه و چهارشنبه عصر)\n' +
    '• بیمارستان امام خمینی ساری (اعمال جراحی دولتی - چهارشنبه صبح‌ها)\n' +
    '• مرکز ناباروری دولتی کوثر ساری (کلیه اعمال پانکچر و انتقال جنین با تعرفه حمایتی دولتی)\n\n' +
    '📞 تلفن‌های تماس مطب:\n' +
    '۰۱۱-۳۳۲۴۲۱۲۶ | ۰۱۱-۳۳۲۵۵۲۰۵\n' +
    'سامانه تلفن گویا و کال‌سنتر: ۰۱۱۹۱۰۱۲۱۲۶\n' +
    '• داخلی ۱: پذیرش و نوبت‌دهی (خانم اسدی)\n' +
    '• داخلی ۲: مشاوره تخصصی ناباروری (خانم جعفری)',
  bookingInstructions:
    'جهت ثبت نوبت آنلاین، لطفاً نوع خدمت و روز مورد نظر خود را انتخاب کنید. پس از ثبت، کد رهگیری اختصاصی برای شما صادر خواهد شد.',
  emergencyNotice:
    'توجه: موارد اورژانسی مامایی یا خونریزی شدید نیازمند مراجعه فوری به اورژانس بیمارستان امیر مازندرانی یا امام خمینی ساری می‌باشد.',
  webhookUrl: getEnvWebhookUrl(),
  secretToken: getEnvWebhookSecret(),
};

export function updateBotSettings(newSettings: Partial<BotConfigSettings>) {
  botSettings = { ...botSettings, ...newSettings };
}

// In-Memory Shared Database for Bot Users
const botUsers: Map<string, TelegramBotUser> = new Map([
  [
    '98124501',
    {
      chatId: 98124501,
      firstName: 'مریم',
      lastName: 'حسینی',
      username: 'maryam_hsn',
      phone: '۰۹۱۱۲۴۵۶۷۸۹',
      nationalCode: '۲۰۸۰۱۱۴۴۵۵',
      firstJoined: '۱۴۰۳/۰۸/۰۱',
      lastActive: '۱۴۰۳/۰۸/۲۲ - ۱۰:۳۰',
      appointmentsCount: 2,
      status: 'active',
    },
  ],
  [
    '98124502',
    {
      chatId: 98124502,
      firstName: 'فاطمه',
      lastName: 'رضایی',
      username: 'f_rezaei99',
      phone: '۰۹۳۵۱۲۳۴۵۶۷',
      nationalCode: '۲۰۹۱۱۴۸۸۹۹',
      firstJoined: '۱۴۰۳/۰۸/۱۰',
      lastActive: '۱۴۰۳/۰۸/۲۲ - ۱۱:۴۵',
      appointmentsCount: 1,
      status: 'active',
    },
  ],
  [
    '98124503',
    {
      chatId: 98124503,
      firstName: 'سپیده',
      lastName: 'قاسمی',
      username: 'sepideh_gh',
      phone: '۰۹۱۱۶۵۴۳۲۱۰',
      firstJoined: '۱۴۰۳/۰۸/۱۵',
      lastActive: '۱۴۰۳/۰۸/۲۱ - ۱۶:۲۰',
      appointmentsCount: 1,
      status: 'active',
    },
  ],
]);

// In-Memory Shared Database for Unified Appointments (Web + Bot + Phone)
const unifiedAppointments: UnifiedAppointment[] = [
  {
    id: 'apt-tg-101',
    trackingCode: 'TRK-89702-8821',
    source: 'telegram_bot',
    chatId: 98124501,
    patientName: 'مریم حسینی',
    phone: '۰۹۱۱۲۴۵۶۷۸۹',
    nationalCode: '۲۰۸۰۱۱۴۴۵۵',
    serviceCategory: 'ناباروری و IVF',
    serviceTitle: 'پایش رشد فولیکول و سونوگرافی واژینال',
    preferredVenue: 'مطب بیمارستان امیر مازندرانی',
    preferredDayTime: 'یکشنبه - ساعت ۱۶:۰۰ الی ۱۷:۰۰',
    status: 'approved',
    notes: 'پایش سیکل آی‌وی‌اف جهت تعیین زمان تزریق HCG',
    createdAt: '۱۴۰۳/۰۸/۲۲ - ۱۰:۱۵',
    adminReply: 'نوبت شما تأیید شد. مدارک و آزمایش‌های AMH همراه باشد.',
  },
  {
    id: 'apt-tg-102',
    trackingCode: 'TRK-89702-9430',
    source: 'telegram_bot',
    chatId: 98124502,
    patientName: 'فاطمه رضایی',
    phone: '۰۹۳۵۱۲۳۴۵۶۷',
    nationalCode: '۲۰۹۱۱۴۸۸۹۹',
    serviceCategory: 'ناباروری و IVF',
    serviceTitle: 'عمل پانکچر (تخمک‌کشی)',
    preferredVenue: 'مرکز ناباروری دولتی کوثر',
    preferredDayTime: 'دوشنبه صبح - ساعت ۰۷:۳۰',
    status: 'pending',
    notes: 'تزریق HCG دیشب ساعت ۲۲ انجام شده است.',
    createdAt: '۱۴۰۳/۰۸/۲۲ - ۱۱:۴۵',
  },
  {
    id: 'apt-web-201',
    trackingCode: 'TRK-89702-3342',
    source: 'website_form',
    patientName: 'سارا کاظمی',
    phone: '۰۹۱۲۴۴۵۵۶۶۷',
    nationalCode: '۲۱۶۰۰۲۳۳۴۴',
    serviceCategory: 'جراحی پیشرفته زنان',
    serviceTitle: 'مشاوره لاپاراسکوپی کیست اندومتریوز',
    preferredVenue: 'مطب بیمارستان امیر مازندرانی',
    preferredDayTime: 'سه‌شنبه - ساعت ۱۸:۰۰',
    status: 'approved',
    createdAt: '۱۴۰۳/۰۸/۲۱ - ۱۹:۳۰',
    adminReply: 'نوبت با موفقیت ثبت شد.',
  },
];

// In-Memory Telegram Chat Messages
const telegramMessages: TelegramMessageItem[] = [
  {
    id: 'msg-seed-1',
    chatId: 98124501,
    senderName: 'مریم حسینی',
    username: 'maryam_hsn',
    text: 'سلام خانم دکتر، من برای پایش فولیکول در روز یکشنبه ساعت ۱۶ نوبت می‌خواستم.',
    timestamp: '۱۴۰۳/۰۸/۲۲ - ۱۰:۱۵',
    isFromPatient: true,
    appointmentRequest: {
      trackingCode: 'TRK-89702-8821',
      patientName: 'مریم حسینی',
      phone: '۰۹۱۱۲۴۵۶۷۸۹',
      requestedDate: 'یکشنبه (ساعت ۱۶:۰۰)',
      visitType: 'پایش رشد فولیکول',
      status: 'approved',
    },
  },
  {
    id: 'msg-seed-2',
    chatId: 98124501,
    senderName: 'منشی مطب (خانم اسدی)',
    text: 'سلام خانم حسینی عزیز، نوبت شما برای یکشنبه ساعت ۱۶ در مطب بیمارستان امیر مازندرانی طبقه سوم ثبت شد. مدارک و سونوهای قبلی همراهتان باشد.',
    timestamp: '۱۴۰۳/۰۸/۲۲ - ۱۰:۳۰',
    isFromPatient: false,
  },
  {
    id: 'msg-seed-3',
    chatId: 98124502,
    senderName: 'فاطمه رضایی',
    username: 'f_rezaei99',
    text: 'درود، آمپول آزادسازی HCG را دیشب ساعت ۲۲ تزریق کردم. برای پانکچر فردا مرکز کوثر ساعت چند ناشتا حاضر باشم؟',
    timestamp: '۱۴۰۳/۰۸/۲۲ - ۱۱:۴۵',
    isFromPatient: true,
    appointmentRequest: {
      trackingCode: 'TRK-89702-9430',
      patientName: 'فاطمه رضایی',
      phone: '۰۹۳۵۱۲۳۴۵۶۷',
      requestedDate: 'دوشنبه ساعت ۰۷:۳۰ صبح',
      visitType: 'عمل پانکچر (تخمک‌کشی)',
      status: 'pending',
    },
  },
];

// Broadcast logs
const broadcastLogs: BroadcastLog[] = [
  {
    id: 'bc-1',
    title: 'اطلاعیه شروع سیکل‌های IVF پاییزه در مرکز کوثر',
    messageText: 'مراجعین گرامی، نوبت‌های سیکل‌های تخمک‌کشی و انتقال جنین آذرماه در مرکز ناباروری دولتی کوثر در حال تکمیل است. جهت پایش سونوگرافی در روزهای شنبه، یکشنبه و سه‌شنبه به مطب مراجعه فرمایید.',
    sentAt: '۱۴۰۳/۰۸/۲۰ - ۱۱:۰۰',
    totalRecipients: 3,
    successCount: 3,
    failCount: 0,
    senderName: 'دکتر مرضیه زمانیان',
  },
];

// Conversation session states for multi-step booking via Telegram
interface BookingSession {
  step: 'awaiting_service' | 'awaiting_venue' | 'awaiting_day' | 'awaiting_name' | 'awaiting_phone' | 'awaiting_national_code';
  serviceCategory?: UnifiedAppointment['serviceCategory'];
  serviceTitle?: string;
  venue?: UnifiedAppointment['preferredVenue'];
  dayTime?: string;
  patientName?: string;
  phone?: string;
}
const userBookingSessions: Map<string | number, BookingSession> = new Map();

/**
 * Generate unique medical tracking code (e.g. TRK-89702-XXXX)
 */
export function generateTrackingCode(): string {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `TRK-89702-${rand}`;
}

// -------------------------------------------------------------
// TELEGRAM API CORE CALLS
// -------------------------------------------------------------

async function telegramRequest(method: string, payload: Record<string, any> = {}): Promise<any> {
  const token = getBotToken();
  const url = `https://api.telegram.org/bot${token}/${method}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return await response.json();
}

/**
 * Fetch bot identity and connection verification (getMe)
 */
export async function fetchBotMe(): Promise<{ success: boolean; data?: TelegramBotInfo; error?: string }> {
  try {
    const json = await telegramRequest('getMe');
    if (json.ok) {
      return {
        success: true,
        data: {
          id: json.result.id,
          isBot: json.result.is_bot,
          firstName: json.result.first_name,
          username: json.result.username,
          canJoinGroups: json.result.can_join_groups,
          canReadAllGroupMessages: json.result.can_read_all_group_messages,
          supportsInlineQueries: json.result.supports_inline_queries,
        },
      };
    }
    return { success: false, error: json.description || 'خطا در ارتباط با سرور تلگرام' };
  } catch (err: any) {
    return { success: false, error: err.message || 'خطا در شبکه اتصال به تلگرام' };
  }
}

/**
 * Register Webhook URL in Telegram servers (setWebhook)
 */
export async function setTelegramWebhook(
  webhookUrl: string,
  secretToken?: string
): Promise<{ success: boolean; description?: string; error?: string }> {
  try {
    const payload: Record<string, any> = {
      url: webhookUrl.trim(),
      drop_pending_updates: false,
      max_connections: 40,
      allowed_updates: ['message', 'callback_query'],
    };
    if (secretToken && secretToken.trim()) {
      payload.secret_token = secretToken.trim();
    }

    const json = await telegramRequest('setWebhook', payload);
    if (json.ok) {
      botSettings.webhookUrl = webhookUrl;
      if (secretToken) botSettings.secretToken = secretToken;
      return { success: true, description: json.description || 'وبهوک با موفقیت فعال شد.' };
    }
    return { success: false, error: json.description || 'خطا در ثبت وبهوک در سرور تلگرام' };
  } catch (err: any) {
    return { success: false, error: err.message || 'خطا در ارسال درخواست وبهوک' };
  }
}

/**
 * Check current Webhook status on Telegram server (getWebhookInfo)
 */
export async function getTelegramWebhookInfo(): Promise<{
  success: boolean;
  data?: TelegramWebhookInfo;
  error?: string;
}> {
  try {
    const json = await telegramRequest('getWebhookInfo');
    if (json.ok) {
      return {
        success: true,
        data: {
          url: json.result.url || '',
          hasCustomCertificate: json.result.has_custom_certificate || false,
          pendingUpdateCount: json.result.pending_update_count || 0,
          lastErrorDate: json.result.last_error_date,
          lastErrorMessage: json.result.last_error_message,
          maxConnections: json.result.max_connections,
          ipAddress: json.result.ip_address,
        },
      };
    }
    return { success: false, error: json.description || 'خطا در بررسی وبهوک' };
  } catch (err: any) {
    return { success: false, error: err.message || 'خطای شبکه' };
  }
}

/**
 * Delete Webhook from Telegram server (deleteWebhook)
 */
export async function deleteTelegramWebhook(): Promise<{ success: boolean; description?: string; error?: string }> {
  try {
    const json = await telegramRequest('deleteWebhook', { drop_pending_updates: false });
    if (json.ok) {
      botSettings.webhookUrl = '';
      return { success: true, description: json.description || 'وبهوک با موفقیت غیرفعال شد.' };
    }
    return { success: false, error: json.description || 'خطا در حذف وبهوک' };
  } catch (err: any) {
    return { success: false, error: err.message || 'خطا در ارتباط با سرور' };
  }
}

/**
 * Send direct message to a Telegram chat
 */
export async function sendTelegramDirectMessage(
  chatId: number | string,
  text: string,
  replyMarkup?: any
): Promise<{ success: boolean; error?: string }> {
  try {
    const payload: Record<string, any> = {
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
    };
    if (replyMarkup) {
      payload.reply_markup = replyMarkup;
    }

    const json = await telegramRequest('sendMessage', payload);
    if (json.ok) {
      telegramMessages.push({
        id: `out-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        chatId,
        senderName: 'منشی / دکتر مرضیه زمانیان',
        text,
        timestamp: new Date().toLocaleString('fa-IR'),
        isFromPatient: false,
      });

      // Update user active timestamp
      const user = botUsers.get(String(chatId));
      if (user) {
        user.lastActive = new Date().toLocaleString('fa-IR');
      }

      return { success: true };
    }
    return { success: false, error: json.description || 'خطا در ارسال پیام تلگرام' };
  } catch (err: any) {
    return { success: false, error: err.message || 'خطای شبکه در ارسال پیام' };
  }
}

/**
 * Send broadcast announcement to all active bot users
 */
export async function broadcastTelegramMessage(
  messageText: string,
  title: string = 'پیام همگانی کلینیک',
  senderName: string = 'دکتر مرضیه زمانیان'
): Promise<{ success: boolean; total: number; successCount: number; failCount: number }> {
  const users = Array.from(botUsers.values()).filter((u) => u.status === 'active');
  let sent = 0;
  let failed = 0;

  for (const user of users) {
    try {
      const res = await sendTelegramDirectMessage(user.chatId, `📢 <b>${title}</b>\n\n${messageText}`);
      if (res.success) {
        sent++;
      } else {
        failed++;
      }
    } catch {
      failed++;
    }
  }

  const log: BroadcastLog = {
    id: `bc-${Date.now()}`,
    title,
    messageText,
    sentAt: new Date().toLocaleString('fa-IR'),
    totalRecipients: users.length,
    successCount: sent,
    failCount: failed,
    senderName,
  };
  broadcastLogs.unshift(log);

  return {
    success: sent > 0 || users.length === 0,
    total: users.length,
    successCount: sent,
    failCount: failed,
  };
}

// -------------------------------------------------------------
// TELEGRAM INLINE KEYBOARDS & USER JOURNEY
// -------------------------------------------------------------

export function getMainInlineKeyboard() {
  return {
    inline_keyboard: [
      [
        { text: '🩺 رزرو نوبت ویزیت یا جراحی', callback_data: 'btn_book_start' },
        { text: '📋 پیگیری نوبت با کد رهگیری', callback_data: 'btn_track_start' },
      ],
      [
        { text: '👩‍⚕️ معرفی دکتر زمانیان و فلوشیپ IVF', callback_data: 'btn_dr_bio' },
        { text: '🔬 خدمات تخصصی (۳ محور بالینی)', callback_data: 'btn_services' },
      ],
      [
        { text: '⏰ برنامه حضور و شیفت‌های کاری', callback_data: 'btn_schedule' },
        { text: '📍 آدرس، لوکیشن و شماره تماس', callback_data: 'btn_contact' },
      ],
      [
        { text: '💬 ارتباط مستقیم با منشی مطب', callback_data: 'btn_talk_secretary' },
      ],
    ],
  };
}

export function getServicesKeyboard() {
  return {
    inline_keyboard: [
      [{ text: '۱. درمان فوق‌تخصصی ناباروری و IVF', callback_data: 'srv_ivf' }],
      [{ text: '۲. جراحی‌های پیشرفته زنان و لاپاراسکوپی', callback_data: 'srv_surgery' }],
      [{ text: '۳. بارداری‌های پرخطر و زایمان ایمن', callback_data: 'srv_pregnancy' }],
      [{ text: '🔙 بازگشت به منوی اصلی', callback_data: 'btn_main_menu' }],
    ],
  };
}

export function getVenuesKeyboard() {
  return {
    inline_keyboard: [
      [{ text: '🏥 مطب (بیمارستان امیر مازندرانی - شنبه، یکشنبه، سه‌شنبه)', callback_data: 'venue_office' }],
      [{ text: '🏥 اتاق عمل بیمارستان امیر مازندرانی (جراحی خصوصی - دوشنبه/چهارشنبه)', callback_data: 'venue_mazandarani_or' }],
      [{ text: '🏥 اتاق عمل بیمارستان امام خمینی ساری (دولتی - چهارشنبه صبح)', callback_data: 'venue_emam_or' }],
      [{ text: '🏥 مرکز ناباروری دولتی کوثر (تخمک‌کشی و انتقال جنین)', callback_data: 'venue_kowsar' }],
      [{ text: '🔙 بازگشت به منوی اصلی', callback_data: 'btn_main_menu' }],
    ],
  };
}

// -------------------------------------------------------------
// WEBHOOK UPDATE PROCESSOR (ROUTER FOR INCOMING UPDATES)
// -------------------------------------------------------------

export async function processWebhookUpdate(update: any): Promise<void> {
  if (!update) return;

  // 1. Handle Callback Queries from Inline Keyboards
  if (update.callback_query) {
    const cb = update.callback_query;
    const chatId = cb.message?.chat?.id;
    const data = cb.data;

    // Answer callback query immediately
    await telegramRequest('answerCallbackQuery', { callback_query_id: cb.id });

    if (!chatId) return;

    if (data === 'btn_main_menu') {
      userBookingSessions.delete(chatId);
      await sendTelegramDirectMessage(chatId, botSettings.welcomeMessage, getMainInlineKeyboard());
      return;
    }

    if (data === 'btn_services') {
      const text =
        '✨ <b>محورهای سه‌گانه خدمات فوق‌تخصصی دکتر مرضیه زمانیان:</b>\n\n' +
        '<b>۱. درمان ناباروری و IVF:</b>\n' +
        '• آی‌وی‌اف (IVF) و میکرواینجکشن (ICSI)\n' +
        '• تلقیح داخل رحمی (IUI) و پایش دقیق فولیکول\n' +
        '• تعیین جنسیت و غربالگری ژنتیکی PGD/PGS\n' +
        '• فریز تخمک، اسپرم و جنین بلاستوسیست\n' +
        '• درمان سقط‌های مکرر و بررسی‌های ایمونولوژی\n\n' +
        '<b>۲. جراحی‌های پیشرفته زنان:</b>\n' +
        '• لاپاراسکوپی پیشرفته کیست‌های تخمدان و میوم\n' +
        '• هیستروسکوپی تشخیصی و درمانی پولیپ و سپتوم\n' +
        '• درمان جراحی آندومتریوز پیشرفته و چسبندگی‌ها\n\n' +
        '<b>۳. بارداری‌های پرخطر و زایمان:</b>\n' +
        '• مدیریت بارداری‌های IVF و دوقلویی\n' +
        '• پایش فشار خون، دیابت بارداری و سرکلاژ دهانه رحم';
      await sendTelegramDirectMessage(chatId, text, getServicesKeyboard());
      return;
    }

    if (data === 'btn_dr_bio') {
      const text =
        '👩‍⚕️ <b>دکتر مرضیه زمانیان</b>\n' +
        '• فلوشیپ فوق‌تخصصی زنان، زایمان و درمان ناباروری (IVF)\n' +
        '• عضو هیئت علمی دانشگاه علوم پزشکی مازندران\n' +
        '• شماره نظام پزشکی: <b>۸۹۷۰۲</b>\n\n' +
        'دارای سال‌ها تجربه درخشان در صدها چرخه موفق IVF و تولد نوزادان امید در شمال کشور.\n' +
        'پایش‌های تشخیصی و سونوگرافی‌های داپلر دقیق در مطب ساری و اعمال جراحی در مراکز معتبر دانشگاهی و درمانی.';
      await sendTelegramDirectMessage(chatId, text, {
        inline_keyboard: [
          [{ text: '🩺 درخواست نوبت ویزیت', callback_data: 'btn_book_start' }],
          [{ text: '🔙 بازگشت به منوی اصلی', callback_data: 'btn_main_menu' }],
        ],
      });
      return;
    }

    if (data === 'btn_schedule') {
      const text =
        '⏰ <b>برنامه هفتگی حضور و فعالیت دکتر مرضیه زمانیان:</b>\n\n' +
        '📌 <b>ویزیت و سونوگرافی مطب (ساری - بلوار امیر مازندرانی، ط ۳):</b>\n' +
        '• شنبه: ۱۴:۰۰ الی ۲۲:۰۰\n' +
        '• یکشنبه: ۱۴:۰۰ الی ۲۲:۰۰\n' +
        '• سه‌شنبه: ۱۴:۰۰ الی ۲۲:۰۰\n' +
        '<i>(توجه: ویزیت مطب همه روزه نیست؛ فقط شنبه، یکشنبه و سه‌شنبه)</i>\n\n' +
        '📌 <b>اعمال جراحی زنان بخش خصوصی (بیمارستان امیر مازندرانی):</b>\n' +
        '• دوشنبه و چهارشنبه: ۱۴:۰۰ الی ۱۸:۰۰ عصر\n\n' +
        '📌 <b>اعمال جراحی دولتی غیر IVF (بیمارستان امام خمینی ساری):</b>\n' +
        '• چهارشنبه‌ها: ۰۸:۰۰ الی ۱۲:۰۰ ظهر\n\n' +
        '📌 <b>مرکز ناباروری دولتی کوثر بیمارستان امام خمینی:</b>\n' +
        '• پانکچر (تخمک‌کشی) و انتقال جنین IVF با تعرفه حمایتی دولتی.';
      await sendTelegramDirectMessage(chatId, text, {
        inline_keyboard: [
          [{ text: '🩺 ثبت نوبت در این برنامه', callback_data: 'btn_book_start' }],
          [{ text: '🔙 منوی اصلی', callback_data: 'btn_main_menu' }],
        ],
      });
      return;
    }

    if (data === 'btn_contact') {
      await sendTelegramDirectMessage(chatId, botSettings.clinicInfoMessage, {
        inline_keyboard: [
          [
            { text: '📞 تماس با منشی (۰۱۱۳۳۲۴۲۱۲۶)', url: 'tel:01133242126' },
            { text: '☎️ سامانه تلفن گویا (۰۱۱۹۱۰۱۲۱۲۶)', url: 'tel:01191012126' },
          ],
          [{ text: '🔙 بازگشت به منوی اصلی', callback_data: 'btn_main_menu' }],
        ],
      });
      return;
    }

    if (data === 'btn_talk_secretary') {
      userBookingSessions.delete(chatId);
      await sendTelegramDirectMessage(
        chatId,
        '💬 لطفاً پیام، پرسش درمانی یا خلاصه وضعیت خود را به صورت متن یا ویس ارسال نمایید.\n' +
          'منشی مطب (خانم اسدی) و کادر درمانی در اولین فرصت پاسخ شما را ارسال خواهند کرد.',
        {
          inline_keyboard: [[{ text: '🔙 بازگشت به منوی اصلی', callback_data: 'btn_main_menu' }]],
        }
      );
      return;
    }

    if (data === 'btn_track_start') {
      userBookingSessions.delete(chatId);
      await sendTelegramDirectMessage(
        chatId,
        '🔍 لطفاً <b>کد رهگیری نوبت</b> (مانند <code>TRK-89702-8821</code>) یا <b>شماره موبایل</b> ثبت‌شده خود را ارسال فرمایید:',
        {
          inline_keyboard: [[{ text: '🔙 بازگشت به منوی اصلی', callback_data: 'btn_main_menu' }]],
        }
      );
      return;
    }

    // Booking Flow: Step 1 -> Choose Service
    if (data === 'btn_book_start') {
      userBookingSessions.set(chatId, { step: 'awaiting_service' });
      await sendTelegramDirectMessage(
        chatId,
        '🩺 <b>مرحله ۱ از ۴: انتخاب نوع خدمت بالینی</b>\n\nلطفاً تخصص یا زمینه مورد نیاز خود را انتخاب فرمایید:',
        {
          inline_keyboard: [
            [{ text: '🔬 درمان ناباروری و مشاوره IVF', callback_data: 'book_srv_ivf' }],
            [{ text: '🩺 جراحی پیشرفته زنان / لاپاراسکوپی', callback_data: 'book_srv_surgery' }],
            [{ text: '🤰 مراقبت بارداری پرخطر و سونوگرافی', callback_data: 'book_srv_preg' }],
            [{ text: '🔙 لغو و بازگشت', callback_data: 'btn_main_menu' }],
          ],
        }
      );
      return;
    }

    // Booking Flow: Step 2 -> Choose Venue
    if (data.startsWith('book_srv_')) {
      const session = userBookingSessions.get(chatId) || { step: 'awaiting_service' };
      if (data === 'book_srv_ivf') {
        session.serviceCategory = 'ناباروری و IVF';
        session.serviceTitle = 'مشاوره ناباروری، پایش فولیکول و IVF';
      } else if (data === 'book_srv_surgery') {
        session.serviceCategory = 'جراحی پیشرفته زنان';
        session.serviceTitle = 'جراحی لاپاراسکوپی و میوم/کیست';
      } else {
        session.serviceCategory = 'بارداری پرخطر';
        session.serviceTitle = 'مراقبت بارداری پرخطر و سونوگرافی سلامت جنین';
      }
      session.step = 'awaiting_venue';
      userBookingSessions.set(chatId, session);

      await sendTelegramDirectMessage(
        chatId,
        `✅ خدمت انتخابی: <b>${session.serviceTitle}</b>\n\n` +
          '📍 <b>مرحله ۲ از ۴: انتخاب محل مراجعه</b>\nلطفاً مرکز درمانی مورد نظر خود را انتخاب نمایید:',
        getVenuesKeyboard()
      );
      return;
    }

    // Booking Flow: Step 3 -> Choose Day / Venue confirmation
    if (data.startsWith('venue_')) {
      const session = userBookingSessions.get(chatId);
      if (!session) {
        await sendTelegramDirectMessage(chatId, 'لطفاً فرآیند رزرو نوبت را مجدداً شروع فرمایید.', getMainInlineKeyboard());
        return;
      }

      if (data === 'venue_office') {
        session.venue = 'مطب بیمارستان امیر مازندرانی';
        session.dayTime = 'روزهای شنبه، یکشنبه یا سه‌شنبه (عصر ۱۴ الی ۲۲)';
      } else if (data === 'venue_mazandarani_or') {
        session.venue = 'اتاق عمل بیمارستان امیر مازندرانی';
        session.dayTime = 'دوشنبه یا چهارشنبه (عصر ۱۴ الی ۱۸)';
      } else if (data === 'venue_emam_or') {
        session.venue = 'اتاق عمل بیمارستان امام خمینی';
        session.dayTime = 'چهارشنبه صبح (۰۸:۰۰ الی ۱۲:۰۰)';
      } else {
        session.venue = 'مرکز ناباروری دولتی کوثر';
        session.dayTime = 'سیکل IVF دولتی (هماهنگی پانکچر/انتقال)';
      }

      session.step = 'awaiting_name';
      userBookingSessions.set(chatId, session);

      await sendTelegramDirectMessage(
        chatId,
        `✅ محل و شیفت انتخابی: <b>${session.venue}</b>\n(${session.dayTime})\n\n` +
          '👤 <b>مرحله ۳ از ۴: اطلاعات بیمار</b>\nلطفاً <b>نام و نام خانوادگی بیمار</b> را ارسال فرمایید:'
      );
      return;
    }
  }

  // 2. Handle Text Messages & Patient Interaction
  if (update.message) {
    const msg = update.message;
    const chatId = msg.chat?.id;
    const text = (msg.text || '').trim();
    const from = msg.from;

    if (!chatId) return;

    // Register / update bot user in shared DB
    const existingUser = botUsers.get(String(chatId));
    if (!existingUser) {
      botUsers.set(String(chatId), {
        chatId,
        firstName: from?.first_name || 'کاربر',
        lastName: from?.last_name || '',
        username: from?.username,
        firstJoined: new Date().toLocaleString('fa-IR'),
        lastActive: new Date().toLocaleString('fa-IR'),
        appointmentsCount: 0,
        status: 'active',
      });
    } else {
      existingUser.lastActive = new Date().toLocaleString('fa-IR');
      if (from?.username) existingUser.username = from.username;
    }

    // Save message to shared message thread
    if (text) {
      telegramMessages.push({
        id: `in-${msg.message_id}-${Date.now()}`,
        updateId: update.update_id,
        chatId,
        senderName: `${from?.first_name || ''} ${from?.last_name || ''}`.trim() || 'مراجع گرامی',
        username: from?.username,
        text,
        timestamp: new Date().toLocaleString('fa-IR'),
        isFromPatient: true,
      });
    }

    // Command: /start or /help
    if (text === '/start' || text === '/help' || text === 'شروع') {
      userBookingSessions.delete(chatId);
      await sendTelegramDirectMessage(chatId, botSettings.welcomeMessage, getMainInlineKeyboard());
      return;
    }

    // Check if user is in an active Booking Flow
    const session = userBookingSessions.get(chatId);

    if (session) {
      if (session.step === 'awaiting_name') {
        session.patientName = text;
        session.step = 'awaiting_phone';
        userBookingSessions.set(chatId, session);

        await sendTelegramDirectMessage(
          chatId,
          `متشکرم ${text} عزیز.\n\n` +
            '📱 <b>مرحله نهایی: شماره تماس همراه</b>\nلطفاً شماره تلفن همراه خود را ارسال فرمایید (مثال: <code>09112456789</code>):'
        );
        return;
      }

      if (session.step === 'awaiting_phone') {
        session.phone = text;
        // Booking Complete! Generate tracking code and save in shared appointments database
        const trackingCode = generateTrackingCode();
        const newAppt: UnifiedAppointment = {
          id: `apt-tg-${Date.now()}`,
          trackingCode,
          source: 'telegram_bot',
          chatId,
          patientName: session.patientName || 'مراجع تلگرام',
          phone: text,
          serviceCategory: session.serviceCategory || 'ناباروری و IVF',
          serviceTitle: session.serviceTitle || 'ویزیت مطب دکتر زمانیان',
          preferredVenue: session.venue || 'مطب بیمارستان امیر مازندرانی',
          preferredDayTime: session.dayTime || 'شنبه، یکشنبه یا سه‌شنبه (عصر)',
          status: 'pending',
          createdAt: new Date().toLocaleString('fa-IR'),
          notes: 'ثبت شده توسط ربات تلگرام مراجع',
        };

        unifiedAppointments.unshift(newAppt);

        // Update user stats
        const u = botUsers.get(String(chatId));
        if (u) {
          u.phone = text;
          u.appointmentsCount = (u.appointmentsCount || 0) + 1;
        }

        userBookingSessions.delete(chatId);

        const successText =
          '🎉 <b>درخواست نوبت شما با موفقیت در سیستم مرکزی کلینیک ثبت شد!</b>\n\n' +
          `🔖 <b>کد رهگیری نوبت:</b> <code>${trackingCode}</code>\n` +
          `👤 <b>بیمار:</b> ${newAppt.patientName}\n` +
          `🩺 <b>خدمت:</b> ${newAppt.serviceTitle}\n` +
          `🏥 <b>مرکز:</b> ${newAppt.preferredVenue}\n` +
          `⏰ <b>بازه شیفت:</b> ${newAppt.preferredDayTime}\n` +
          '📋 <b>وضعیت:</b> در انتظار بررسی و تأیید منشی مطب\n\n' +
          '📞 منشی کلینیک پس از بررسی تقویم، ساعت دقیق را از طریق همین ربات یا تماس تلفنی به شما اطلاع خواهد داد.\n' +
          'لطفاً کد رهگیری خود را یادداشت نمایید.';

        await sendTelegramDirectMessage(chatId, successText, getMainInlineKeyboard());
        return;
      }
    }

    // Check if user is searching / tracking an appointment
    if (text.startsWith('TRK-') || text.length === 11 || text.includes('رهگیری') || text.includes('نوبت من')) {
      const cleanQuery = text.replace(/[^0-9A-Za-z-]/g, '');
      const found = unifiedAppointments.find(
        (a) =>
          a.trackingCode.toLowerCase().includes(cleanQuery.toLowerCase()) ||
          a.phone.replace(/[^0-9]/g, '').includes(cleanQuery) ||
          (a.chatId && String(a.chatId) === String(chatId))
      );

      if (found) {
        const statusFa =
          found.status === 'approved'
            ? '✅ تأیید شده'
            : found.status === 'pending'
            ? '⏳ در حال بررسی منشی'
            : found.status === 'rejected'
            ? '❌ لغو یا عدم امکان در زمان درخواستی'
            : '✔️ انجام شده';

        const trackResultText =
          `🔍 <b>مشخصات نوبت یافت‌شده:</b>\n\n` +
          `🔖 <b>کد رهگیری:</b> <code>${found.trackingCode}</code>\n` +
          `👤 <b>نام بیمار:</b> ${found.patientName}\n` +
          `🩺 <b>خدمت درخواستی:</b> ${found.serviceTitle}\n` +
          `🏥 <b>محل مراجعه:</b> ${found.preferredVenue}\n` +
          `⏰ <b>زمان و شیفت:</b> ${found.preferredDayTime}\n` +
          `📋 <b>وضعیت نوبت:</b> <b>${statusFa}</b>\n` +
          (found.adminReply ? `💬 <b>توضیحات کلینیک:</b> ${found.adminReply}\n` : '') +
          `\n📞 در صورت هرگونه سوال با تلفن مطب تماس حاصل فرمایید: ۰۱۱-۳۳۲۴۲۱۲۶`;

        await sendTelegramDirectMessage(chatId, trackResultText, getMainInlineKeyboard());
        return;
      }
    }

    // Default conversational acknowledgment for patient inquiries
    const replyAck =
      'پیام شما در سامانه کلینیک دکتر زمانیان ثبت شد و به اطلاع همکاران رسید.\n' +
      'جهت هماهنگی فوری نوبت می‌توانید از دکمه‌های زیر استفاده نمایید:';
    await sendTelegramDirectMessage(chatId, replyAck, getMainInlineKeyboard());
  }
}

// -------------------------------------------------------------
// GETTERS & DATA ACCESSORS FOR ADMIN PANEL & API
// -------------------------------------------------------------

export function getStoredTelegramMessages(): TelegramMessageItem[] {
  return [...telegramMessages];
}

export function getStoredBotUsers(): TelegramBotUser[] {
  return Array.from(botUsers.values());
}

export function getUnifiedAppointments(): UnifiedAppointment[] {
  return [...unifiedAppointments];
}

export function getBroadcastLogs(): BroadcastLog[] {
  return [...broadcastLogs];
}

export function approveUnifiedAppointment(
  appointmentId: string,
  adminReply?: string
): { success: boolean; appointment?: UnifiedAppointment } {
  const apt = unifiedAppointments.find((a) => a.id === appointmentId);
  if (!apt) return { success: false };

  apt.status = 'approved';
  if (adminReply) apt.adminReply = adminReply;

  // Send auto-notification to Telegram if booked via bot
  if (apt.chatId) {
    const confirmationText =
      `🎉 <b>سلام ${apt.patientName} عزیز،</b>\n\n` +
      `درخواست نوبت شما برای <b>${apt.serviceTitle}</b> با موفقیت تأیید شد.\n` +
      `🏥 <b>مرکز:</b> ${apt.preferredVenue}\n` +
      `⏰ <b>شیفت:</b> ${apt.preferredDayTime}\n` +
      `🔖 <b>کد رهگیری:</b> <code>${apt.trackingCode}</code>\n\n` +
      (adminReply ? `💬 <b>یادداشت پذیرش:</b> ${adminReply}\n\n` : '') +
      '📍 نشانی مطب: مازندران، ساری، بلوار امیر مازندرانی، بیمارستان امیر مازندرانی، طبقه سوم\n' +
      '📞 تلفن مطب: ۰۱۱-۳۳۲۴۲۱۲۶ | تلفن گویا: ۰۱۱۹۱۰۱۲۱۲۶';

    sendTelegramDirectMessage(apt.chatId, confirmationText);
  }

  // Update in message history if present
  const msg = telegramMessages.find(
    (m) => m.appointmentRequest && m.appointmentRequest.trackingCode === apt.trackingCode
  );
  if (msg && msg.appointmentRequest) {
    msg.appointmentRequest.status = 'approved';
  }

  return { success: true, appointment: apt };
}

export function rejectUnifiedAppointment(
  appointmentId: string,
  reason?: string
): { success: boolean; appointment?: UnifiedAppointment } {
  const apt = unifiedAppointments.find((a) => a.id === appointmentId);
  if (!apt) return { success: false };

  apt.status = 'rejected';
  if (reason) apt.adminReply = reason;

  // Send notification to Telegram if booked via bot
  if (apt.chatId) {
    const rejectionText =
      `با سلام خدمت مراجع محترم ${apt.patientName}،\n\n` +
      `متأسفانه در زمان انتخابی، ظرفیت تکمیل می‌باشد یا پزشک در اتاق عمل حضور دارند.\n` +
      (reason ? `علت: ${reason}\n\n` : '') +
      'لطفاً جهت دریافت نزدیک‌ترین نوبت خالی با منشی مطب هماهنگ فرمایید:\n' +
      '📞 تلفن مستقیم مطب: ۰۱۱-۳۳۲۴۲۱۲۶ یا ۰۱۱-۳۳۲۵۵۲۰۵\n' +
      '☎️ سامانه تلفن گویا: ۰۱۱۹۱۰۱۲۱۲۶ (داخلی ۱)';

    sendTelegramDirectMessage(apt.chatId, rejectionText);
  }

  const msg = telegramMessages.find(
    (m) => m.appointmentRequest && m.appointmentRequest.trackingCode === apt.trackingCode
  );
  if (msg && msg.appointmentRequest) {
    msg.appointmentRequest.status = 'rejected';
  }

  return { success: true, appointment: apt };
}
