'use client';

import React from 'react';
import Image from 'next/image';
import { ShieldCheck, ArrowLeft, Sparkles, Clock, Building2, Award } from 'lucide-react';

interface HeroProps {
  onScrollToDoctors: () => void;
  onScrollToAbout: () => void;
}

export default function Hero({ onScrollToDoctors, onScrollToAbout }: HeroProps) {
  return (
    <section id="hero" className="relative py-14 sm:py-20 lg:py-24 overflow-hidden bg-gradient-to-b from-[#F8F9FA] via-[#F8F9FA] to-white">
      {/* Subtle decorative background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#8FA382]/10 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#2C5E8A]/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left/Content Column (in RTL, appears first on right) */}
        <div className="lg:col-span-7 space-y-6 text-right">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F0F4EF] text-[#8FA382] text-xs font-bold border border-[#8FA382]/20">
            <ShieldCheck className="w-4 h-4 shrink-0 text-[#8FA382]" />
            <span>مازندران، ساری | فلوشیپ فوق‌تخصصی زنان و درمان ناباروری (IVF)</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#2C5E8A] leading-[1.3] tracking-tight">
            مطب فوق‌تخصصی<br />
            <span className="text-[#8FA382]">دکتر مرضیه زمانیان</span>
          </h1>

          <div className="inline-flex items-center gap-2 bg-[#2C5E8A]/10 text-[#2C5E8A] px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono">
            <span>شماره نظام پزشکی:</span>
            <span className="text-sm font-black text-[#2C5E8A]">۸۹۷۰۲</span>
          </div>

          <p className="text-[#64748B] text-base leading-relaxed max-w-2xl">
            ارائه خدمات تخصصی پایش رشد فولیکول، سونوگرافی‌های باروری، هیستروسکوپی و درمان‌های ART در شهر ساری.
          </p>

          {/* Critical IVF Surgery Notice Card as requested */}
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/90 text-right shadow-xs">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-800 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                توجه
              </div>
              <div className="text-xs space-y-1">
                <div className="font-black text-amber-900">
                  مرکز انجام اعمال جراحی ناباروری (IVF):
                </div>
                <p className="text-amber-800 leading-relaxed">
                  لازم به‌ذکر است <span className="font-bold underline decoration-amber-400 decoration-2">کلیه کارهای جراحی مربوط به IVF</span> (شامل عمل پانکچر / تخمک‌کشی و انتقال جنین) در <span className="font-black text-slate-900">بخش ناباروری دولتی کوثر بیمارستان امام خمینی ساری</span> انجام می‌شود.
                </p>
                <div className="text-[11px] text-amber-700 font-medium pt-1">
                  محل ویزیت‌ها و سونوگرافی: ساری، بلوار امیر مازندرانی، بیمارستان امیر مازندرانی، طبقه ۳ (کد پستی: ۴۸۱۶۷۴۵۳۶۵)
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap gap-3 items-center">
            {/* DrDr.ir Direct Booking Button */}
            <a
              href="https://drdr.ir/dr/89702"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-6 py-3.5 rounded-xl text-sm font-bold shadow-md shadow-amber-500/20 transition flex items-center gap-2 active:scale-95 cursor-pointer"
            >
              <span>نوبت‌دهی در سایت دکتردکتر</span>
              <ArrowLeft className="w-4 h-4" />
            </a>

            <a
              href="#doctors"
              onClick={(e) => {
                e.preventDefault();
                onScrollToDoctors();
              }}
              className="bg-[#2C5E8A] hover:bg-[#234b6e] text-white px-6 py-3.5 rounded-xl text-sm font-bold shadow-md shadow-[#2C5E8A]/20 transition flex items-center gap-2 active:scale-95 cursor-pointer"
            >
              <span>برنامه حضور و شیفت‌ها</span>
            </a>

            <a
              href="#contact"
              className="bg-white border border-slate-200 text-[#1E293B] hover:bg-slate-50 px-5 py-3.5 rounded-xl text-sm font-medium transition cursor-pointer shadow-2xs"
            >
              <span>مسیریابی مطب و بیمارستان</span>
            </a>
          </div>

          {/* Trust Points */}
          <div className="pt-8 border-t border-slate-200/60 grid grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-white/60 p-3 sm:p-4 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-1.5 text-2xl font-black text-[#2C5E8A]">
                <span>۶+</span>
                <Building2 className="w-4 h-4 text-[#2C5E8A]/60 hidden sm:inline" />
              </div>
              <div className="text-xs text-[#64748B] mt-1 font-medium">دپارتمان فوق‌تخصصی</div>
            </div>

            <div className="bg-white/60 p-3 sm:p-4 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-1.5 text-2xl font-black text-[#8FA382]">
                <span>۱۰۰٪</span>
                <Award className="w-4 h-4 text-[#8FA382]/60 hidden sm:inline" />
              </div>
              <div className="text-xs text-[#64748B] mt-1 font-medium">پروتکل‌های استریل بیمارستانی</div>
            </div>

            <div className="bg-white/60 p-3 sm:p-4 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-1.5 text-2xl font-black text-[#C5A880]">
                <span className="dir-ltr inline-block">13.5 h</span>
                <Clock className="w-4 h-4 text-[#C5A880]/60 hidden sm:inline" />
              </div>
              <div className="text-xs text-[#64748B] mt-1 font-medium">پوشش روزانه پاسخگویی</div>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Visual Card */}
        <div className="lg:col-span-5 relative">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100 aspect-[4/5] max-w-md mx-auto group">
            <Image
              src="/assets/dr_zamanian_hero_real.jpg"
              alt="دکتر مرضیه زمانیان - متخصص زنان، زایمان و فلوشیپ نازایی و IVF در مطب ساری"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 450px"
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2C5E8A]/60 via-transparent to-transparent" />

            {/* Floating Quality Badge */}
            <div className="absolute bottom-6 right-6 left-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/60">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#F6F2EB] text-[#C5A880] flex items-center justify-center text-xl shrink-0">
                  <Sparkles className="w-6 h-6 text-[#C5A880]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#1E293B]">دکتر مرضیه زمانیان (نظام: ۸۹۷۰۲)</h4>
                  <p className="text-[11px] text-[#64748B] mt-0.5">پایش فولیکول و سونوگرافی باروری در مطب ساری</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
