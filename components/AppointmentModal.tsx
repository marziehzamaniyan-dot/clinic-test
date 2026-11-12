'use client';

import React from 'react';
import Image from 'next/image';
import {
  X,
  PhoneCall,
  Clock,
  Calendar,
  CheckCircle2,
  FileText,
  AlertCircle,
  Sparkles,
  CalendarCheck,
  ExternalLink,
  Send,
  Bot,
} from 'lucide-react';
import { Doctor, CLINIC_INFO } from '@/lib/clinic-data';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDoctor: Doctor | null;
}

export default function AppointmentModal({
  isOpen,
  onClose,
  selectedDoctor,
}: AppointmentModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="bg-[#2C5E8A] text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#C5A880]">
              <PhoneCall className="w-5 h-5 text-[#C5A880]" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg leading-tight">
                هماهنگی و اخذ نوبت ویزیت
              </h3>
              <p className="text-xs text-white/80 mt-0.5">
                کلینیک فوق‌تخصصی زنان و درمان ناباروری دکتر مرضیه زمانیان
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition focus:outline-none cursor-pointer"
            aria-label="بستن پنجره"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-right">
          {/* Selected Doctor Info (if any) */}
          {selectedDoctor ? (
            <div className="bg-[#F8F9FA] rounded-2xl p-4 border border-slate-200/80">
              <span className="text-[10px] font-bold text-[#8FA382] uppercase block mb-2">
                پزشک انتخابی شما:
              </span>
              <div className="flex items-center gap-3.5">
                <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-[#8FA382] shrink-0 bg-slate-200">
                  <Image
                    src={selectedDoctor.imageUrl}
                    alt={selectedDoctor.name}
                    fill
                    sizes="56px"
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h4 className="font-black text-[#2C5E8A] text-sm sm:text-base">
                    {selectedDoctor.name}
                  </h4>
                  <p className="text-xs text-[#8FA382] font-semibold mt-0.5">
                    {selectedDoctor.specialty}
                  </p>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    نظام پزشکی: {selectedDoctor.councilId}
                  </span>
                </div>
              </div>

              {/* Doctor Shifts */}
              <div className="mt-3.5 pt-3 border-t border-slate-200/60 text-xs">
                <span className="font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#C5A880]" />
                  شیفت‌های حضور پزشک در کلینیک:
                </span>
                <div className="space-y-1">
                  {selectedDoctor.schedule.map((shift, idx) => (
                    <div key={idx} className="flex justify-between text-[11px] text-slate-600 bg-white px-2.5 py-1.5 rounded-lg border border-slate-100">
                      <span>{shift.days}</span>
                      <span className="font-bold text-[#2C5E8A] dir-ltr">{shift.hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#F0F4EF] p-4 rounded-2xl border border-[#8FA382]/30 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-[#8FA382] shrink-0 mt-0.5" />
              <p className="text-xs text-slate-700 leading-relaxed">
                همکاران بخش پذیرش با توجه به شرح‌حال اولیه و نوع درخواست، شما را با متناسب‌ترین پزشک متخصص و نزدیک‌ترین شیفت کاری هماهنگ خواهند نمود.
              </p>
            </div>
          )}

          {/* 1. Instant Booking via Telegram Bot */}
          <div className="p-4 rounded-2xl bg-sky-50 border-2 border-sky-300 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-sky-500 text-white flex items-center justify-center font-bold">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-sky-950">رزرو خودکار در ربات رسمی تلگرام</h4>
                  <span className="text-[10px] text-sky-800">دریافت کد رهگیری آنی، انتخاب خدمت و پیگیری نوبت</span>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-sky-200 text-sky-900 px-2 py-0.5 rounded-md">
                آنلاین و ۲۴ ساعته
              </span>
            </div>

            <p className="text-[11px] text-sky-900 leading-relaxed">
              شما می‌توانید مستقیماً از طریق ربات تلگرام دکتر زمانیان نوبت خود را ثبت کرده و وضعیت آن را پیگیری فرمایید:
            </p>

            <a
              href="https://t.me/Ebiiiiii_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-black text-xs transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>شروع گفتگو و نوبت‌گیری در ربات تلگرام (@Ebiiiiii_bot)</span>
            </a>
          </div>

          {/* 2. Online Booking via DrDr.ir (دکتردکتر) */}
          <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                  <CalendarCheck className="w-4 h-4 text-slate-950" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-amber-950">نوبت‌دهی آنلاین در سایت دکتردکتر</h4>
                  <span className="text-[10px] text-amber-800">رزرو آنی تاریخ و ساعت ویزیت بدون نیاز به تماس</span>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-md">
                سامانه کشوری
              </span>
            </div>

            <p className="text-[11px] text-amber-900 leading-relaxed">
              مراجعین محترم می‌توانند با کلیک روی دکمه زیر، مستقیماً وارد صفحه دکتر مرضیه زمانیان در سامانه دکتردکتر شده و نوبت خود را آنلاین ثبت فرمایند:
            </p>

            <a
              href={CLINIC_INFO.drdrUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <span>رزرو آنلاین نوبت در سایت دکتردکتر</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* 3. IVR Call Center & Direct Phone Lines */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-700 block">
              یا تماس با تلفن‌های مطب و سامانه گویا (کال سنتر):
            </span>

            {/* Smart Call Center Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#2C5E8A] to-[#234b6e] text-white shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                    <PhoneCall className="w-5 h-5 text-[#C5A880]" />
                  </div>
                  <div>
                    <span className="text-xs font-black block">تلفن گویا و کال سنتر مطب</span>
                    <span className="text-[10px] text-white/80">پاسخگویی خودکار و اتصال مستقیم</span>
                  </div>
                </div>
                <a
                  href={`tel:${CLINIC_INFO.callCenterRaw}`}
                  className="font-black text-base font-mono dir-ltr text-[#C5A880] hover:text-white transition px-2.5 py-1 bg-white/10 rounded-lg"
                >
                  {CLINIC_INFO.callCenter}
                </a>
              </div>

              {/* Extension Shortcuts */}
              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-white/15">
                <a
                  href={`tel:${CLINIC_INFO.callCenterRaw}`}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition block text-right border border-white/10"
                >
                  <div className="text-[#C5A880] font-black text-xs mb-0.5">کلید ۱: دریافت ویزیت</div>
                  <div className="text-white/90 font-medium">منشی مطب (خانم اسدی)</div>
                  <div className="text-[9px] text-white/70">هماهنگی ساعت ویزیت</div>
                </a>

                <a
                  href={`tel:${CLINIC_INFO.callCenterRaw}`}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition block text-right border border-white/10"
                >
                  <div className="text-[#8FA382] font-black text-xs mb-0.5">کلید ۲: مشاوره درمانی</div>
                  <div className="text-white/90 font-medium">مشاور ناباروری (خانم جعفری)</div>
                  <div className="text-[9px] text-white/70">راهنمایی فرآیند و داروها</div>
                </a>
              </div>
            </div>

            {/* Direct Lines */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-500 block">
                یا تماس با خطوط مستقیم مطب:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <a
                  href={`tel:${CLINIC_INFO.phone1Raw}`}
                  className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 flex items-center justify-between transition text-xs"
                >
                  <div className="text-right">
                    <span className="font-bold block">خط مستقیم ۱ مطب</span>
                    <span className="text-[10px] text-slate-400">بیمارستان امیر مازندرانی</span>
                  </div>
                  <span className="font-mono font-bold text-[#2C5E8A] dir-ltr">
                    {CLINIC_INFO.phone1}
                  </span>
                </a>

                <a
                  href={`tel:${CLINIC_INFO.phone2Raw}`}
                  className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 flex items-center justify-between transition text-xs"
                >
                  <div className="text-right">
                    <span className="font-bold block">خط مستقیم ۲ مطب</span>
                    <span className="text-[10px] text-slate-400">پشتیبان پذیرش</span>
                  </div>
                  <span className="font-mono font-bold text-[#2C5E8A] dir-ltr">
                    {CLINIC_INFO.phone2}
                  </span>
                </a>
              </div>
            </div>
          </div>

          {/* Checklist of Documents & Hospital Location */}
          <div className="bg-[#F8F9FA] p-4 rounded-2xl border border-slate-200/80 text-xs space-y-2.5">
            <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200/80 text-[11px] text-amber-900 leading-relaxed">
              <strong>محل ویزیت:</strong> {CLINIC_INFO.address} (کد پستی: {CLINIC_INFO.postalCode})<br />
              <span className="text-amber-800 font-bold block pt-1">
                * کلیه جراحی‌های مربوط به IVF در بخش ناباروری دولتی کوثر بیمارستان امام خمینی ساری انجام می‌شود.
              </span>
            </div>

            <span className="font-bold text-slate-700 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#8FA382]" />
              مدارک لازم برای روز مراجعه:
            </span>
            <ul className="space-y-1.5 text-[11px] text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3 h-3 text-[#8FA382] shrink-0" />
                <span>کارت ملی زوجین یا مدرک هویتی معتبر</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3 h-3 text-[#8FA382] shrink-0" />
                <span>نتایج آزمایش‌های هورمونی، AMH، سونوگرافی‌ها یا سوابق قبلی</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3 h-3 text-[#8FA382] shrink-0" />
                <span>لیست داروهای مصرفی فعلی</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500 text-[11px]">
            ساعت پاسخگویی: شنبه تا چهارشنبه ۸ الی ۲۱:۳۰
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 transition cursor-pointer"
          >
            متوجه شدم
          </button>
        </div>
      </div>
    </div>
  );
}
