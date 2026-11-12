'use client';

import React from 'react';
import {
  Dna,
  Snowflake,
  Activity,
  CheckCircle2,
  Box,
  Layers,
  Sparkles,
  Flame,
} from 'lucide-react';
import { EmbryologyLabSample } from '@/lib/dr-zamanian-data';

interface EmbryologyViewProps {
  samples: EmbryologyLabSample[];
}

export default function EmbryologyView({ samples }: EmbryologyViewProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-black text-[#1E293B] flex items-center gap-2">
            <Dna className="w-5 h-5 text-[#8FA382]" />
            <span>واحد و آزمایشگاه فوق‌تخصصی جنین‌شناسی (IVF & Embryo Lab)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            پایش مراحل لقاح آزمایشگاهی، رشد بلاستوسیست‌ها و مدیریت تانک‌های نیتروژن مایع
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-50 text-cyan-800 border border-cyan-200">
            <Snowflake className="w-3.5 h-3.5 text-cyan-600" />
            <span>دمای تانک‌های نیتروژن: ۱۹۶- درجه سانتی‌گراد</span>
          </span>
        </div>
      </div>

      {/* Lab Incubators & Gas Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 block mb-1">انکوباتورهای تایم‌لپس (Geri & K-Systems):</span>
          <div className="text-xl font-black text-[#2C5E8A]">۴ دستگاه فعال</div>
          <span className="text-[11px] text-emerald-600 font-bold mt-1 block">دمای پایدار: ۳۷.۰ °C | CO2: 6.0%</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 block mb-1">نرخ لقاح آزمایشگاهی (Fertilization Rate):</span>
          <div className="text-xl font-black text-[#8FA382]">۷۸.۴ ٪</div>
          <span className="text-[11px] text-slate-500 mt-1 block">روش میکرو اینجکشن (ICSI)</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 block mb-1">موجودی جنین‌های منجمد (Cryopreserved):</span>
          <div className="text-xl font-black text-cyan-700">۲۴۸ استرا</div>
          <span className="text-[11px] text-slate-500 mt-1 block">در تانک‌های A و B نیتروژن مایع</span>
        </div>
      </div>

      {/* Active Embryology Lab Samples Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
        <h3 className="font-bold text-sm text-[#1E293B] mb-4 flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#2C5E8A]" />
          <span>چرخه‌های فعال لقاح و جنین‌شناسی مراجعین امروز:</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold">
                <th className="py-3 px-4">کد پرونده</th>
                <th className="py-3 px-4">زوجین</th>
                <th className="py-3 px-4">اووسیت‌های استخراجی</th>
                <th className="py-3 px-4">تخمک بالغ (MII)</th>
                <th className="py-3 px-4">لقاح یافته (2PN)</th>
                <th className="py-3 px-4">بلاستوسیست روز ۵</th>
                <th className="py-3 px-4">محل فریز در تانک</th>
                <th className="py-3 px-4 text-center">وضعیت</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {samples.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-4 px-4 font-mono font-bold text-[#2C5E8A]">#{s.fileNumber}</td>
                  <td className="py-4 px-4 font-bold text-slate-800">{s.coupleNames}</td>
                  <td className="py-4 px-4 font-mono text-center">{s.oocytesRetrieved} عدد</td>
                  <td className="py-4 px-4 font-mono text-center text-blue-700 font-bold">{s.matureMII}</td>
                  <td className="py-4 px-4 font-mono text-center text-emerald-700 font-bold">{s.fertilized2PN}</td>
                  <td className="py-4 px-4 font-mono text-center text-purple-700 font-bold">{s.blastocystsDay5}</td>
                  <td className="py-4 px-4 text-[11px] text-slate-500 font-mono">{s.storageTankLocation}</td>
                  <td className="py-4 px-4 text-center">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#8FA382]/15 text-[#8FA382]">
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
