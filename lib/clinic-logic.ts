import { Doctor } from './clinic-data';

export interface DoctorFilterOptions {
  day?: string;
  departmentId?: string;
  searchQuery?: string;
}

/**
 * Filter doctors by selected day of week, department, or free-text search.
 */
export function filterDoctors(doctors: Doctor[], options: DoctorFilterOptions = {}): Doctor[] {
  const { day = 'all', departmentId = 'all', searchQuery = '' } = options;
  const normalizedQuery = searchQuery.trim().toLowerCase();

  return doctors.filter((doctor) => {
    // 1. Department filter
    if (departmentId !== 'all' && doctor.departmentId !== departmentId) {
      return false;
    }

    // 2. Day filter
    if (day !== 'all') {
      const worksOnDay = doctor.schedule.some((shift) =>
        shift.dayKeys.some((k) => k.includes(day) || day.includes(k))
      );
      if (!worksOnDay) {
        return false;
      }
    }

    // 3. Search query filter
    if (normalizedQuery) {
      const matchName = doctor.name.toLowerCase().includes(normalizedQuery);
      const matchSpec = doctor.specialty.toLowerCase().includes(normalizedQuery);
      const matchBio = doctor.bio ? doctor.bio.toLowerCase().includes(normalizedQuery) : false;
      const matchCouncil = doctor.councilId.includes(normalizedQuery);
      if (!matchName && !matchSpec && !matchBio && !matchCouncil) {
        return false;
      }
    }

    return true;
  });
}

export interface ClinicStatus {
  isOpen: boolean;
  statusText: string;
  nextShiftInfo: string;
}

/**
 * Checks whether the clinic is currently open according to Iranian business hours:
 * Saturday (6 in JS or customized) to Wednesday (3 in JS): 8:00 - 21:30
 * Thursday (4 in JS): 8:00 - 16:00
 * Friday (5 in JS): Closed
 */
export function getClinicOpenStatus(date: Date = new Date()): ClinicStatus {
  const day = date.getDay(); // 0: Sun, 1: Mon, 2: Tue, 3: Wed, 4: Thu, 5: Fri, 6: Sat
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const currentDecHour = hours + minutes / 60;

  // Friday is closed
  if (day === 5) {
    return {
      isOpen: false,
      statusText: 'هم‌اکنون کلینیک تعطیل است (جمعه)',
      nextShiftInfo: 'شروع فعالیت: فردا (شنبه) از ساعت ۸:۰۰ صبح',
    };
  }

  // Thursday: 8:00 to 16:00
  if (day === 4) {
    if (currentDecHour >= 8 && currentDecHour < 16) {
      return {
        isOpen: true,
        statusText: 'هم‌اکنون کلینیک باز است',
        nextShiftInfo: 'پایان پذیرش امروز: ۱۶:۰۰ عصر',
      };
    } else {
      return {
        isOpen: false,
        statusText: 'خارج از ساعات کاری پنج‌شنبه',
        nextShiftInfo: 'شروع مجدد: شنبه ساعت ۸:۰۰ صبح',
      };
    }
  }

  // Saturday (6), Sunday (0), Monday (1), Tuesday (2), Wednesday (3): 8:00 to 21:30
  if (currentDecHour >= 8 && currentDecHour < 21.5) {
    return {
      isOpen: true,
      statusText: 'هم‌اکنون کلینیک باز است',
      nextShiftInfo: 'پایان فعالیت امروز: ۲۱:۳۰ شب',
    };
  } else {
    return {
      isOpen: false,
      statusText: 'هم‌اکنون کلینیک خارج از ساعات کاری است',
      nextShiftInfo: 'شروع پذیرش: ساعت ۸:۰۰ صبح روز کاری بعدی',
    };
  }
}

/**
 * Generates an administrative reference tracking code for feedback submission
 */
export function generateTrackingCode(): string {
  const prefix = 'MHG';
  const timestamp = Date.now().toString().slice(-5);
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${timestamp}-${random}`;
}

/**
 * Formats a Persian phone number for display
 */
export function formatPersianPhone(phone: string): string {
  if (!phone) return '';
  const cleaned = phone.replace(/[^\d+]/g, '');
  return cleaned;
}
