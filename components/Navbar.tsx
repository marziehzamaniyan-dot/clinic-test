'use client';

import React, { useState, useEffect } from 'react';
import {
  PhoneCall,
  Clock,
  MapPin,
  Menu,
  X,
  Sparkles,
  User,
  LogOut,
  ExternalLink,
  Shield,
  CalendarCheck,
} from 'lucide-react';
import { CLINIC_INFO } from '@/lib/clinic-data';
import { getClinicOpenStatus, ClinicStatus } from '@/lib/clinic-logic';
import { AuthUser } from '@/components/AuthModal';

interface NavbarProps {
  onOpenAuth: () => void;
  currentUser: AuthUser | null;
  onLogout: () => void;
  onOpenAppointment: (doctor?: any) => void;
}

export default function Navbar({
  onOpenAuth,
  currentUser,
  onLogout,
  onOpenAppointment,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [clinicStatus, setClinicStatus] = useState<ClinicStatus | null>(null);

  useEffect(() => {
    // Set status inside timer callback to avoid cascading sync render
    const update = () => setClinicStatus(getClinicOpenStatus());
    const timer = setTimeout(update, 0);
    const interval = setInterval(update, 60000);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  const navLinks = [
    { href: '#hero', label: 'صفحه اصلی' },
    { href: '#services', label: 'خدمات ۳ گانه' },
    { href: '#doctors', label: 'تقویم و شیفت‌های کاری' },
    { href: '#why-us', label: 'چرا کلینیک ما؟' },
    { href: '#success-stories', label: 'داستان‌های بارداری و نوزادان' },
    { href: '#about', label: 'درباره کلینیک' },
    { href: '#faq', label: 'سوالات متداول' },
    { href: '#contact', label: 'اطلاعات تماس' },
  ];

  return (
    <>
      {/* Topbar */}
      <div className="bg-[#2C5E8A] text-white text-xs py-2 px-4 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="flex items-center flex-wrap gap-3 sm:gap-5 text-[11px] sm:text-xs">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
              <span>شنبه تا چهارشنبه ۸:۰۰ الی ۲۰:۳۰ | پنج‌شنبه‌ها تا ۱۳:۳۰</span>
            </span>
            <span className="hidden lg:flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
              <span>ساری، بیمارستان امیر مازندرانی، ط ۳ | کدپستی: {CLINIC_INFO.postalCode}</span>
            </span>
            {clinicStatus && (
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                  clinicStatus.isOpen
                    ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/30'
                    : 'bg-amber-500/20 text-amber-200 border border-amber-400/30'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    clinicStatus.isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                  }`}
                ></span>
                {clinicStatus.statusText}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
            {/* DrDr.ir Quick Link */}
            <a
              href={CLINIC_INFO.drdrUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 bg-[#C5A880] hover:bg-[#b59870] text-slate-900 font-bold px-2.5 py-0.5 rounded-md text-[11px] transition shadow-xs"
              title="نوبت‌دهی اینترنتی دکتر مرضیه زمانیان در سایت دکتردکتر"
            >
              <CalendarCheck className="w-3 h-3 text-slate-900" />
              <span>نوبت‌دهی دکتردکتر</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-70" />
            </a>

            <span className="text-white/40 hidden sm:inline">|</span>

            {/* IVR Call Center */}
            <a
              href={`tel:${CLINIC_INFO.callCenterRaw}`}
              className="font-bold text-[#C5A880] hover:text-white transition flex items-center gap-1 dir-ltr bg-white/10 px-2 py-0.5 rounded-md text-[11px]"
              title="تلفن گویا: ۱ ویزیت با خانم اسدی / ۲ مشاوره با خانم جعفری"
            >
              <PhoneCall className="w-3 h-3 text-[#C5A880]" />
              <span className="font-mono">{CLINIC_INFO.callCenter}</span>
            </a>

            <span className="text-white/40 hidden sm:inline">|</span>

            {/* Direct Line */}
            <a
              href={`tel:${CLINIC_INFO.phone1Raw}`}
              className="font-bold text-white/90 hover:text-white transition flex items-center gap-1 dir-ltr text-[11px] font-mono hidden sm:inline-flex"
              title="تلفن مستقیم مطب"
            >
              <span>{CLINIC_INFO.phone1}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <a href="#hero" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-[#2C5E8A] flex items-center justify-center text-white shadow-md shadow-[#2C5E8A]/20 transition-transform group-hover:scale-105">
              <div className="relative">
                <Sparkles className="w-6 h-6 text-[#C5A880]" />
              </div>
            </div>
            <div>
              <span className="text-lg sm:text-xl font-black tracking-tight text-[#2C5E8A] block leading-tight">
                {CLINIC_INFO.name}
              </span>
              <span className="text-[10px] tracking-wide text-[#8FA382] font-semibold block">
                فلوشیپ فوق‌تخصصی زنان و درمان ناباروری | نظام پزشکی: ۸۹۷۰۲
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#64748B]">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="hover:text-[#2C5E8A] transition-colors py-1 relative hover:font-semibold"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Action Button: Replaced with Login & Register Form + DrDr Booking */}
          <div className="flex items-center gap-2.5">
            {/* DrDr Online Booking Button */}
            <a
              href={CLINIC_INFO.drdrUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 transition shadow-xs cursor-pointer"
            >
              <CalendarCheck className="w-4 h-4 text-slate-950" />
              <span>نوبت‌دهی دکتردکتر</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>

            {/* Replaced Header Button: Login / Register Form */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <div className="px-3 py-1.5 rounded-xl bg-[#2C5E8A]/10 border border-[#2C5E8A]/20 text-xs">
                  <span className="text-slate-500 text-[10px] block">کاربر وارد شده:</span>
                  <span className="font-bold text-[#2C5E8A] truncate max-w-[130px] block">
                    {currentUser.displayName}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onLogout}
                  className="p-2.5 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 transition cursor-pointer"
                  title="خروج از حساب"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenAuth}
                className="inline-flex items-center gap-2 bg-[#2C5E8A] hover:bg-[#234b6e] text-white px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm active:scale-95 transition shadow-sm shadow-[#2C5E8A]/30 cursor-pointer"
              >
                <User className="w-4 h-4 text-[#C5A880]" />
                <span>ورود / ثبت‌نام</span>
              </button>
            )}

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 transition focus:outline-none"
              aria-label="منوی موبایل"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-6 py-5 shadow-xl animate-in slide-in-from-top-4 duration-200">
            <nav className="flex flex-col gap-3 pb-4 border-b border-slate-100">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 px-3 rounded-lg text-slate-700 hover:bg-[#F0F4EF] hover:text-[#2C5E8A] font-medium text-sm transition"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="pt-4 flex flex-col gap-2.5">
              {/* Login / Register Button in Mobile Drawer */}
              {currentUser ? (
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div>
                    <span className="text-[10px] text-slate-400 block">کاربر فعال:</span>
                    <span className="text-xs font-bold text-slate-800">{currentUser.displayName}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="px-3 py-1 bg-rose-50 text-rose-600 rounded-lg text-xs font-bold"
                  >
                    خروج
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth();
                  }}
                  className="w-full py-3 bg-[#2C5E8A] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm"
                >
                  <User className="w-4 h-4 text-[#C5A880]" />
                  <span>ورود / ثبت‌نام در سامانه</span>
                </button>
              )}

              {/* DrDr Online Booking Mobile Button */}
              <a
                href={CLINIC_INFO.drdrUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 bg-amber-500 text-slate-950 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs"
              >
                <CalendarCheck className="w-4 h-4" />
                <span>نوبت‌دهی آنلاین در سایت دکتردکتر</span>
                <ExternalLink className="w-3 h-3 opacity-70" />
              </a>

              {/* Quick Dial IVR Box */}
              <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 text-xs space-y-1.5 text-right">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-900">تلفن گویا و کال سنتر:</span>
                  <a
                    href={`tel:${CLINIC_INFO.callCenterRaw}`}
                    className="font-mono font-bold text-[#2C5E8A] text-sm dir-ltr hover:underline"
                  >
                    {CLINIC_INFO.callCenter}
                  </a>
                </div>
                <div className="text-[10px] text-amber-800 space-y-0.5">
                  <div>• کلید ۱ (ویزیت): منشی خانم اسدی</div>
                  <div>• کلید ۲ (مشاوره): خانم جعفری</div>
                </div>
              </div>

              <div className="text-center text-[11px] text-slate-500 pt-1 flex justify-center items-center gap-2">
                <span>خطوط مستقیم مطب:</span>
                <a
                  href={`tel:${CLINIC_INFO.phone1Raw}`}
                  className="text-[#2C5E8A] font-bold font-mono dir-ltr"
                >
                  {CLINIC_INFO.phone1}
                </a>
                <span>-</span>
                <a
                  href={`tel:${CLINIC_INFO.phone2Raw}`}
                  className="text-[#2C5E8A] font-bold font-mono dir-ltr"
                >
                  {CLINIC_INFO.phone2}
                </a>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
