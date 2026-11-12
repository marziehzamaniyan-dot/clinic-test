'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { CLINIC_FAQS } from '@/lib/clinic-data';

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-white border-t border-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <span className="text-xs font-bold text-[#8FA382] uppercase tracking-wider bg-[#F0F4EF] px-3.5 py-1.5 rounded-full border border-[#8FA382]/20 inline-block">
            پاسخ به پرسش‌های مراجعین
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2C5E8A] mt-2.5 tracking-tight">
            سوالات متداول
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] mt-2">
            راهنمای جامع پیش از حضور و فرآیندهای نوبت‌دهی در کلینیک مهرگان
          </p>
        </div>

        <div className="space-y-3.5">
          {CLINIC_FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="border border-slate-200/90 rounded-2xl overflow-hidden transition-all duration-200 bg-[#F8F9FA]"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full text-right p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-[#2C5E8A] hover:bg-slate-50 transition cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="flex items-center gap-2.5">
                    <HelpCircle className="w-4 h-4 text-[#8FA382] shrink-0" />
                    <span>{faq.q}</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#2C5E8A]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#64748B] leading-relaxed border-t border-slate-200/60 bg-white animate-in fade-in-50 duration-200">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
