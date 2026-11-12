'use client';

import React from 'react';
import { Award, Dna, HeartHandshake, Bot, ShieldCheck } from 'lucide-react';

export default function WhyMehregan() {
  const pillars = [
    {
      icon: <Award className="w-8 h-8 text-[#5B8C7A]" />,
      bg: 'bg-[#F0F4EF]',
      title: 'فلوشیپ فوق‌تخصصی و رتبه علمی',
      desc: 'بیش از ۱۵ سال سابقه بالینی در درمان موارد پیچیده ناباروری و عضویت هیئت علمی دانشگاه علوم پزشکی مازندران.',
    },
    {
      icon: <Dna className="w-8 h-8 text-[#2C5E8A]" />,
      bg: 'bg-blue-50/80',
      title: 'پوشش حمایتی دولتی IVF',
      desc: 'انجام اعمال تخمک‌کشی و انتقال جنین در بخش دولتی کوثر بیمارستان امام خمینی ساری با تعرفه حمایتی ۹۰ درصدی بیمه.',
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-[#C5A880]" />,
      bg: 'bg-[#F6F2EB]',
      title: 'جراحی‌های لاپاراسکوپی کم‌تهاجمی',
      desc: 'انجام پیشرفته‌ترین جراحی‌های کیست، فیبروم و اندومتریوز با حداقل درد، بدون برش باز و با سریع‌ترین ترخیص.',
    },
    {
      icon: <Bot className="w-8 h-8 text-sky-600" />,
      bg: 'bg-sky-50',
      title: 'سامانه هوشمند ربات تلگرام و کال‌سنتر',
      desc: 'پیگیری آنلاین نوبت‌ها و ارتباط مستقیم با منشی از طریق ربات تلگرام (@Ebiiiiii_bot) و تلفن گویا ۰۱۱۹۱۰۱۲۱۲۶.',
    },
  ];

  return (
    <section id="why-us" className="py-20 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-xs font-bold text-[#5B8C7A] uppercase tracking-wider bg-[#F0F4EF] px-3.5 py-1.5 rounded-full border border-[#5B8C7A]/20">
            تمایزهای بالینی
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2C5E8A] mt-2.5 tracking-tight">
            چرا کلینیک فوق‌تخصصی دکتر مرضیه زمانیان؟
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] mt-2 leading-relaxed">
            استانداردهایی فراتر از یک مطب عادی؛ بستری امن، علمی و سرشار از امید برای به آغوش کشیدن فرزند
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="text-center p-6 rounded-3xl bg-[#F8F9FA]/80 hover:bg-white border border-transparent hover:border-slate-200/80 hover:shadow-lg transition-all duration-300 group"
            >
              <div
                className={`w-16 h-16 mx-auto rounded-2xl ${pillar.bg} flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-2xs`}
              >
                {pillar.icon}
              </div>
              <h3 className="font-bold text-[#2C5E8A] text-base mb-2 group-hover:text-[#234b6e] transition-colors">
                {pillar.title}
              </h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
