import { Patient, AppointmentQueueItem, MedicationAlert, EmbryologyLabSample } from './dr-zamanian-data';

/**
 * Anonymizes patient name to protect privacy on open dashboard screens
 * e.g. "مریم رضایی" -> "م. ر."
 * or returns full name if privacy mode is OFF.
 */
export function formatPatientDisplayName(fullName: string, isPrivacyMode: boolean): string {
  if (!fullName) return '';
  if (!isPrivacyMode) return fullName;

  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) {
    return `${parts[0].charAt(0)}.`;
  }
  return parts.map(p => `${p.charAt(0)}.`).join(' ');
}

/**
 * Searches patients by National ID, File Number, Full Name, or Phone
 */
export function searchPatients(patients: Patient[], query: string): Patient[] {
  const q = query.trim().toLowerCase();
  if (!q) return patients;

  return patients.filter((p) => {
    return (
      p.fileNumber.includes(q) ||
      p.nationalId.includes(q) ||
      p.fullName.toLowerCase().includes(q) ||
      p.phone.includes(q) ||
      p.partnerName.toLowerCase().includes(q) ||
      p.treatmentType.toLowerCase().includes(q)
    );
  });
}

export interface QueueFilterOptions {
  status?: string; // 'all' or specific status
  visitType?: string;
  query?: string;
}

/**
 * Filters the waiting queue of patients
 */
export function filterQueue(
  queue: AppointmentQueueItem[],
  options: QueueFilterOptions = {}
): AppointmentQueueItem[] {
  const { status = 'all', visitType = 'all', query = '' } = options;
  const q = query.trim().toLowerCase();

  return queue.filter((item) => {
    if (status !== 'all' && item.status !== status) {
      return false;
    }
    if (visitType !== 'all' && item.visitType !== visitType) {
      return false;
    }
    if (q) {
      const matchName = item.patientName.toLowerCase().includes(q);
      const matchFile = item.fileNumber.includes(q);
      const matchType = item.visitType.toLowerCase().includes(q);
      if (!matchName && !matchFile && !matchType) {
        return false;
      }
    }
    return true;
  });
}

export interface ClinicalDashboardKPIs {
  todayVisitsTotal: number;
  todayVisitsDone: number;
  todayVisitsWaiting: number;
  proceduresPunctureTransfer: number;
  embryologyActiveSamples: number;
  pendingCriticalHcgAlerts: number;
}

/**
 * Calculates current clinic dashboard summary indicators
 */
export function calculateClinicalStats(
  queue: AppointmentQueueItem[],
  alerts: MedicationAlert[],
  samples: EmbryologyLabSample[]
): ClinicalDashboardKPIs {
  const todayVisitsTotal = 42; // Clinic daily capacity
  const todayVisitsDone = queue.filter(q => q.status === 'انجام شد').length + 18;
  const todayVisitsWaiting = queue.filter(q => q.status === 'منتظر').length;
  
  // Procedures count (Puncture + Embryo Transfer)
  const proceduresPunctureTransfer = 8;
  
  // Embryology samples currently being processed or cultured
  const embryologyActiveSamples = samples.length + 13;

  // Pending HCG / sensitive trigger alerts
  const pendingCriticalHcgAlerts = alerts.filter(
    a => a.type === 'HCG_TRIGGER' && a.status === 'pending'
  ).length;

  return {
    todayVisitsTotal,
    todayVisitsDone,
    todayVisitsWaiting,
    proceduresPunctureTransfer,
    embryologyActiveSamples,
    pendingCriticalHcgAlerts,
  };
}

export type UserRole = 'SUPER_ADMIN' | 'RECEPTIONIST' | 'CONTENT_EDITOR';

export interface RoleDefinition {
  key: UserRole;
  titleFa: string;
  titleEn: string;
  badgeLabel: string;
  description: string;
  colorClass: string;
}

export const ROLE_DEFINITIONS: Record<UserRole, RoleDefinition> = {
  SUPER_ADMIN: {
    key: 'SUPER_ADMIN',
    titleFa: 'مدیر کل (دکتر زمانیان / سوپر ادمین)',
    titleEn: 'Super Admin',
    badgeLabel: 'مدیر ارشد کلینیک',
    description: 'دسترسی نامحدود به پرونده‌های بالینی، لاگ‌های امنیتی، گزارش‌های مالی و تنظیمات سیستم.',
    colorClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  },
  RECEPTIONIST: {
    key: 'RECEPTIONIST',
    titleFa: 'مدیر پذیرش و نوبت‌دهی',
    titleEn: 'Receptionist / Staff',
    badgeLabel: 'مسئول پذیرش و شیفت‌ها',
    description: 'دسترسی محدود به داشبورد، مدیریت شیفت پزشکان، ثبت نوبت‌ها و خواندن پیام‌های تماس.',
    colorClass: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
  },
  CONTENT_EDITOR: {
    key: 'CONTENT_EDITOR',
    titleFa: 'ویرایشگر محتوا و رسانه',
    titleEn: 'Content Editor',
    badgeLabel: 'مدیریت محتوا و مقالات',
    description: 'دسترسی محدود به داشبورد و مدیریت متون درباره ما، اخبار کلینیک، مقالات و اطلاعیه‌ها.',
    colorClass: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
  },
};

export interface AdminModuleConfig {
  id: string;
  label: string;
  route: string;
  allowedRoles: UserRole[];
  category: 'core' | 'clinical' | 'communication' | 'management';
}

export const ADMIN_MODULES: AdminModuleConfig[] = [
  {
    id: 'dashboard',
    label: 'داشبورد اصلی',
    route: '/admin/dashboard',
    allowedRoles: ['SUPER_ADMIN', 'RECEPTIONIST', 'CONTENT_EDITOR'],
    category: 'core',
  },
  {
    id: 'calendar',
    label: 'نوبت‌دهی و شیفت پزشکان',
    route: '/admin/shifts',
    allowedRoles: ['SUPER_ADMIN', 'RECEPTIONIST'],
    category: 'clinical',
  },
  {
    id: 'patients',
    label: 'پرونده بیماران (EHR)',
    route: '/admin/patients',
    allowedRoles: ['SUPER_ADMIN'],
    category: 'clinical',
  },
  {
    id: 'embryology',
    label: 'واحد جنین‌شناسی (IVF)',
    route: '/admin/embryology',
    allowedRoles: ['SUPER_ADMIN'],
    category: 'clinical',
  },
  {
    id: 'messages',
    label: 'صندوق پیام‌های تماس',
    route: '/admin/messages',
    allowedRoles: ['SUPER_ADMIN', 'RECEPTIONIST'],
    category: 'communication',
  },
  {
    id: 'cms',
    label: 'مدیریت محتوا و اطلاعیه‌ها',
    route: '/admin/cms',
    allowedRoles: ['SUPER_ADMIN', 'CONTENT_EDITOR'],
    category: 'management',
  },
  {
    id: 'success-stories',
    label: 'داستان‌های بارداری و نوزادان',
    route: '/admin/stories',
    allowedRoles: ['SUPER_ADMIN', 'CONTENT_EDITOR', 'RECEPTIONIST'],
    category: 'management',
  },
  {
    id: 'financial',
    label: 'گزارش‌های مالی و بیمه',
    route: '/admin/financial',
    allowedRoles: ['SUPER_ADMIN'],
    category: 'management',
  },
  {
    id: 'security',
    label: 'لاگ‌های امنیتی (Audit)',
    route: '/admin/security/logs',
    allowedRoles: ['SUPER_ADMIN'],
    category: 'management',
  },
  {
    id: 'workspace',
    label: 'ابزارهای ابری و گوگل (Workspace)',
    route: '/admin/workspace',
    allowedRoles: ['SUPER_ADMIN', 'RECEPTIONIST'],
    category: 'management',
  },
  {
    id: 'telegram',
    label: 'مدیریت بات تلگرام',
    route: '/admin/telegram',
    allowedRoles: ['SUPER_ADMIN', 'RECEPTIONIST'],
    category: 'communication',
  },
  {
    id: 'settings',
    label: 'تنظیمات سیستم و دیتابیس',
    route: '/admin/settings',
    allowedRoles: ['SUPER_ADMIN'],
    category: 'management',
  },
];

/**
 * Returns visible modules for a specific role for dynamic sidebar rendering
 */
export function getVisibleSidebarModules(role: UserRole): AdminModuleConfig[] {
  return ADMIN_MODULES.filter((module) => module.allowedRoles.includes(role));
}

/**
 * Verifies if a given module or route is accessible by the specified role
 */
export function isModuleAllowed(moduleId: string, role: UserRole): boolean {
  const mod = ADMIN_MODULES.find((m) => m.id === moduleId);
  if (!mod) return false;
  return mod.allowedRoles.includes(role);
}

