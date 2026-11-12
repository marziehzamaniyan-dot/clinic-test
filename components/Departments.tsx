'use client';

import React from 'react';
import {
  Dna,
  Sparkles,
  Baby,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  Send,
} from 'lucide-react';
import { DEPARTMENTS, Department } from '@/lib/clinic-data';

interface DepartmentsProps {
  onSelectDepartment: (deptId: string) => void;
}

export default function Departments({ onSelectDepartment }: DepartmentsProps) {
  const getDepartmentIcon = (iconName: string) => {
    switch (iconName) {
      case 'Dna':
        return <Dna className="w-6 h-6" />;
      case 'Sparkles':
        return <Sparkles className="w-6 h-6" />;
      case 'Baby':
        return <Baby className="w-6 h-6" />;
      default:
        return <Dna className="w-6 h-6" />;
    }
  };

  const getColorClasses = (color: Department['colorClass']) => {
    switch (color) {
      case 'petrol':
        return {
          iconBg: 'bg-[#2C5E8A]/10 text-[#2C5E8A] group-hover:bg-[#2C5E8A] group-hover:text-white',
          accent: 'border-[#2C5E8A]/30',
          badge: 'bg-[#2C5E8A]/10 text-[#2C5E8A]',
        };
      case 'sage':
        return {
          iconBg: 'bg-[#5B8C7A]/15 text-[#5B8C7A] group-hover:bg-[#5B8C7A] group-hover:text-white',
          accent: 'border-[#5B8C7A]/30',
          badge: 'bg-[#F0F4EF] text-[#5B8C7A]',
        };
      case 'gold':
        return {
          iconBg: 'bg-[#C5A880]/15 text-[#C5A880] group-hover:bg-[#C5A880] group-hover:text-white',
          accent: 'border-[#C5A880]/30',
          badge: 'bg-[#F6F2EB] text-[#C5A880]',
        };
    }
  };

  return (
    <section id="services" className="py-20 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-[#5B8C7A] bg-[#F0F4EF] px-3.5 py-1.5 rounded-full inline-block border border-[#5B8C7A]/20">
            تمرکز انحصاری فوق‌تخصصی
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2C5E8A] mt-3 tracking-tight">
            ۳ محور اصلی خدمات کلینیکال دکتر مرضیه زمانیان
          </h2>
          <p className="text-[#64748B] text-sm sm:text-base mt-2 leading-relaxed">
            ارائه پیشرفته‌ترین پروتکل‌های لقاح آزمایشگاهی، لاپاراسکوپی کم‌تهاجمی و مراقبت‌های مادر و جنین در بالاترین استانداردهای علمی
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {DEPARTMENTS.map((dept) => {
            const styles = getColorClasses(dept.colorClass);
            return (
              <div
                key={dept.id}
                className="p-7 rounded-3xl bg-[#F8F9FA] border border-slate-200/80 hover:shadow-xl hover:border-[#2C5E8A]/40 hover:-translate-y-1 transition duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-xs transition-colors duration-300 ${styles.iconBg}`}
                    >
                      {getDepartmentIcon(dept.iconName)}
                    </div>
                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-600">
                      محور فوق‌تخصصی
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#2C5E8A] mb-2.5 group-hover:text-[#234b6e] transition-colors leading-snug">
                    {dept.title}
                  </h3>

                  <p className="text-xs text-[#64748B] mb-5 leading-relaxed">
                    {dept.description}
                  </p>

                  <div className="space-y-2.5 pt-4 border-t border-slate-200/60 mb-6">
                    {dept.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-[#5B8C7A] shrink-0 mt-0.5" />
                        <span className="leading-tight">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onSelectDepartment(dept.id)}
                    className="flex-1 py-2.5 px-3 bg-[#2C5E8A]/10 hover:bg-[#2C5E8A] text-[#2C5E8A] hover:text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    برنامه شیفت و نوبت
                  </button>

                  <a
                    href="https://t.me/Ebiiiiii_bot"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-xl transition cursor-pointer border border-sky-200"
                    title="رزرو این خدمت در ربات تلگرام"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
