'use client';

import React, { useState } from 'react';
import {
  FolderHeart,
  Search,
  User,
  Activity,
  FileText,
  Calendar,
  AlertCircle,
  Plus,
  ArrowLeft,
  ChevronRight,
  Shield,
  Dna,
} from 'lucide-react';
import { Patient } from '@/lib/dr-zamanian-data';
import { formatPatientDisplayName } from '@/lib/clinic-mgmt-logic';

interface PatientsEhrViewProps {
  patients: Patient[];
  privacyMode: boolean;
  selectedPatient: Patient | null;
  onSelectPatient: (patient: Patient | null) => void;
}

export default function PatientsEhrView({
  patients,
  privacyMode,
  selectedPatient,
  onSelectPatient,
}: PatientsEhrViewProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = patients.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.fileNumber.includes(q) ||
      p.fullName.toLowerCase().includes(q) ||
      p.nationalId.includes(q) ||
      p.treatmentType.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-black text-[#1E293B] flex items-center gap-2">
            <FolderHeart className="w-5 h-5 text-[#2C5E8A]" />
            <span>سامانه پرونده الکترونیک سلامت بیماران (EHR)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            آرشیو سوابق درمان ناباروری، پروتکل‌های تحریک تخمک‌گذاری و نتایج سونوگرافی
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجوی نام، کد ملی یا شماره پرونده..."
            className="w-full pr-9 pl-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:border-[#2C5E8A] outline-none"
          />
        </div>
      </div>

      {selectedPatient ? (
        /* Patient Detail View */
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6 animate-in fade-in-50 duration-150">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => onSelectPatient(null)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
                title="بازگشت به فهرست بیماران"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold text-[#2C5E8A]">
                    {formatPatientDisplayName(selectedPatient.fullName, privacyMode)}
                  </h3>
                  <span className="font-mono bg-blue-50 text-[#2C5E8A] px-2 py-0.5 rounded text-xs font-bold border border-blue-200">
                    پرونده #{selectedPatient.fileNumber}
                  </span>
                  <span className="bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full text-xs font-bold">
                    {selectedPatient.treatmentType}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-1 flex flex-wrap gap-4">
                  <span>کد ملی: {selectedPatient.nationalId}</span>
                  <span>سن: {selectedPatient.age} سال</span>
                  <span>همسر: {selectedPatient.partnerName}</span>
                  <span>تلفن: {selectedPatient.phone}</span>
                </div>
              </div>
            </div>

            <div className="text-left">
              <span className="text-[11px] text-slate-400 block">پزشک معالج:</span>
              <span className="text-xs font-bold text-[#1E293B]">دکتر مرضیه زمانیان</span>
            </div>
          </div>

          {/* Current Active IVF Cycle Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#F8F9FA] p-4 rounded-2xl border border-slate-200">
              <span className="text-xs text-slate-500 block mb-1">مرحله فعلی سیکل:</span>
              <span className="text-sm font-bold text-[#2C5E8A] block">{selectedPatient.cyclePhase}</span>
              <span className="text-[11px] text-slate-400 mt-1 block">آخرین مراجعه: {selectedPatient.lastVisit}</span>
            </div>

            <div className="bg-[#F8F9FA] p-4 rounded-2xl border border-slate-200">
              <span className="text-xs text-slate-500 block mb-1">پروتکل دارویی فعال:</span>
              <span className="text-xs font-bold text-[#1E293B] block leading-relaxed">
                {selectedPatient.protocol || 'آنتاگونیست استاندارد'}
              </span>
            </div>

            <div className="bg-[#F8F9FA] p-4 rounded-2xl border border-slate-200">
              <span className="text-xs text-slate-500 block mb-1">ضخامت اندومتر:</span>
              <span className="text-sm font-black text-emerald-700 block dir-ltr text-right">
                {selectedPatient.endometriumThickness ? `${selectedPatient.endometriumThickness} mm` : 'ارزیابی نشده'}
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">پترن سه‌خطی مطلوب</span>
            </div>
          </div>

          {/* Follicle Scan Schematics */}
          <div className="bg-blue-50/40 p-5 rounded-2xl border border-blue-200/60 space-y-3">
            <h4 className="text-xs font-bold text-[#2C5E8A] flex items-center gap-1.5">
              <Activity className="w-4 h-4" />
              <span>نمایش شماتیک اندازه فولیکول‌های دو تخمدان (میلی‌متر)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl border border-blue-100">
                <span className="text-xs font-bold text-slate-700 block mb-2">تخمدان راست (Right Ovary):</span>
                <div className="flex flex-wrap gap-2">
                  {selectedPatient.folliclesRight && selectedPatient.folliclesRight.length > 0 ? (
                    selectedPatient.folliclesRight.map((size, idx) => (
                      <span
                        key={idx}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${
                          size >= 18
                            ? 'bg-amber-500 text-white shadow-xs'
                            : 'bg-blue-100 text-[#2C5E8A]'
                        }`}
                        title={size >= 18 ? 'فولیکول بالغ کاندید تخمک‌کشی' : 'فولیکول در حال رشد'}
                      >
                        {size}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400">اطلاعاتی ثبت نشده</span>
                  )}
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-blue-100">
                <span className="text-xs font-bold text-slate-700 block mb-2">تخمدان چپ (Left Ovary):</span>
                <div className="flex flex-wrap gap-2">
                  {selectedPatient.folliclesLeft && selectedPatient.folliclesLeft.length > 0 ? (
                    selectedPatient.folliclesLeft.map((size, idx) => (
                      <span
                        key={idx}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${
                          size >= 18
                            ? 'bg-amber-500 text-white shadow-xs'
                            : 'bg-blue-100 text-[#2C5E8A]'
                        }`}
                        title={size >= 18 ? 'فولیکول بالغ کاندید تخمک‌کشی' : 'فولیکول در حال رشد'}
                      >
                        {size}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400">اطلاعاتی ثبت نشده</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Patient Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((patient) => (
            <div
              key={patient.id}
              className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono bg-[#2C5E8A]/10 text-[#2C5E8A] px-2 py-0.5 rounded text-xs font-bold">
                    #{patient.fileNumber}
                  </span>
                  <span className="text-[10px] font-bold bg-[#8FA382]/15 text-[#8FA382] px-2 py-0.5 rounded-full">
                    {patient.treatmentType}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-[#1E293B] mb-1">
                  {formatPatientDisplayName(patient.fullName, privacyMode)}
                </h3>

                <div className="text-xs text-slate-500 space-y-1 mb-3">
                  <div>کد ملی: {patient.nationalId} | سن: {patient.age}</div>
                  <div>همسر: {patient.partnerName}</div>
                  <div className="text-[#2C5E8A] font-semibold">مرحله: {patient.cyclePhase}</div>
                </div>

                {patient.criticalAlert && (
                  <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 mb-3 flex items-start gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span>{patient.criticalAlert}</span>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => onSelectPatient(patient)}
                className="w-full py-2 bg-slate-50 hover:bg-[#2C5E8A] hover:text-white text-[#2C5E8A] rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>مشاهده پرونده کامل IVF</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
