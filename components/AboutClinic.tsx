'use client';

import React from 'react';
import Image from 'next/image';
import { Award, CheckCircle2, ShieldCheck, HeartHandshake } from 'lucide-react';

export default function AboutClinic() {
  const standards = [
    {
      title: 'سرمایش و تهویه هوای مطبوع اختصاصی',
      desc: 'کولر گازی اختصاصی و اسپلیت داخل کلیه اتاق‌های ویزیت و سونوگرافی به همراه سیستم تهویه مطبوع مداوم.',
    },
    {
      title: 'سامانه پرونده الکترونیک سلامت (EHR)',
      desc: 'ثبت و آرشیو رمزگذاری‌شده سوابق ناباروری، آزمایش‌های هورمونی و سونوگرافی‌های سریال بدون نیاز به حمل مدارک کاغذی.',
    },
    {
      title: 'واحد استریلیزاسیون پیشرفته و کنترل عفونت',
      desc: 'استفاده از اتوکلاوهای کلاس B اروپایی و پروتکل‌های سخت‌گیرانه وزارت بهداشت در تمامی پروسیجرهای زنان.',
    },
    {
      title: 'حفظ آرامش، حریم خصوصی و امنیت روانی',
      desc: 'طراحی تخصصی فضاهای مشاوره و اتاق سونوگرافی جهت صیانت کامل از حریم خصوصی زوجین و کاهش استرس‌های درمان.',
    },
  ];

  return (
    <section id="about" className="py-20 bg-[#F8F9FA] border-t border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Main Info Column */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold text-[#8FA382] uppercase tracking-wider bg-[#F0F4EF] px-3.5 py-1.5 rounded-full border border-[#8FA382]/20 inline-block">
              درباره کلینیک فوق‌تخصصی دکتر زمانیان
            </span>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#2C5E8A] leading-tight tracking-tight">
              تعهد بالینی، امید پایدار و همراهی صمیمانه در مسیر مادر شدن
            </h2>

            <p className="text-[#64748B] text-sm sm:text-base leading-relaxed">
              کلینیک فوق‌تخصصی زنان، زایمان و درمان ناباروری دکتر مرضیه زمانیان با هدف ارائه پیشرفته‌ترین خدمات لقاح آزمایشگاهی (IVF / ICSI)، جراحی‌های کم‌تهاجمی لاپاراسکوپی و مراقبت‌های ویژه بارداری در استان مازندران پایه‌گذاری شده است. تمرکز این مرکز بر پایش‌های علمی و دقیق، دسترسی آسان به نوبت و شفافیت در کلیه مراحل درمان است.
            </p>

            {/* Doctor Quote */}
            <div className="border-r-3 border-[#C5A880] pr-4 py-1 space-y-2 bg-[#F6F2EB]/50 rounded-l-xl p-3">
              <p className="italic text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                «درمان ناباروری فراتر از تجویز دارو و سونوگرافی است؛ این مسیر نیازمند همراهی صمیمانه، ایجاد آرامش روانی و دقت وسواس‌گونه در پروتکل‌های جنین‌شناسی است تا رویای شیرین والد شدن در آغوش خانواده‌ها شکوفا گردد.»
              </p>
              <span className="block text-xs font-bold text-[#2C5E8A]">
                — دکتر مرضیه زمانیان، فلوشیپ فوق‌تخصصی زنان، زایمان و ناباروری (نظام پزشکی: ۸۹۷۰۲)
              </span>
            </div>

            {/* Gallery Grid Preview */}
            <div className="grid grid-cols-3 gap-3 pt-3">
              <div className="relative rounded-2xl overflow-hidden h-28 border border-slate-200 group">
                <Image
                  src="/assets/dr_zamanian_ultrasound.jpg"
                  alt="اتاق سونوگرافی و پایش فولیکول"
                  fill
                  sizes="(max-width: 768px) 33vw, 200px"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                <span className="absolute bottom-2 right-2 text-[10px] text-white font-medium bg-black/50 px-2 py-0.5 rounded-md backdrop-blur-xs">
                  سونوگرافی داپلر
                </span>
              </div>

              <div className="relative rounded-2xl overflow-hidden h-28 border border-slate-200 group">
                <Image
                  src="/assets/dr_zamanian_baby.jpg"
                  alt="تولد نوزادان امید با درمان IVF"
                  fill
                  sizes="(max-width: 768px) 33vw, 200px"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                <span className="absolute bottom-2 right-2 text-[10px] text-white font-medium bg-black/50 px-2 py-0.5 rounded-md backdrop-blur-xs">
                  نوزادان امید
                </span>
              </div>

              <div className="relative rounded-2xl overflow-hidden h-28 border border-slate-200 group">
                <Image
                  src="/assets/dr_zamanian_smiling.jpg"
                  alt="فضای ویزیت و مشاوره مطب ساری"
                  fill
                  sizes="(max-width: 768px) 33vw, 200px"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                <span className="absolute bottom-2 right-2 text-[10px] text-white font-medium bg-black/50 px-2 py-0.5 rounded-md backdrop-blur-xs">
                  مطب ساری
                </span>
              </div>
            </div>
          </div>

          {/* Standards Card Column */}
          <div className="lg:col-span-6 bg-white p-7 sm:p-9 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="w-12 h-12 rounded-2xl bg-[#F6F2EB] text-[#C5A880] flex items-center justify-center shrink-0">
                <Award className="w-6 h-6 text-[#C5A880]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#2C5E8A]">
                  استانداردهای بهداشتی، تجهیزاتی و ایمنی مراجعین
                </h3>
                <p className="text-xs text-[#64748B]">انطباق کامل با پروتکل‌های کلینیکال و رفاهی مراجعین</p>
              </div>
            </div>

            <ul className="space-y-4 text-xs sm:text-sm text-[#64748B]">
              {standards.map((st, idx) => (
                <li key={idx} className="flex items-start gap-3 bg-[#F8F9FA] p-3.5 rounded-xl border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-[#8FA382] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-[#1E293B] text-xs sm:text-sm mb-1">{st.title}</h4>
                    <p className="text-xs text-[#64748B] leading-relaxed">{st.desc}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="p-3.5 rounded-xl bg-[#F0F4EF] text-[#8FA382] text-xs font-semibold flex items-center gap-2 border border-[#8FA382]/30">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>پایش‌های بالینی و پروسیجرهای جراحی تحت نظارت دقیق دانشگاه علوم پزشکی مازندران انجام می‌شوند.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
