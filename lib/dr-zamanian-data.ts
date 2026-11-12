export interface Patient {
  id: string;
  fileNumber: string; // e.g. "1042"
  nationalId: string; // کد ملی
  fullName: string;
  age: number;
  phone: string;
  partnerName: string;
  treatmentType: 'IVF' | 'ICSI' | 'IUI' | 'FET' | 'پایش تخمک‌گذاری' | 'مشاوره اولیه';
  cyclePhase: 'تحریک تخمک‌گذاری' | 'پایش فولیکول' | 'آماده‌سازی پانکچر' | 'کشت جنین' | 'آماده انتقال' | 'بارداری تأییدشده';
  doctor: string;
  lastVisit: string;
  notesCount: number;
  criticalAlert?: string;
  protocol?: string;
  folliclesRight?: number[]; // mm sizes
  folliclesLeft?: number[];  // mm sizes
  endometriumThickness?: number; // mm
}

export interface AppointmentQueueItem {
  id: string;
  fileNumber: string;
  patientName: string;
  patientId: string;
  age: number;
  visitType: 'پایش فولیکول' | 'پانکچر (تخمک‌کشی)' | 'انتقال جنین (ET)' | 'سونوگرافی کنترل' | 'مشاوره اول' | 'تزریق HCG';
  time: string;
  status: 'منتظر' | 'در حال ویزیت' | 'انجام شد' | 'انتقال به اتاق عمل';
  priority: 'عادی' | 'اورژانسی' | 'زمان‌حساس (HCG)';
  room: string;
  notes?: string;
}

export interface MedicationAlert {
  id: string;
  fileNumber: string;
  patientName: string;
  type: 'HCG_TRIGGER' | 'OHSS_RISK' | 'PROGESTERONE_START' | 'EMBRYO_THAW';
  title: string;
  dueTime: string;
  actionRequired: string;
  status: 'pending' | 'acknowledged' | 'completed';
}

export interface EmbryologyLabSample {
  id: string;
  fileNumber: string;
  coupleNames: string;
  procedureDate: string;
  oocytesRetrieved: number;
  matureMII: number;
  fertilized2PN: number;
  day3Embryos: number;
  blastocystsDay5: number;
  frozenStraws: number;
  storageTankLocation: string; // e.g. "تانک نیتروژن A - کانیستر ۲"
  status: 'در حال انکوباسیون' | 'آماده انتقال' | 'فریز شده' | 'تکمیل چرخه';
}

export interface SecurityAuditLog {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: string;
  action: 'مشاهده پرونده ناباروری' | 'ویرایش پروتکل دارویی' | 'ثبت شرح حال و سونوگرافی' | 'خروجی گزارش مالی' | 'مشاهده لاگ دسترسی';
  patientFileNumber?: string;
  patientName?: string;
  ipAddress: string;
  status: 'موفق' | 'رد شده (عدم دسترسی)';
}

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'pat-1042',
    fileNumber: '1042',
    nationalId: '0018492041',
    fullName: 'مریم رضایی',
    age: 32,
    phone: '09121114455',
    partnerName: 'علی رضایی (آزواسپرمی انسدادی)',
    treatmentType: 'ICSI',
    cyclePhase: 'پایش فولیکول',
    doctor: 'دکتر زمانین',
    lastVisit: 'امروز - ۱۰:۱۵',
    notesCount: 6,
    criticalAlert: 'نیازمند اعلام ساعت دقیق تزریق HCG (فولیکول‌های بالای ۱۸ میلی‌متر)',
    protocol: 'آنتاگونیست انعطاف‌پذیر (Gonal-F 225 IU + Cetrotide)',
    folliclesRight: [19, 18, 16, 14, 12],
    folliclesLeft: [20, 17, 15, 13],
    endometriumThickness: 10.2,
  },
  {
    id: 'pat-1043',
    fileNumber: '1043',
    nationalId: '0459201128',
    fullName: 'فاطمه حسینی',
    age: 29,
    phone: '09128889922',
    partnerName: 'مهدی حسینی',
    treatmentType: 'IVF',
    cyclePhase: 'آماده‌سازی پانکچر',
    doctor: 'دکتر زمانین',
    lastVisit: 'امروز - ۰۸:۳۰',
    notesCount: 8,
    criticalAlert: 'پانکچر فردا صبح ساعت ۰۷:۳۰ در اتاق عمل ۱',
    protocol: 'میکروفلر آگونیست',
    folliclesRight: [21, 19, 18, 17],
    folliclesLeft: [20, 19, 16, 15],
    endometriumThickness: 11.0,
  },
  {
    id: 'pat-1044',
    fileNumber: '1044',
    nationalId: '0067341902',
    fullName: 'سارا کاظمی',
    age: 36,
    phone: '09353334411',
    partnerName: 'کامران کاظمی',
    treatmentType: 'FET',
    cyclePhase: 'آماده انتقال',
    doctor: 'دکتر زمانین',
    lastVisit: 'دیروز',
    notesCount: 11,
    protocol: 'سیکل هورمونی HRT با استرادیول و پروژسترون',
    endometriumThickness: 9.8,
  },
  {
    id: 'pat-1045',
    fileNumber: '1045',
    nationalId: '0078129033',
    fullName: 'زهرا موسوی',
    age: 34,
    phone: '09124447788',
    partnerName: 'حسین موسوی',
    treatmentType: 'ICSI',
    cyclePhase: 'تحریک تخمک‌گذاری',
    doctor: 'دکتر زمانین',
    lastVisit: '۳ روز پیش',
    notesCount: 4,
    protocol: 'آنتاگونیست استاندارد',
    folliclesRight: [14, 13, 11],
    folliclesLeft: [13, 12, 10],
    endometriumThickness: 7.5,
  },
  {
    id: 'pat-1046',
    fileNumber: '1046',
    nationalId: '0029810452',
    fullName: 'الهام سعادت',
    age: 38,
    phone: '09125556633',
    partnerName: 'بهروز سعادت',
    treatmentType: 'IVF',
    cyclePhase: 'بارداری تأییدشده',
    doctor: 'دکتر زمانین',
    lastVisit: 'هفته گذشته',
    notesCount: 15,
    protocol: 'بارداری بالینی هفته ۷ - رویت ضربان قلب جنین',
  },
];

export const INITIAL_QUEUE: AppointmentQueueItem[] = [
  {
    id: 'q-1',
    fileNumber: '1042',
    patientName: 'مریم رضایی',
    patientId: 'pat-1042',
    age: 32,
    visitType: 'پایش فولیکول',
    time: '۱۰:۳۰',
    status: 'منتظر',
    priority: 'زمان‌حساس (HCG)',
    room: 'اتاق سونوگرافی ۲',
    notes: 'پایش روز ۱۱ سیکل - فولیکول‌های غالب ۱۸ و ۱۹ میلی‌متر',
  },
  {
    id: 'q-2',
    fileNumber: '1043',
    patientName: 'فاطمه حسینی',
    patientId: 'pat-1043',
    age: 29,
    visitType: 'پانکچر (تخمک‌کشی)',
    time: '۱۱:۰۰',
    status: 'در حال ویزیت',
    priority: 'اورژانسی',
    room: 'اتاق عمل شماره ۱',
    notes: 'آماده‌سازی نهایی قبل از ترخیص بخش جراحی محدود',
  },
  {
    id: 'q-3',
    fileNumber: '1044',
    patientName: 'سارا کاظمی',
    patientId: 'pat-1044',
    age: 36,
    visitType: 'انتقال جنین (ET)',
    time: '۱۱:۳۰',
    status: 'منتظر',
    priority: 'عادی',
    room: 'اتاق عمل شماره ۲',
    notes: 'انتقال ۲ بلاستوسیست گرید A فریز شده',
  },
  {
    id: 'q-4',
    fileNumber: '1047',
    patientName: 'نرگس ابراهیمی',
    patientId: 'pat-1047',
    age: 31,
    visitType: 'سونوگرافی کنترل',
    time: '۱۲:۰۰',
    status: 'منتظر',
    priority: 'عادی',
    room: 'اتاق سونوگرافی ۱',
    notes: 'بررسی ضخامت اندومتر روز ۱۳ سیکل FET',
  },
  {
    id: 'q-5',
    fileNumber: '1048',
    patientName: 'لیلا یوسفی',
    patientId: 'pat-1048',
    age: 35,
    visitType: 'مشاوره اول',
    time: '۱۲:۳۰',
    status: 'منتظر',
    priority: 'عادی',
    room: 'مطب پزشک ۱',
    notes: 'پرونده جدید ناباروری اولیه - بررسی آزمایش AMH و اسپرموگرام',
  },
  {
    id: 'q-6',
    fileNumber: '1049',
    patientName: 'پروانه نظری',
    patientId: 'pat-1049',
    age: 33,
    visitType: 'تزریق HCG',
    time: '۱۳:۰۰',
    status: 'منتظر',
    priority: 'زمان‌حساس (HCG)',
    room: 'بخش تزریقات بالینی',
    notes: 'تعیین ساعت دقیق ۳۶ ساعت قبل از عمل تخمک‌کشی',
  },
];

export const INITIAL_ALERTS: MedicationAlert[] = [
  {
    id: 'alt-1',
    fileNumber: '1042',
    patientName: 'مریم رضایی',
    type: 'HCG_TRIGGER',
    title: 'تعیین زمان تزریق محرک تخمک‌گذاری (HCG Trigger)',
    dueTime: 'امروز تا ساعت ۱۶:۰۰',
    actionRequired: 'با توجه به ۲ فولیکول بالای ۱۸mm، زمان تزریق آمپول اوویترل دقیقاً تعیین و به بیمار پیامک شود.',
    status: 'pending',
  },
  {
    id: 'alt-2',
    fileNumber: '1050',
    patientName: 'شیما علیزاده',
    type: 'HCG_TRIGGER',
    title: 'تأیید زمان تزریق تریگر دکاپپتیل برای جلوگیری از OHSS',
    dueTime: 'امروز تا ساعت ۱۹:۰۰',
    actionRequired: '۲۲ فولیکول مشاهده شد. تجویز دکاپپتیل ۰.۲ به جای HCG جهت پیشگیری از سندرم تحریک بیش از حد.',
    status: 'pending',
  },
  {
    id: 'alt-3',
    fileNumber: '1051',
    patientName: 'آرزو مرادی',
    type: 'HCG_TRIGGER',
    title: 'هماهنگی تزریق گنادوتروپین و اعلام زمان پانکچر',
    dueTime: 'امروز تا ساعت ۲۰:۰۰',
    actionRequired: 'ارسال دستور تزریق سرم و HCG با ثبت امضای الکترونیک پزشک.',
    status: 'pending',
  },
  {
    id: 'alt-4',
    fileNumber: '1043',
    patientName: 'فاطمه حسینی',
    type: 'EMBRYO_THAW',
    title: 'ارسال نمونه‌های پانکچر به آزمایشگاه جنین‌شناسی',
    dueTime: 'امروز - انجام شده',
    actionRequired: 'ثبت تعداد اووسیت‌های دریافت شده در سامانه آزمایشگاه جنین‌شناسی',
    status: 'completed',
  },
];

export const INITIAL_EMBRYOLOGY_SAMPLES: EmbryologyLabSample[] = [
  {
    id: 'emb-101',
    fileNumber: '1043',
    coupleNames: 'فاطمه حسینی / مهدی حسینی',
    procedureDate: 'امروز',
    oocytesRetrieved: 14,
    matureMII: 11,
    fertilized2PN: 9,
    day3Embryos: 8,
    blastocystsDay5: 5,
    frozenStraws: 3,
    storageTankLocation: 'تانک کرایو A - کانیستر ۲ - استرا ۴',
    status: 'در حال انکوباسیون',
  },
  {
    id: 'emb-102',
    fileNumber: '1044',
    coupleNames: 'سارا کاظمی / کامران کاظمی',
    procedureDate: 'ماه گذشته',
    oocytesRetrieved: 16,
    matureMII: 14,
    fertilized2PN: 12,
    day3Embryos: 10,
    blastocystsDay5: 7,
    frozenStraws: 4,
    storageTankLocation: 'تانک کرایو B - کانیستر ۱ - استرا ۱',
    status: 'آماده انتقال',
  },
  {
    id: 'emb-103',
    fileNumber: '1038',
    coupleNames: 'مونا کمالی / رضا کمالی',
    procedureDate: '۳ روز پیش',
    oocytesRetrieved: 9,
    matureMII: 8,
    fertilized2PN: 7,
    day3Embryos: 6,
    blastocystsDay5: 4,
    frozenStraws: 2,
    storageTankLocation: 'تانک کرایو A - کانیستر ۳ - استرا ۵',
    status: 'فریز شده',
  },
];

export const INITIAL_SECURITY_LOGS: SecurityAuditLog[] = [
  {
    id: 'log-1',
    timestamp: '۱۱:۲۸:۴۰',
    actorName: 'دکتر زمانین',
    actorRole: 'مدیر ارشد و فلوشیپ ناباروری',
    action: 'مشاهده پرونده ناباروری',
    patientFileNumber: '1042',
    patientName: 'مریم رضایی',
    ipAddress: '192.168.1.10 (اتاق پزشک ۱)',
    status: 'موفق',
  },
  {
    id: 'log-2',
    timestamp: '۱۱:۱۵:۱۲',
    actorName: 'دکتر زمانین',
    actorRole: 'مدیر ارشد و فلوشیپ ناباروری',
    action: 'ویرایش پروتکل دارویی',
    patientFileNumber: '1043',
    patientName: 'فاطمه حسینی',
    ipAddress: '192.168.1.10 (اتاق پزشک ۱)',
    status: 'موفق',
  },
  {
    id: 'log-3',
    timestamp: '۱۰:۵۰:۰۱',
    actorName: 'خانم اکبری',
    actorRole: 'کارشناس جنین‌شناسی',
    action: 'ثبت شرح حال و سونوگرافی',
    patientFileNumber: '1043',
    patientName: 'فاطمه حسینی',
    ipAddress: '192.168.1.45 (آزمایشگاه جنین)',
    status: 'موفق',
  },
  {
    id: 'log-4',
    timestamp: '۱۰:۳۰:۲۲',
    actorName: 'منشی مطب (خانم اسدی)',
    actorRole: 'پذیرش و نوبت‌دهی (داخلی ۱)',
    action: 'مشاهده پرونده ناباروری',
    patientFileNumber: '1044',
    patientName: 'سارا کاظمی',
    ipAddress: '192.168.1.102 (کانتر پذیرش)',
    status: 'موفق',
  },
  {
    id: 'log-4b',
    timestamp: '۱۰:۱۲:۱۴',
    actorName: 'مشاور درمانی (خانم جعفری)',
    actorRole: 'مشاوره ناباروری (داخلی ۲)',
    action: 'مشاهده پرونده ناباروری',
    patientFileNumber: '1042',
    patientName: 'مریم رضایی',
    ipAddress: '192.168.1.104 (اتاق مشاوره)',
    status: 'موفق',
  },
  {
    id: 'log-5',
    timestamp: '۰۹:۴۵:۱۸',
    actorName: 'کاربر سیستم',
    actorRole: 'حسابداری کلینیک',
    action: 'خروجی گزارش مالی',
    ipAddress: '192.168.1.80 (واحد مالی)',
    status: 'موفق',
  },
];

export const CLINIC_HEADER_INFO = {
  clinicName: 'مطب و کلینیک فوق‌تخصصی دکتر زمانیان',
  subTitle: 'ساری، بیمارستان امیر مازندرانی (ط ۳) | جراحی‌های IVF: بخش کوثر بیمارستان امام خمینی',
  doctorName: 'دکتر مرضیه زمانیان',
  doctorCouncilId: '۸۹۷۰۲',
  drdrUrl: 'https://drdr.ir/dr/89702',
  doctorTitle: 'فلوشیپ فوق‌تخصصی زنان، زایمان و درمان ناباروری (IVF) - نظام پزشکی: ۸۹۷۰۲',
  currentRole: 'مدیر ارشد کلینیک (Super Admin)',
  todayJalali: 'چهارشنبه ۲۱ آبان ۱۴۰۵',
  address: 'مازندران، ساری، بلوار امیر مازندرانی، بیمارستان امیر مازندرانی، طبقه سوم، مطب دکتر زمانیان',
  postalCode: '۴۸۱۶۷۴۵۳۶۵',
  surgeryCenter: 'بخش ناباروری دولتی کوثر بیمارستان امام خمینی ساری',
  surgeryNotice: 'کلیه کارهای جراحی مربوط به IVF در بخش ناباروری دولتی کوثر بیمارستان امام خمینی ساری انجام می‌شود.',
};
