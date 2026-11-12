'use client';

import React, { useState } from 'react';
import {
  Search,
  Shield,
  Eye,
  EyeOff,
  Bell,
  User,
  LogOut,
  Calendar,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Stethoscope,
} from 'lucide-react';
import { CLINIC_HEADER_INFO, Patient } from '@/lib/dr-zamanian-data';
import { searchPatients, UserRole, ROLE_DEFINITIONS } from '@/lib/clinic-mgmt-logic';

interface ClinicalHeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  privacyMode: boolean;
  onTogglePrivacy: () => void;
  patients: Patient[];
  onSelectPatient: (patient: Patient) => void;
  pendingAlertsCount: number;
  onOpenAlerts: () => void;
  onToggleMode?: () => void;
  isPublicSiteVisible?: boolean;
  onLogout?: () => void;
}

export default function ClinicalHeader({
  currentRole,
  onRoleChange,
  privacyMode,
  onTogglePrivacy,
  patients,
  onSelectPatient,
  pendingAlertsCount,
  onOpenAlerts,
  onToggleMode,
  isPublicSiteVisible,
  onLogout,
}: ClinicalHeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const searchResults = searchQuery.trim() ? searchPatients(patients, searchQuery).slice(0, 5) : [];

  const rolesList: { key: UserRole; label: string; desc: string }[] = [
    {
      key: 'SUPER_ADMIN',
      label: 'مدیر کل (Super Admin)',
      desc: 'دسترسی نامحدود به پرونده‌های بیماران، لاگ‌های امنیتی و امور مالی',
    },
    {
      key: 'RECEPTIONIST',
      label: 'مدیر پذیرش (Receptionist)',
      desc: 'دسترسی به داشبورد، نوبت‌دهی و پیام‌های تماس',
    },
    {
      key: 'CONTENT_EDITOR',
      label: 'ویرایشگر محتوا (Content Editor)',
      desc: 'دسترسی به داشبورد و مدیریت محتوا و اطلاعیه‌ها',
    },
  ];

  return (
    <header className="bg-[#1E293B] text-white border-b border-slate-700/80 sticky top-0 z-40 shadow-md">
      {/* Top Banner Row */}
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
        {/* Brand Logo & Clinic Title */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#2C5E8A] to-[#8FA382] flex items-center justify-center text-white shadow-md shadow-[#2C5E8A]/30 border border-white/20">
            <Stethoscope className="w-6 h-6 text-[#F6F2EB]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-black tracking-tight text-white block">
                {CLINIC_HEADER_INFO.clinicName}
              </span>
              <span className="bg-[#8FA382]/20 border border-[#8FA382]/40 text-[#8FA382] text-[10px] font-bold px-2 py-0.5 rounded-full hidden md:inline">
                سامانه جامع بالینی و پرونده الکترونیک (EHR)
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium block">
              {CLINIC_HEADER_INFO.subTitle}
            </span>
          </div>
        </div>

        {/* Global Patient Search (کد ملی / نام / شماره پرونده) */}
        <div className="flex-1 max-w-xl relative hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(true);
              }}
              onFocus={() => setShowSearchResults(true)}
              placeholder="جستجوی سراسری بیمار (کد ملی / نام / شماره پرونده #1042)..."
              className="w-full pr-10 pl-4 py-2 text-xs rounded-xl bg-slate-800/90 border border-slate-700 focus:border-[#8FA382] focus:ring-2 focus:ring-[#8FA382]/20 text-white placeholder-slate-400 outline-none transition"
            />
          </div>

          {/* Quick Search Preview Dropdown */}
          {showSearchResults && searchQuery.trim() && (
            <div className="absolute top-full right-0 left-0 mt-2 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in-50 duration-150">
              <div className="text-[10px] text-slate-400 px-3 py-1 font-bold">
                نتایج جستجو در پرونده‌های بالینی:
              </div>
              {searchResults.length > 0 ? (
                searchResults.map((pat) => (
                  <button
                    key={pat.id}
                    type="button"
                    onClick={() => {
                      onSelectPatient(pat);
                      setShowSearchResults(false);
                      setSearchQuery('');
                    }}
                    className="w-full text-right p-2.5 rounded-xl hover:bg-slate-800 flex items-center justify-between transition cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{pat.fullName}</span>
                        <span className="text-[10px] font-mono bg-[#2C5E8A]/50 text-blue-200 px-1.5 py-0.5 rounded">
                          #{pat.fileNumber}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        کد ملی: {pat.nationalId} | همسر: {pat.partnerName}
                      </div>
                    </div>
                    <span className="text-[10px] text-[#8FA382] font-semibold bg-[#8FA382]/10 px-2 py-0.5 rounded-md">
                      {pat.cyclePhase}
                    </span>
                  </button>
                ))
              ) : (
                <div className="p-3 text-center text-xs text-slate-400">
                  بیماری با این مشخصات یافت نشد
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Action Icons & User Meta */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Privacy Anonymization Toggle */}
          <button
            type="button"
            onClick={onTogglePrivacy}
            title={privacyMode ? 'حالت محرمانگی فعال است (نمایش مخفف نام مراجعین)' : 'نمایش نام کامل بیماران'}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition border cursor-pointer ${
              privacyMode
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            {privacyMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">
              {privacyMode ? 'حریم خصوصی: م. ر.' : 'حریم خصوصی: خاموش'}
            </span>
          </button>

          {/* Pending Alerts Bell */}
          <button
            type="button"
            onClick={onOpenAlerts}
            className="relative p-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 transition border border-slate-700 cursor-pointer"
            title="هشدارهای حساس دارویی"
            aria-label="هشدارهای دارویی"
          >
            <Bell className="w-4 h-4" />
            {pendingAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center animate-pulse">
                {pendingAlertsCount}
              </span>
            )}
          </button>

          {/* User Role Badge Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-white px-3 py-1.5 rounded-xl text-xs flex items-center gap-2 cursor-pointer transition"
            >
              <div className="w-6 h-6 rounded-lg bg-[#2C5E8A] text-[#C5A880] flex items-center justify-center text-xs font-bold">
                <User className="w-3.5 h-3.5" />
              </div>
              <div className="text-right hidden sm:block">
                <span className="text-[10px] text-slate-400 block">نقش جاری سیستم:</span>
                <span className="text-xs font-bold text-amber-300">
                  {ROLE_DEFINITIONS[currentRole].badgeLabel}
                </span>
              </div>
            </button>

            {showRoleMenu && (
              <div className="absolute left-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-2xl p-2 shadow-2xl z-50">
                <div className="text-[10px] text-slate-400 px-3 py-1 font-bold border-b border-slate-800 mb-1">
                  تغییر سطح دسترسی کاربری (RBAC):
                </div>
                {rolesList.map((r) => (
                  <button
                    key={r.key}
                    type="button"
                    onClick={() => {
                      onRoleChange(r.key);
                      setShowRoleMenu(false);
                    }}
                    className={`w-full text-right px-3 py-2.5 text-xs rounded-xl transition flex flex-col gap-0.5 cursor-pointer ${
                      currentRole === r.key
                        ? 'bg-[#2C5E8A] text-white font-bold'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>{r.label}</span>
                      {currentRole === r.key && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 font-normal">{r.desc}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* View Website / Logout */}
          {onToggleMode && (
            <button
              type="button"
              onClick={onToggleMode}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition border border-slate-700 cursor-pointer flex items-center gap-1.5"
              title="مشاهده نمای عمومی وب‌سایت کلینیک"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
              <span className="hidden sm:inline">مشاهده وب‌سایت</span>
            </button>
          )}

          {/* Logout Button */}
          <button
            type="button"
            onClick={onLogout || onToggleMode}
            className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5"
            title="خروج از پنل مدیریت و پایان نشست امنیتی"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">خروج از پنل</span>
          </button>
        </div>
      </div>
    </header>
  );
}
