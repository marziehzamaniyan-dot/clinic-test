'use client';

import React from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  FolderHeart,
  Dna,
  Mail,
  FileText,
  CircleDollarSign,
  ShieldCheck,
  Settings,
  Shield,
  CheckCircle2,
  Lock,
  ChevronDown,
  HeartHandshake,
  Cloud,
  Send,
} from 'lucide-react';
import {
  UserRole,
  ADMIN_MODULES,
  getVisibleSidebarModules,
  ROLE_DEFINITIONS,
} from '@/lib/clinic-mgmt-logic';

export type ClinicalTab =
  | 'dashboard'
  | 'calendar'
  | 'patients'
  | 'embryology'
  | 'messages'
  | 'telegram'
  | 'cms'
  | 'success-stories'
  | 'workspace'
  | 'financial'
  | 'security'
  | 'settings';

interface ClinicalSidebarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeTab: ClinicalTab;
  onTabChange: (tab: ClinicalTab) => void;
  waitingPatientsCount: number;
  embryoLabCount: number;
  criticalAlertsCount: number;
  unreadMessagesCount?: number;
}

export default function ClinicalSidebar({
  currentRole,
  onRoleChange,
  activeTab,
  onTabChange,
  waitingPatientsCount,
  embryoLabCount,
  criticalAlertsCount,
  unreadMessagesCount = 2,
}: ClinicalSidebarProps) {
  const visibleModules = getVisibleSidebarModules(currentRole);
  const currentRoleInfo = ROLE_DEFINITIONS[currentRole];

  // Map each module to its icon and badge dynamic logic
  const getModuleMeta = (id: string) => {
    switch (id) {
      case 'dashboard':
        return {
          icon: <LayoutDashboard className="w-4 h-4" />,
          badge: null,
          badgeColor: '',
        };
      case 'calendar':
        return {
          icon: <CalendarDays className="w-4 h-4" />,
          badge: `${waitingPatientsCount} در انتظار`,
          badgeColor: 'bg-amber-500/20 text-amber-300',
        };
      case 'patients':
        return {
          icon: <FolderHeart className="w-4 h-4" />,
          badge: '۵ فعال',
          badgeColor: 'bg-[#8FA382]/20 text-[#8FA382]',
        };
      case 'embryology':
        return {
          icon: <Dna className="w-4 h-4" />,
          badge: `${embryoLabCount} نمونه`,
          badgeColor: 'bg-cyan-500/20 text-cyan-300',
        };
      case 'messages':
        return {
          icon: <Mail className="w-4 h-4" />,
          badge: `${unreadMessagesCount} جدید`,
          badgeColor: 'bg-rose-500/20 text-rose-300',
        };
      case 'telegram':
        return {
          icon: <Send className="w-4 h-4 text-sky-400" />,
          badge: 'بات متصل',
          badgeColor: 'bg-sky-500/20 text-sky-300 font-sans',
        };
      case 'cms':
        return {
          icon: <FileText className="w-4 h-4" />,
          badge: '۳ مطلب',
          badgeColor: 'bg-purple-500/20 text-purple-300',
        };
      case 'success-stories':
        return {
          icon: <HeartHandshake className="w-4 h-4" />,
          badge: 'گالری نوزادان',
          badgeColor: 'bg-rose-500/20 text-rose-300',
        };
      case 'financial':
        return {
          icon: <CircleDollarSign className="w-4 h-4" />,
          badge: null,
          badgeColor: '',
        };
      case 'workspace':
        return {
          icon: <Cloud className="w-4 h-4" />,
          badge: 'Google • Cloud',
          badgeColor: 'bg-sky-500/20 text-sky-300',
        };
      case 'security':
        return {
          icon: <ShieldCheck className="w-4 h-4" />,
          badge: 'محرمانه',
          badgeColor: 'bg-slate-700 text-slate-300',
        };
      case 'settings':
        return {
          icon: <Settings className="w-4 h-4" />,
          badge: null,
          badgeColor: '',
        };
      default:
        return {
          icon: <LayoutDashboard className="w-4 h-4" />,
          badge: null,
          badgeColor: '',
        };
    }
  };

  const hiddenModulesCount = ADMIN_MODULES.length - visibleModules.length;

  return (
    <aside className="w-full lg:w-68 bg-slate-900 border-l border-slate-800 text-slate-300 flex flex-col shrink-0">
      {/* Role Indicator & RBAC Switcher Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/80">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-[#C5A880]" />
            کنترل سطح دسترسی (RBAC)
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-bold">
            {visibleModules.length} از {ADMIN_MODULES.length} ماژول
          </span>
        </div>

        {/* Quick Role Switch Buttons */}
        <div className="grid grid-cols-3 gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-[10px] font-bold">
          <button
            type="button"
            onClick={() => onRoleChange('SUPER_ADMIN')}
            title="مدیر کل: دسترسی کامل به کلیه ماژول‌ها و داده‌های محرمانه"
            className={`py-1.5 px-1 rounded-lg transition cursor-pointer text-center truncate ${
              currentRole === 'SUPER_ADMIN'
                ? 'bg-[#2C5E8A] text-white shadow-xs font-black'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            مدیر کل
          </button>
          <button
            type="button"
            onClick={() => onRoleChange('RECEPTIONIST')}
            title="پذیرش: دسترسی فقط به داشبورد، شیفت‌ها و پیام‌های مراجعین"
            className={`py-1.5 px-1 rounded-lg transition cursor-pointer text-center truncate ${
              currentRole === 'RECEPTIONIST'
                ? 'bg-blue-600 text-white shadow-xs font-black'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            پذیرش
          </button>
          <button
            type="button"
            onClick={() => onRoleChange('CONTENT_EDITOR')}
            title="ویرایشگر: دسترسی فقط به داشبورد و مدیریت محتوا"
            className={`py-1.5 px-1 rounded-lg transition cursor-pointer text-center truncate ${
              currentRole === 'CONTENT_EDITOR'
                ? 'bg-purple-600 text-white shadow-xs font-black'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            محتوا
          </button>
        </div>

        <div className="mt-2.5 px-2.5 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-[10px] flex items-center justify-between">
          <span className="text-slate-300 font-medium">پروفایل: {currentRoleInfo.badgeLabel}</span>
          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${currentRoleInfo.colorClass}`}>
            فعال
          </span>
        </div>
      </div>

      {/* Dynamic Nav List rendered based on allowed roles */}
      <nav className="p-3 space-y-1.5 flex-1 overflow-y-auto">
        <div className="text-[10px] text-slate-500 font-bold px-3 py-1 uppercase tracking-wider">
          ماژول‌های مجاز شما ({visibleModules.length}):
        </div>

        {visibleModules.map((module) => {
          const meta = getModuleMeta(module.id);
          const isActive = activeTab === module.id;

          return (
            <button
              key={module.id}
              type="button"
              onClick={() => onTabChange(module.id as ClinicalTab)}
              className={`w-full text-right p-3 rounded-2xl flex items-center justify-between transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-[#2C5E8A] to-[#234b6e] text-white shadow-md font-bold'
                  : 'hover:bg-slate-800/80 text-slate-300 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-1.5 rounded-xl ${
                    isActive ? 'bg-white/20 text-[#C5A880]' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {meta.icon}
                </div>
                <span className="text-xs sm:text-sm">{module.label}</span>
              </div>

              {meta.badge && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    meta.badgeColor || 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {meta.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Hidden Modules Indicator for Transparency */}
        {hiddenModulesCount > 0 && (
          <div className="pt-3 mt-3 border-t border-slate-800/80 px-2">
            <div className="text-[10px] text-slate-500 font-bold flex items-center gap-1.5 mb-2">
              <Lock className="w-3 h-3 text-slate-500" />
              <span>ماژول‌های قفل‌شده بر اساس نقش ({hiddenModulesCount}):</span>
            </div>
            <div className="space-y-1 opacity-40 select-none">
              {ADMIN_MODULES.filter((m) => !m.allowedRoles.includes(currentRole)).map((m) => (
                <div
                  key={m.id}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-950/40 border border-slate-800/40 text-[11px] text-slate-500 flex items-center justify-between"
                >
                  <span>{m.label}</span>
                  <span className="text-[9px] font-mono">غیرمجاز</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Footer Doctor Profile Card */}
      <div className="p-3.5 border-t border-slate-800 bg-slate-950/70 space-y-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#2C5E8A] to-[#8FA382] text-white flex items-center justify-center font-bold text-xs shadow-md shrink-0">
            د.ز
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-white truncate">دکتر مرضیه زمانیان</h4>
            <span className="text-[10px] text-amber-300 block truncate">فلوشیپ ناباروری و IVF</span>
            <span className="text-[9px] text-slate-400 block font-bold">نظام پزشکی: ۸۹۷۰۲</span>
          </div>
        </div>

        <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-[9px] text-slate-400 space-y-0.5">
          <div className="text-slate-300 font-medium truncate">
            مطب: بیمارستان امیر مازندرانی ساری (ط ۳)
          </div>
          <div className="text-amber-400 font-medium truncate">
            اتاق عمل IVF: مرکز کوثر بیمارستان امام خمینی
          </div>
        </div>
      </div>
    </aside>
  );
}
