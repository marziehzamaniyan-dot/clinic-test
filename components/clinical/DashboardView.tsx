'use client';

import React, { useState } from 'react';
import {
  Users,
  Scissors,
  Dna,
  Activity,
  AlertTriangle,
  Clock,
  CheckCircle2,
  FileEdit,
  ArrowUpRight,
  Filter,
  Eye,
  Check,
  Send,
  Sparkles,
} from 'lucide-react';
import {
  AppointmentQueueItem,
  MedicationAlert,
  EmbryologyLabSample,
  Patient,
} from '@/lib/dr-zamanian-data';
import {
  formatPatientDisplayName,
  calculateClinicalStats,
  filterQueue,
} from '@/lib/clinic-mgmt-logic';

interface DashboardViewProps {
  queue: AppointmentQueueItem[];
  alerts: MedicationAlert[];
  samples: EmbryologyLabSample[];
  patients: Patient[];
  privacyMode: boolean;
  onOpenClinicalNote: (item: AppointmentQueueItem) => void;
  onUpdateQueueStatus: (id: string, newStatus: AppointmentQueueItem['status']) => void;
  onAcknowledgeAlert: (alertId: string) => void;
  onSelectPatientByFile: (fileNumber: string) => void;
}

export default function DashboardView({
  queue,
  alerts,
  samples,
  patients,
  privacyMode,
  onOpenClinicalNote,
  onUpdateQueueStatus,
  onAcknowledgeAlert,
  onSelectPatientByFile,
}: DashboardViewProps) {
  const [queueFilter, setQueueFilter] = useState<'all' | 'منتظر' | 'در حال ویزیت' | 'انجام شد'>('all');
  const [selectedVisitType, setSelectedVisitType] = useState<string>('all');

  const stats = calculateClinicalStats(queue, alerts, samples);

  const filteredQueue = filterQueue(queue, {
    status: queueFilter,
    visitType: selectedVisitType,
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. DASHBOARD STATUS CARDS [داشبورد وضعیت امروز کلینیک] */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-base sm:text-lg font-black text-[#1E293B] flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#2C5E8A]" />
              <span>داشبورد وضعیت امروز کلینیک دکتر زمانیان (ساری)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              مطب: بیمارستان امیر مازندرانی (ط ۳) | کد پستی: ۴۸۱۶۷۴۵۳۶۵
            </p>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-bold flex items-center gap-1.5 self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>اعمال جراحی IVF: بخش ناباروری دولتی کوثر بیمارستان امام خمینی ساری</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: ویزیت‌های امروز: ۴۲ */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500">ویزیت‌های امروز کلینیک</span>
              <div className="w-9 h-9 rounded-xl bg-[#2C5E8A]/10 text-[#2C5E8A] flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-[#2C5E8A]">۴۲</span>
              <span className="text-xs text-slate-400">بیمار پذیرش‌شده</span>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
              <span className="text-emerald-700 font-bold">۲۴ ویزیت تکمیل‌شده</span>
              <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                {stats.todayVisitsWaiting} در انتظار
              </span>
            </div>
          </div>

          {/* Card 2: عمل‌های پانکچر / انتقال: ۸ */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500">عمل‌های پانکچر و انتقال (OR)</span>
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                <Scissors className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-purple-700">۸</span>
              <span className="text-xs text-slate-400">مورد اتاق عمل</span>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
              <span>۵ عمل پانکچر (OPU)</span>
              <span className="font-bold text-purple-700">۳ انتقال جنین (ET)</span>
            </div>
          </div>

          {/* Card 3: واحد جنین‌شناسی */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500">آزمایشگاه جنین‌شناسی (IVF Lab)</span>
              <div className="w-9 h-9 rounded-xl bg-[#8FA382]/10 text-[#8FA382] flex items-center justify-center">
                <Dna className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-[#8FA382]">۱۶</span>
              <span className="text-xs text-slate-400">چرخه در انکوباسیون</span>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
              <span>۹ نمونه در مرحله 2PN</span>
              <span className="font-bold text-[#8FA382]">۷ بلاستوسیست فریز</span>
            </div>
          </div>

          {/* Card 4: هشدارهای زمان‌حساس HCG */}
          <div className="bg-white p-5 rounded-2xl border border-amber-200/90 bg-gradient-to-br from-white to-amber-50/40 shadow-xs hover:shadow-md transition">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-amber-900">هشدارهای دارویی زمان‌حساس</span>
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center animate-bounce">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-amber-700">۳</span>
              <span className="text-xs text-amber-800 font-bold">بیمار نیازمند HCG</span>
            </div>
            <div className="mt-3 pt-2.5 border-t border-amber-200/60 flex items-center justify-between text-[11px] text-amber-900">
              <span>پروتکل تریگر اوویترل</span>
              <span className="font-bold underline cursor-pointer">بررسی سریع</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CRITICAL MEDICATION ALERTS BANNER [هشدارهای سیستم و دارویی] */}
      <section className="bg-gradient-to-r from-amber-50 via-amber-50/80 to-white border border-amber-200 rounded-3xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-amber-950 text-sm sm:text-base">
                [هشدارهای سیستم و دارویی - پروتکل‌های زمان‌حساس ART]
              </h3>
              <p className="text-xs text-amber-800 mt-0.5">
                ۳ بیمار نیازمند اعلام زمان تزریق HCG هستند (فاصله ۳۶ ساعت تا پانکچر)
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-amber-900 bg-amber-200/60 px-3 py-1 rounded-full self-start sm:self-auto">
            اولویت بالینی درجه ۱
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-2">
          {alerts.filter(a => a.status === 'pending').map((alert) => (
            <div
              key={alert.id}
              className="bg-white p-4 rounded-2xl border border-amber-200 shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono font-bold bg-[#2C5E8A]/10 text-[#2C5E8A] px-2 py-0.5 rounded-md">
                    #{alert.fileNumber}
                  </span>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                    {alert.dueTime}
                  </span>
                </div>
                <h4 className="font-bold text-xs text-[#1E293B] mb-1">
                  بیمار: {formatPatientDisplayName(alert.patientName, privacyMode)}
                </h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {alert.actionRequired}
                </p>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => onSelectPatientByFile(alert.fileNumber)}
                  className="text-[11px] text-[#2C5E8A] hover:underline font-bold"
                >
                  مشاهده سونوگرافی
                </button>
                <button
                  type="button"
                  onClick={() => onAcknowledgeAlert(alert.id)}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-[11px] font-bold flex items-center gap-1 transition cursor-pointer"
                >
                  <Send className="w-3 h-3" />
                  <span>ثبت و ارسال پیامک</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. TABLE OF APPOINTMENTS & QUEUE [جدول نوبتها و مراجعین منتظر] */}
      <section className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base sm:text-lg font-black text-[#2C5E8A] tracking-tight">
              [جدول نوبت‌ها و مراجعین منتظر امروز کلینیک]
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              ثبت آنلاین اقدامات امنیتی، شرح‌حال بالینی، و مدیریت اتاق‌های معاینه و سونوگرافی
            </p>
          </div>

          {/* Filter Controls */}
          <div className="flex items-center flex-wrap gap-2 text-xs">
            {/* Status Pills */}
            <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1">
              {(['all', 'منتظر', 'در حال ویزیت', 'انجام شد'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setQueueFilter(st)}
                  className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer ${
                    queueFilter === st
                      ? 'bg-[#2C5E8A] text-white font-bold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {st === 'all' ? 'همه وضعیت‌ها' : st}
                </button>
              ))}
            </div>

            {/* Visit Type Dropdown */}
            <select
              value={selectedVisitType}
              onChange={(e) => setSelectedVisitType(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-white text-slate-700 outline-none"
            >
              <option value="all">همه انواع مراجعه</option>
              <option value="پایش فولیکول">پایش فولیکول</option>
              <option value="پانکچر (تخمک‌کشی)">پانکچر (تخمک‌کشی)</option>
              <option value="انتقال جنین (ET)">انتقال جنین (ET)</option>
              <option value="سونوگرافی کنترل">سونوگرافی کنترل</option>
              <option value="تزریق HCG">تزریق HCG</option>
            </select>
          </div>
        </div>

        {/* The Main Queue Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600 font-bold">
                <th className="py-3.5 px-4 rounded-r-xl">کد پرونده</th>
                <th className="py-3.5 px-4">نام بیمار</th>
                <th className="py-3.5 px-4">نوع مراجعه</th>
                <th className="py-3.5 px-4">ساعت / محل</th>
                <th className="py-3.5 px-4">وضعیت</th>
                <th className="py-3.5 px-4 text-center rounded-l-xl">اقدام امنیتی و بالینی</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredQueue.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  {/* کد پرونده */}
                  <td className="py-4 px-4 font-mono font-bold text-[#2C5E8A]">
                    <button
                      type="button"
                      onClick={() => onSelectPatientByFile(item.fileNumber)}
                      className="hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>#{item.fileNumber}</span>
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  </td>

                  {/* نام بیمار (با قابلیت م. ر. در حالت حریم خصوصی) */}
                  <td className="py-4 px-4 font-bold text-[#1E293B]">
                    <div className="flex items-center gap-2">
                      <span>{formatPatientDisplayName(item.patientName, privacyMode)}</span>
                      {privacyMode && (
                        <span className="text-[10px] text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded font-normal">
                          مخفف امن
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      سن: {item.age} سال
                    </span>
                  </td>

                  {/* نوع مراجعه */}
                  <td className="py-4 px-4">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                        item.visitType === 'پایش فولیکول'
                          ? 'bg-blue-50 text-[#2C5E8A] border border-blue-200/60'
                          : item.visitType.includes('پانکچر')
                          ? 'bg-purple-50 text-purple-700 border border-purple-200/60'
                          : item.visitType.includes('انتقال')
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/60'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {item.visitType}
                    </span>
                    {item.priority === 'زمان‌حساس (HCG)' && (
                      <span className="mr-1.5 text-[10px] text-amber-600 font-bold">
                        (زمان‌حساس)
                      </span>
                    )}
                  </td>

                  {/* ساعت و محل */}
                  <td className="py-4 px-4">
                    <span className="font-mono text-slate-800 font-bold block">{item.time}</span>
                    <span className="text-[10px] text-slate-400 block">{item.room}</span>
                  </td>

                  {/* وضعیت */}
                  <td className="py-4 px-4">
                    <select
                      value={item.status}
                      onChange={(e) =>
                        onUpdateQueueStatus(item.id, e.target.value as AppointmentQueueItem['status'])
                      }
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition cursor-pointer ${
                        item.status === 'منتظر'
                          ? 'bg-amber-50 text-amber-900 border-amber-200'
                          : item.status === 'در حال ویزیت'
                          ? 'bg-blue-50 text-[#2C5E8A] border-blue-200 animate-pulse'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      }`}
                    >
                      <option value="منتظر">منتظر</option>
                      <option value="در حال ویزیت">در حال ویزیت</option>
                      <option value="انجام شد">انجام شد</option>
                      <option value="انتقال به اتاق عمل">انتقال به اتاق عمل</option>
                    </select>
                  </td>

                  {/* اقدام امنیتی / بالینی: [ثبت شرح حال] */}
                  <td className="py-4 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => onOpenClinicalNote(item)}
                      className="px-4 py-2 bg-[#2C5E8A] hover:bg-[#234b6e] text-white rounded-xl text-xs font-bold transition shadow-2xs hover:shadow-sm flex items-center justify-center gap-1.5 mx-auto active:scale-95 cursor-pointer"
                    >
                      <FileEdit className="w-3.5 h-3.5 text-[#C5A880]" />
                      <span>[ثبت شرح حال]</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
