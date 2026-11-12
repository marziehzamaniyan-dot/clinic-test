export interface PregnancySuccessStory {
  id: string;
  patientInitials: string; // e.g. "خانم مریم ح. و همسر" or "فاطمه رضایی"
  city: string; // e.g. "ساری", "بابل", "قائم‌شهر", "آمل"
  infertilityDuration: string; // e.g. "۶ سال انتظار و تلاش"
  treatmentType: 'IVF' | 'ICSI' | 'FROZEN_EMBRYO' | 'MEDICATION_MONITORING' | 'HYSTEROSCOPY';
  treatmentTypeLabel: string;
  treatmentLocation: string; // e.g. "عمل پانکچر و انتقال در مرکز ناباروری کوثر بیمارستان امام خمینی ساری"
  babyName: string; // e.g. "رادین کوچولو", "دوقلوها: آرتین و آوینا"
  babyBirthDate: string; // e.g. "اردیبهشت ۱۴۰۳"
  babyAge: string; // e.g. "۵ ماهه"
  photoUrl: string; // image path or base64 data url
  satisfactionRating: number; // 1-5 stars
  quote: string; // short emotional excerpt for the card
  storyText: string; // detailed journey and satisfaction narrative
  writtenConsentObtained: boolean; // medical ethics & Iranian patient privacy consent verification
  consentArchiveCode: string; // e.g. "FORM-CS-1402/89702"
  doctorNote: string; // Dr. Zamanian's clinical comment
  published: boolean;
  createdAt: string;
}

export const INITIAL_PREGNANCY_STORIES: PregnancySuccessStory[] = [
  {
    id: 'story-1',
    patientInitials: 'خانم مریم ح. و همسر',
    city: 'ساری',
    infertilityDuration: '۶ سال انتظار برای فرزند اول',
    treatmentType: 'IVF',
    treatmentTypeLabel: 'جراحی IVF و انتقال جنین در بیمارستان کوثر',
    treatmentLocation: 'پایش فولیکول در مطب ساری | عمل پانکچر و انتقال در بخش ناباروری کوثر بیمارستان امام خمینی',
    babyName: 'رادین عزیز',
    babyBirthDate: 'تیرماه ۱۴۰۳',
    babyAge: '۵ ماهه',
    photoUrl: '/assets/baby_family_success.jpg',
    satisfactionRating: 5,
    quote: 'خانم دکتر زمانیان تنها یک پزشک متخصص نیستند؛ ایشان معجزه امید را به زندگی ما بعد از ۶ سال برگشتاندند.',
    storyText:
      'ما پس از چندین سال مراجعه به مراکز مختلف و تحمل استرس‌های فراوان، با معرفی یکی از همکاران به مطب خانم دکتر مرضیه زمانیان در بیمارستان امیر مازندرانی ساری مراجعه کردیم. برخورد آرامش‌بخش، معاینات دقیق سونوگرافی و بررسی دقیق علت‌های هورمونی از همان جلسه اول به ما قوت قلب داد. عمل تخمک‌کشی و سپس انتقال جنین در بخش کوثر بیمارستان امام خمینی ساری با نهایت دقت انجام شد و خدا را شکر در همان نوبت اول نتیجه تست بتا مثبت شد. امروز با لبخند رادین در آغوشمان، از صمیم قلب برای دست‌های شفابخش خانم دکتر دعا می‌کنیم.',
    writtenConsentObtained: true,
    consentArchiveCode: 'CS-MED-1403/118',
    doctorNote:
      'بیمار با تشخیص ناباروری ثانویه و فاکتور اندومتریوز تحت پروتکل لانگ با پایش دقیق دوز داروها قرار گرفت. ۴ جنین باکیفیت گرید A تشکیل شد و یک جنین بلاستوسیست ترانسفر گردید. بارداری تک‌قلو بدون عارضه سپری شد.',
    published: true,
    createdAt: '۱۴۰۳/۰۴/۱۵',
  },
  {
    id: 'story-2',
    patientInitials: 'خانم زهرا ن. و همسر',
    city: 'بابل',
    infertilityDuration: '۷ سال سابقه ناباروری با فاکتور توام',
    treatmentType: 'ICSI',
    treatmentTypeLabel: 'میکرواینجکشن (ICSI) و فریز جنین',
    treatmentLocation: 'مرکز ناباروری دولتی کوثر ساری و مطب تخصصی بلوار امیر مازندرانی',
    babyName: 'دوقلوهای نازنین: کیان و کارن',
    babyBirthDate: 'مهرماه ۱۴۰۳',
    babyAge: '۲ ماهه',
    photoUrl: '/assets/twins_success.jpg',
    satisfactionRating: 5,
    quote: 'وقتی خانم دکتر دستش رو روی شانه‌ام گذاشت و گفت ناامید نشو، حس کردم خدا صدای ما رو شنیده. حالا دوقلوهامون کنارمونن.',
    storyText:
      'به دلیل ترکیبی از فاکتور مردانه و ضعیف بودن ذخیره تخمدان، امیدی به بارداری طبیعی نداشتیم و قبلاً یک بار در تهران درمان ناموفق داشتیم. وقتی تحت نظر دکتر زمانیان شروع کردیم، ایشان با وسواس داروها را تنظیم کردند و عمل پانکچر در بیمارستان کوثر انجام شد. جنین‌ها فریز شدند تا بدن من کاملاً آماده انتقال بشود. انتقال دو جنین انجام شد و در سونوگرافی هفته هفتم متوجه شدیم دوقلو باردار هستم. زحمات خانم دکتر و پرسنل مهربانشان خانم اسدی و خانم جعفری فراموش‌نشدنی است.',
    writtenConsentObtained: true,
    consentArchiveCode: 'CS-MED-1403/245',
    doctorNote:
      'در این زوج با توجه به کیفیت اسپرم، تکنیک ICSI انجام شد. انتقال بعد از استراحت رحم (Freeze-all) و ضخامت اندومتر ۹ میلی‌متر صورت گرفت. دوقلویی دی‌کوریون با سلامت کامل در هفته ۳۷ متولد شدند.',
    published: true,
    createdAt: '۱۴۰۳/۰۷/۱۰',
  },
  {
    id: 'story-3',
    patientInitials: 'خانم سپیده ق.',
    city: 'قائم‌شهر',
    infertilityDuration: '۴ سال انتظار پس از سقط مکرر',
    treatmentType: 'FROZEN_EMBRYO',
    treatmentTypeLabel: 'انتقال جنین فریز شده و پایش ایمونولوژی',
    treatmentLocation: 'بخش ناباروری کوثر بیمارستان امام خمینی ساری',
    babyName: 'نفس کوچولو',
    babyBirthDate: 'بهمن ۱۴۰۲',
    babyAge: '۹ ماهه',
    photoUrl: '/assets/dr_zamanian_baby.jpg',
    satisfactionRating: 5,
    quote: 'دقت در مصرف داروها و پیگیری منظم تزریق‌های شبانه توسط خانم دکتر زمانیان رویای مادر شدن را برایم محقق کرد.',
    storyText:
      'تجربه دو بار سقط قبلی ضربه روحی سختی به من و همسرم زده بود. خانم دکتر زمانیان با بررسی‌های جامع ترومبوفیلی و ایمونولوژی، علت سقط‌ها را شناسایی کردند و با پروتکل درمانی دقیق، جنین فریز شده را انتقال دادند. در تمام طول ۹ ماه بارداری، هر تماس و سوالی داشتیم با صبر و حوصله پاسخ دادند. این عکس یادگاری با خانم دکتر در مطب ساری باارزش‌ترین عکس زندگی ماست.',
    writtenConsentObtained: true,
    consentArchiveCode: 'CS-MED-1402/897',
    doctorNote:
      'پایش دقیق انعقادی با انوکساپارین و آسپرین در کنار انتقال جنین فریز در سیکل طبیعی اصلاح‌شده. بارداری تحت مراقبت پرخطر تا پایان موفق پیش رفت.',
    published: true,
    createdAt: '۱۴۰۲/۱۱/۲۰',
  },
];

const LOCAL_STORAGE_KEY = 'drzamanian_pregnancy_success_stories_v3';

export function getStoredStories(): PregnancySuccessStory[] {
  if (typeof window === 'undefined') {
    return INITIAL_PREGNANCY_STORIES;
  }
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_PREGNANCY_STORIES));
      return INITIAL_PREGNANCY_STORIES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_PREGNANCY_STORIES;
  } catch (err) {
    console.error('Failed to read stories from localStorage', err);
    return INITIAL_PREGNANCY_STORIES;
  }
}

export function saveStoriesToStorage(stories: PregnancySuccessStory[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stories));
  } catch (err) {
    console.error('Failed to persist stories to localStorage', err);
  }
}
