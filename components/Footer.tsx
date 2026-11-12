'use client';

import React from 'react';
import { Sparkles, Phone, Clock, MapPin, Shield, Building, HeartHandshake } from 'lucide-react';
import { CLINIC_INFO } from '@/lib/clinic-data';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white text-xs pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
        {/* Col 1: Brand Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#2C5E8A] to-[#8FA382] flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-5 h-5 text-[#C5A880]" />
            </div>
            <div>
              <span className="text-base font-black text-white block">{CLINIC_INFO.name}</span>
              <span className="text-[10px] text-[#8FA382]">فلوشیپ فوق‌تخصصی ناباروری و IVF</span>
            </div>
          </div>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            ارائه کلیه خدمات درمان ناباروری، سونوگرافی واژینال، پایش رشد فولیکول، هیستروسکوپی تشخیصی و درمانی در شهر ساری.
          </p>
          <div className="p-2.5 bg-slate-800/80 rounded-xl border border-slate-700/60 text-[10px] text-amber-300">
            <strong>اطلاعیه مهم جراحی:</strong> کلیه کارهای جراحی مربوط به IVF در بخش ناباروری دولتی کوثر بیمارستان امام خمینی ساری انجام می‌شود.
          </div>
        </div>

        {/* Col 2: Quick Links */}
        <div>
          <h4 className="font-bold text-sm text-[#C5A880] mb-4">دسترسی سریع</h4>
          <ul className="space-y-2.5 text-slate-300">
            <li>
              <a href="#hero" className="hover:text-white transition">صفحه اصلی</a>
            </li>
            <li>
              <a href="#doctors" className="hover:text-white transition">برنامه حضور و ویزیت</a>
            </li>
            <li>
              <a href="#why-us" className="hover:text-white transition">روش‌های درمانی IVF و IUI</a>
            </li>
            <li>
              <a href="#success-stories" className="hover:text-white transition">داستان‌های بارداری و نوزادان</a>
            </li>
            <li>
              <a href="#faq" className="hover:text-white transition">سوالات متداول مراجعین</a>
            </li>
            <li>
              <a href="#contact" className="hover:text-white transition">آدرس مطب و بیمارستان کوثر</a>
            </li>
          </ul>
        </div>

        {/* Col 3: Addresses and Centers */}
        <div>
          <h4 className="font-bold text-sm text-[#C5A880] mb-4">نشانی و مراکز بالینی</h4>
          <div className="space-y-3 text-[11px] text-slate-300">
            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] text-emerald-400 font-bold block">مطب و پایش سرپایی:</span>
              <p className="text-slate-300 leading-relaxed">
                مازندران، ساری، بلوار امیر مازندرانی، بیمارستان امیر مازندرانی، طبقه سوم
              </p>
              <div className="text-[10px] font-mono text-slate-400">
                کد پستی: <span className="text-white">{CLINIC_INFO.postalCode}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] text-amber-300 font-bold block">بخش جراحی‌های IVF:</span>
              <p className="text-slate-300 leading-relaxed">
                ساری، خیابان رازی، بخش ناباروری کوثر بیمارستان امام خمینی
              </p>
            </div>
          </div>
        </div>

        {/* Col 4: Fast Dial */}
        <div>
          <h4 className="font-bold text-sm text-[#C5A880] mb-3">سامانه تلفن گویا و تماس</h4>
          <div className="bg-slate-800/90 p-3.5 rounded-2xl border border-slate-700/60 mb-3 space-y-2">
            <div>
              <span className="text-[10px] text-amber-300 font-bold block">تلفن گویا و کال سنتر:</span>
              <a
                href={`tel:${CLINIC_INFO.callCenterRaw}`}
                className="text-lg font-black text-white hover:text-amber-300 transition dir-ltr block font-mono"
              >
                {CLINIC_INFO.callCenter}
              </a>
              <div className="text-[10px] text-slate-300 mt-1 space-y-0.5">
                <div>• کلید ۱ (ویزیت): منشی خانم اسدی</div>
                <div>• کلید ۲ (مشاوره): خانم جعفری</div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-700/80">
              <span className="text-[10px] text-slate-400 block mb-0.5">خطوط مستقیم مطب:</span>
              <div className="flex items-center justify-between font-mono text-[11px] text-[#C5A880] dir-ltr">
                <a href={`tel:${CLINIC_INFO.phone1Raw}`} className="hover:underline">{CLINIC_INFO.phone1}</a>
                <span className="text-slate-500">|</span>
                <a href={`tel:${CLINIC_INFO.phone2Raw}`} className="hover:underline">{CLINIC_INFO.phone2}</a>
              </div>
            </div>
            <div className="pt-2">
              <a
                href="https://t.me/Ebiiiiii_bot"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-3 rounded-xl bg-sky-600/30 hover:bg-sky-600/50 border border-sky-500/40 text-sky-200 text-center font-bold text-[11px] transition flex items-center justify-center gap-1.5"
              >
                <span>ربات رسمی نوبت‌دهی تلگرام (@Ebiiiiii_bot)</span>
              </a>
            </div>
            <div className="text-[10px] text-slate-400 text-center mt-2">
              شنبه، یکشنبه و سه‌شنبه: ۱۴:۰۰ الی ۲۲:۰۰ (مطب ساری)
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-4">
        <p>© کلیه حقوق محفوظ است - مطب فوق‌تخصصی زنان و درمان ناباروری دکتر مرضیه زمانیان (ساری).</p>
        <p>جراحی‌های IVF: بخش ناباروری دولتی کوثر بیمارستان امام خمینی ساری</p>
      </div>
    </footer>
  );
}
