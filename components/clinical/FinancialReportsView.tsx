'use client';

import React from 'react';
import { CircleDollarSign, TrendingUp, CreditCard, Receipt, FileSpreadsheet } from 'lucide-react';

export default function FinancialReportsView() {
  const financialRows = [
    { title: 'پکیج کامل میکرواینجکشن (ICSI)', count: '۵ مورد', fee: '۱۸۵,۰۰۰,۰۰۰ تومان', status: 'تسویه شده' },
    { title: 'عمل پانکچر و بیهوشی (OPU)', count: '۸ مورد', fee: '۶۴,۰۰۰,۰۰۰ تومان', status: 'تسویه شده' },
    { title: 'انتقال جنین فریز شده (FET)', count: '۳ مورد', fee: '۳۶,۰۰۰,۰۰۰ تومان', status: 'در انتظار بیمه تکمیلی' },
    { title: 'فریز سالیانه جنین در تانک نیتروژن', count: '۱۲ استرا', fee: '۲۴,۰۰۰,۰۰۰ تومان', status: 'تسویه شده' },
    { title: 'سونوگرافی‌های واژینال پایش فولیکول', count: '۲۴ مورد', fee: '۱۴,۴۰۰,۰۰۰ تومان', status: 'تسویه شده' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-black text-[#1E293B] flex items-center gap-2">
            <CircleDollarSign className="w-5 h-5 text-[#2C5E8A]" />
            <span>گزارش‌های مالی و بیمه‌های طرف قرارداد ناباروری</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            محاسبه پکیج‌های ART، سهم بیمه سلامت/تأمین اجتماعی و تسهیلات دولتی درمان ناباروری
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert('خروجی اکسل و پی‌دی‌اف اسناد مالی با موفقیت صادر گردید.')}
          className="px-4 py-2 bg-[#2C5E8A] hover:bg-[#234b6e] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
        >
          <FileSpreadsheet className="w-4 h-4 text-[#C5A880]" />
          <span>خروجی گزارش حسابداری (Excel)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 block mb-1">گردش مالی امروز کلینیک:</span>
          <div className="text-2xl font-black text-[#2C5E8A]">۳۲۳,۴۰۰,۰۰۰ تومان</div>
          <span className="text-[11px] text-emerald-600 font-bold mt-1 block">۸۸٪ تسویه نقدی و کارتخوان</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 block mb-1">مطالبات ثبت‌شده بیمه‌های تکمیلی:</span>
          <div className="text-2xl font-black text-amber-700">۵۸,۰۰۰,۰۰۰ تومان</div>
          <span className="text-[11px] text-slate-500 mt-1 block">بیمه ایران، دانا، آسیا و SOS</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 block mb-1">سهم فرانشیز طرح جوانی جمعیت (۹۰٪ دولتی):</span>
          <div className="text-2xl font-black text-emerald-700">۱۴۲,۰۰۰,۰۰۰ تومان</div>
          <span className="text-[11px] text-slate-500 mt-1 block">تأییدیه الکترونیک سامانه ره‌نگار</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
        <h3 className="font-bold text-sm text-[#1E293B] mb-4">ریز تراکنش‌ها و پکیج‌های درمانی امروز:</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold">
                <th className="py-3 px-4">عنوان خدمت بالینی</th>
                <th className="py-3 px-4">تعداد مراجعین</th>
                <th className="py-3 px-4">مبلغ کل (تومان)</th>
                <th className="py-3 px-4 text-center">وضعیت تسویه</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {financialRows.map((r, i) => (
                <tr key={i} className="hover:bg-slate-50/60 transition">
                  <td className="py-3.5 px-4 font-bold text-slate-800">{r.title}</td>
                  <td className="py-3.5 px-4 font-mono">{r.count}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-[#2C5E8A]">{r.fee}</td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800">
                      {r.status}
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
