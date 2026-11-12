'use client';

import React, { useState } from 'react';
import {
  X,
  Stethoscope,
  Activity,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Clock,
  Send,
  Save,
  Pill,
} from 'lucide-react';
import { AppointmentQueueItem, Patient } from '@/lib/dr-zamanian-data';
import { formatPatientDisplayName } from '@/lib/clinic-mgmt-logic';

interface ClinicalNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: AppointmentQueueItem | null;
  patient?: Patient | null;
  privacyMode: boolean;
  onSaveNote: (data: any) => void;
}

export default function ClinicalNoteModal({
  isOpen,
  onClose,
  item,
  patient,
  privacyMode,
  onSaveNote,
}: ClinicalNoteModalProps) {
  const [folliclesRight, setFolliclesRight] = useState('19, 18, 16, 14, 12');
  const [folliclesLeft, setFolliclesLeft] = useState('20, 17, 15, 13');
  const [endometrium, setEndometrium] = useState('10.2');
  const [decision, setDecision] = useState<'trigger_hcg' | 'continue_stim' | 'schedule_op' | 'frozen_transfer'>('trigger_hcg');
  const [hcgTime, setHcgTime] = useState('امشب ساعت ۲۱:۳۰');
  const [punctureTime, setPunctureTime] = useState('پس‌فردا ساعت ۰۹:۳۰ صبح');
  const [doctorNotes, setDoctorNotes] = useState('۲ فولیکول با قطر بیش از ۱۸mm در تخمدان چپ و راست مشاهده شد. ضخامت اندومتر سه‌خطی ایده‌آل (10.2mm). بیمار کاندید تزریق تریگر اوویترل است.');
  const [sendSms, setSendSms] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen || !item) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveNote({
      fileNumber: item.fileNumber,
      folliclesRight,
      folliclesLeft,
      endometrium,
      decision,
      hcgTime,
      punctureTime,
      doctorNotes,
      sendSms,
    });
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        role="dialog"
      >
        {/* Header */}
        <div className="bg-[#1E293B] text-white p-5 sm:p-6 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2C5E8A] text-[#C5A880] flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-[#C5A880]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg">
                  ثبت شرح حال و گزارش سونوگرافی
                </h3>
                <span className="font-mono bg-blue-500/20 text-blue-300 text-xs px-2 py-0.5 rounded-md font-bold">
                  #{item.fileNumber}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                بیمار: {formatPatientDisplayName(item.patientName, privacyMode)} | مراجعه: {item.visitType}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-5 text-xs text-right">
          {/* Patient Quick Context Card */}
          <div className="bg-[#F8F9FA] p-4 rounded-2xl border border-slate-200 flex flex-wrap justify-between items-center gap-3">
            <div>
              <span className="text-slate-500 block text-[11px]">پروتکل درمانی فعال:</span>
              <span className="font-bold text-[#2C5E8A] text-xs">
                {patient?.protocol || 'آنتاگونیست انعطاف‌پذیر (Gonal-F 225 IU + Cetrotide)'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">نوع درمان ناباروری:</span>
              <span className="font-bold text-emerald-700 text-xs">
                {patient?.treatmentType || 'میکرواینجکشن (ICSI)'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">مرحله چرخه:</span>
              <span className="font-bold text-[#8FA382] text-xs">
                {patient?.cyclePhase || 'پایش فولیکول روز ۱۱'}
              </span>
            </div>
          </div>

          {/* Ultrasound Follicles Grid */}
          <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-200/70 space-y-3">
            <h4 className="font-bold text-[#2C5E8A] flex items-center gap-1.5 text-xs">
              <Activity className="w-4 h-4" />
              <span>یافته‌های سونوگرافی واژینال امروز:</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  تخمدان راست (سایز فولیکول‌ها - mm)
                </label>
                <input
                  type="text"
                  value={folliclesRight}
                  onChange={(e) => setFolliclesRight(e.target.value)}
                  placeholder="مثال: 19, 18, 16, 14"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-mono dir-ltr text-right focus:ring-2 focus:ring-[#2C5E8A]/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  تخمدان چپ (سایز فولیکول‌ها - mm)
                </label>
                <input
                  type="text"
                  value={folliclesLeft}
                  onChange={(e) => setFolliclesLeft(e.target.value)}
                  placeholder="مثال: 20, 17, 15, 13"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-mono dir-ltr text-right focus:ring-2 focus:ring-[#2C5E8A]/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  ضخامت اندومتر رحم (mm)
                </label>
                <input
                  type="text"
                  value={endometrium}
                  onChange={(e) => setEndometrium(e.target.value)}
                  placeholder="مثال: 10.2"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-mono dir-ltr text-right focus:ring-2 focus:ring-[#2C5E8A]/20 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Clinical Decision */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">
              تصمیم بالینی و دستور گام بعدی:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <label
                className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition ${
                  decision === 'trigger_hcg'
                    ? 'border-amber-500 bg-amber-50 text-amber-950 font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="decision"
                  checked={decision === 'trigger_hcg'}
                  onChange={() => setDecision('trigger_hcg')}
                  className="accent-amber-600"
                />
                <span>تزریق محرک نهایی HCG / اوویترل و تعیین زمان پانکچر</span>
              </label>

              <label
                className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition ${
                  decision === 'continue_stim'
                    ? 'border-blue-500 bg-blue-50 text-[#2C5E8A] font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="decision"
                  checked={decision === 'continue_stim'}
                  onChange={() => setDecision('continue_stim')}
                  className="accent-[#2C5E8A]"
                />
                <span>تداوم تحریک تخمک‌گذاری و سونوگرافی مجدد ۲ روز بعد</span>
              </label>
            </div>
          </div>

          {/* If HCG Trigger selected, show precise time inputs */}
          {decision === 'trigger_hcg' && (
            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200/80 space-y-3">
              <div className="flex items-center justify-between text-amber-900 font-bold text-xs">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-700" />
                  <span>زمان‌بندی دقیق تزریق و اتاق عمل:</span>
                </div>
                <span className="text-[10px] bg-amber-200/80 px-2 py-0.5 rounded text-amber-950 font-bold">
                  محل جراحی: بخش ناباروری کوثر بیمارستان امام خمینی ساری
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-amber-900 mb-1">
                    ساعت تزریق دقیق آمپول HCG / Ovitrelle:
                  </label>
                  <input
                    type="text"
                    value={hcgTime}
                    onChange={(e) => setHcgTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white font-bold text-[#1E293B] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-amber-900 mb-1">
                    ساعت حضور در اتاق عمل کوثر جهت پانکچر (۳۶ ساعت بعد):
                  </label>
                  <input
                    type="text"
                    value={punctureTime}
                    onChange={(e) => setPunctureTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white font-bold text-[#1E293B] outline-none"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-[11px] text-amber-950 font-bold cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={sendSms}
                  onChange={(e) => setSendSms(e.target.checked)}
                  className="w-4 h-4 accent-amber-600 rounded"
                />
                <span>ارسال پیامک دستور دارویی و ساعت دقیق تزریق به تلفن بیمار</span>
              </label>
            </div>
          )}

          {/* Doctor Detailed Note */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              شرح حال و دستورات تکمیلی پزشک معالج:
            </label>
            <textarea
              rows={3}
              value={doctorNotes}
              onChange={(e) => setDoctorNotes(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 focus:border-[#2C5E8A] outline-none text-xs leading-relaxed"
            />
          </div>

          {/* Submit Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-bold cursor-pointer"
            >
              انصراف
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 bg-[#2C5E8A] hover:bg-[#234b6e] text-white rounded-xl font-bold flex items-center gap-2 shadow-sm transition active:scale-95 cursor-pointer"
            >
              {isSaved ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>ثبت شد</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 text-[#C5A880]" />
                  <span>ثبت در پرونده الکترونیک و اعمال اقدام</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
