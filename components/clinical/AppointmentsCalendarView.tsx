'use client';

import React, { useState } from 'react';
import { CalendarDays, Clock, CheckCircle, Plus, Filter, User } from 'lucide-react';
import { AppointmentQueueItem } from '@/lib/dr-zamanian-data';
import { formatPatientDisplayName } from '@/lib/clinic-mgmt-logic';

interface AppointmentsCalendarViewProps {
  queue: AppointmentQueueItem[];
  privacyMode: boolean;
  onOpenNote: (item: AppointmentQueueItem) => void;
}

export default function AppointmentsCalendarView({
  queue,
  privacyMode,
  onOpenNote,
}: AppointmentsCalendarViewProps) {
  const [selectedDay, setSelectedDay] = useState('امروز (چهارشنبه)');

  const timeSlots = [
    '۰۸:۰۰ - ۰۹:۰۰ (پانکچر اتاق عمل ۱)',
    '۰۹:۰۰ - ۱۰:۰۰ (پایش فولیکول)',
    '۱۰:۰۰ - ۱۱:۰۰ (پایش و سونوگرافی واژینال)',
    '۱۱:۰۰ - ۱۲:۰۰ (انتقال جنین اتاق عمل ۲)',
    '۱۲:۰۰ - ۱۳:۰۰ (مشاوره‌های جدید ناباروری)',
    '۱۳:۰۰ - ۱۴:۰۰ (پایش هورمونی و تزریقات)',
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-black text-[#1E293B] flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-[#2C5E8A]" />
            <span>تقویم و نوبت‌دهی کلینیک ناباروری</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            زمان‌بندی عمل‌های اتاق عمل، پایش‌های اولتراسوند و ویزیت‌های فلوشیپ
          </p>
        </div>

        <div className="flex items-center gap-2">
          {['امروز (چهارشنبه)', 'فردا (پنج‌شنبه)', 'شنبه آینده'].map((day) => (
            <button
              key={day}
              type="button"
              onClick={() => setSelectedDay(day)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedDay === day
                  ? 'bg-[#2C5E8A] text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {timeSlots.map((slot, index) => {
          const slotItem = queue[index % queue.length];
          return (
            <div
              key={index}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-bold text-xs text-[#2C5E8A] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#C5A880]" />
                  {slot}
                </span>
                <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                  {slotItem.room}
                </span>
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">بیمار رزرو شده:</span>
                  <span className="font-bold text-slate-800">
                    {formatPatientDisplayName(slotItem.patientName, privacyMode)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">کد پرونده:</span>
                  <span className="font-mono font-bold text-[#2C5E8A]">#{slotItem.fileNumber}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">نوع نوبت:</span>
                  <span className="font-semibold text-emerald-700">{slotItem.visitType}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onOpenNote(slotItem)}
                className="w-full py-2 bg-[#F8F9FA] hover:bg-[#2C5E8A] hover:text-white text-[#2C5E8A] rounded-xl text-xs font-bold transition cursor-pointer"
              >
                ثبت شرح حال ویزیت
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
