'use client';

import React from 'react';
import { ShieldCheck, ShieldAlert, Lock, Terminal, CheckCircle2 } from 'lucide-react';
import { SecurityAuditLog } from '@/lib/dr-zamanian-data';

interface SecurityLogsViewProps {
  logs: SecurityAuditLog[];
}

export default function SecurityLogsView({ logs }: SecurityLogsViewProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-black text-[#1E293B] flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#2C5E8A]" />
            <span>لاگ‌های امنیتی و ردگیری دسترسی به پرونده بیماران (Audit Trail)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            ثبت خودکار تمامی مشاهده‌ها، تغییر پروتکل‌های دارویی و دسترسی‌ها بر اساس استاندارد محرمانگی پرونده‌های پزشکی
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-bold border border-emerald-200 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>رمزنگاری داده‌ها: AES-256 فعال</span>
          </span>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold">
                <th className="py-3 px-4">زمان ثبت</th>
                <th className="py-3 px-4">کاربر مجاز</th>
                <th className="py-3 px-4">نقش سیستمی</th>
                <th className="py-3 px-4">نوع اقدام امنیتی</th>
                <th className="py-3 px-4">پرونده بیمار</th>
                <th className="py-3 px-4">آدرس IP / ترمینال</th>
                <th className="py-3 px-4 text-center">وضعیت دسترسی</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-800 dir-ltr text-right">{log.timestamp}</td>
                  <td className="py-3.5 px-4 font-bold text-[#1E293B]">{log.actorName}</td>
                  <td className="py-3.5 px-4 text-slate-500">{log.actorRole}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-[#2C5E8A] font-medium border border-blue-100">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[#2C5E8A] font-bold">
                    {log.patientFileNumber ? `#${log.patientFileNumber}` : '—'}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px] dir-ltr text-right">
                    {log.ipAddress}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                      <CheckCircle2 className="w-3 h-3" />
                      {log.status}
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
