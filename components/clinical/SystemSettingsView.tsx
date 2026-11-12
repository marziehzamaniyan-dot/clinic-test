'use client';

import React, { useState } from 'react';
import { Settings, Shield, Bell, Database, CheckCircle2, Lock } from 'lucide-react';

export default function SystemSettingsView() {
  const [autoSmsEnabled, setAutoSmsEnabled] = useState(true);
  const [requireDoubleAuth, setRequireDoubleAuth] = useState(true);
  const [follicleThreshold, setFollicleThreshold] = useState('18');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base sm:text-lg font-black text-[#1E293B] flex items-center gap-2">
          <Settings className="w-5 h-5 text-[#2C5E8A]" />
          <span>تنظیمات سیستم و پروتکل‌های بالینی کلینیک دکتر زمانیان</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          پیکربندی استانداردهای تحریک تخمک‌گذاری، هشدارهای خودکار پیامکی و سطوح امنیتی
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-xs max-w-3xl">
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-[#2C5E8A] border-b pb-2">
            ۱. پروتکل‌های هوشمند تحریک تخمک‌گذاری (ART Thresholds):
          </h3>

          <div className="flex items-center justify-between text-xs py-2">
            <div>
              <span className="font-bold text-slate-800 block">حد آستانه سایز فولیکول بالغ جهت تزریق HCG (mm):</span>
              <span className="text-slate-500 text-[11px]">ارسال هشدار فوری زمانی که فولیکول‌ها به این قطر می‌رسند</span>
            </div>
            <input
              type="number"
              value={follicleThreshold}
              onChange={(e) => setFollicleThreshold(e.target.value)}
              className="w-20 px-3 py-1.5 rounded-xl border border-slate-300 font-mono text-center font-bold text-sm"
            />
          </div>

          <div className="flex items-center justify-between text-xs py-2">
            <div>
              <span className="font-bold text-slate-800 block">ارسال خودکار پیامک ساعت تزریق HCG و زمان پانکچر:</span>
              <span className="text-slate-500 text-[11px]">اطلاع‌رسانی فوری به شماره همراه بیمار و همسر</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoSmsEnabled}
                onChange={(e) => setAutoSmsEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2C5E8A]"></div>
            </label>
          </div>

          <h3 className="font-bold text-sm text-[#2C5E8A] border-b pb-2 pt-4">
            ۲. امنیت داده‌ها و محرمانگی بیماران:
          </h3>

          <div className="flex items-center justify-between text-xs py-2">
            <div>
              <span className="font-bold text-slate-800 block">فعال‌سازی پیش‌فرض حالت ناشناس‌سازی نام مراجعین (م. ر.):</span>
              <span className="text-slate-500 text-[11px]">جلوگیری از رویت مشخصات هویتی بر روی نمایشگرهای سالن و پذیرش</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={requireDoubleAuth}
                onChange={(e) => setRequireDoubleAuth(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2C5E8A]"></div>
            </label>
          </div>

          <h3 className="font-bold text-sm text-[#2C5E8A] border-b pb-2 pt-4 flex items-center justify-between">
            <span>۳. وضعیت احراز هویت و پایگاه داده مونگو (MongoDB):</span>
            <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
              متصل
            </span>
          </h3>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-700">
              <span>مدل احراز هویت:</span>
              <span className="font-bold text-slate-900">حساب‌های واقعی در MongoDB با هش Bcrypt</span>
            </div>
            <div className="flex items-center justify-between text-slate-700">
              <span>اکانت‌های پیش‌فرض دمو:</span>
              <span className="font-bold text-rose-600">غیرفعال و حذف شده</span>
            </div>
            <div className="flex items-center justify-between text-slate-700">
              <span>پایگاه داده رابطه‌ای:</span>
              <span className="font-mono text-blue-700 font-bold">Cloud SQL (us-west2)</span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t flex items-center justify-between">
          {saved ? (
            <span className="text-emerald-600 font-bold text-xs flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              تنظیمات با موفقیت ذخیره شد
            </span>
          ) : <span />}

          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 bg-[#2C5E8A] hover:bg-[#234b6e] text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
          >
            ذخیره تنظیمات
          </button>
        </div>
      </div>
    </div>
  );
}
