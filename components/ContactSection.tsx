'use client';

import React, { useState } from 'react';
import {
  MapPin,
  PhoneCall,
  Printer,
  AlertCircle,
  Navigation,
  Send,
  CheckCircle2,
  Clock,
  ExternalLink,
  Building,
  Sparkles,
  Stethoscope,
  Info,
  Share2,
  Copy,
  MessageCircle,
} from 'lucide-react';
import { CLINIC_INFO } from '@/lib/clinic-data';
import { generateTrackingCode } from '@/lib/clinic-logic';

export default function ContactSection() {
  const [linkCopied, setLinkCopied] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    subject: 'مشاوره اولیه ناباروری و IVF',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [trackingCode, setTrackingCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = generateTrackingCode();
    setTrackingCode(code);
    setSubmitted(true);
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      phone: '',
      subject: 'مشاوره اولیه ناباروری و IVF',
      message: '',
    });
    setSubmitted(false);
    setTrackingCode('');
  };

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-[#8FA382] uppercase tracking-wider bg-[#F0F4EF] px-3.5 py-1.5 rounded-full border border-[#8FA382]/20 inline-block">
            اطلاعات نشانی، تماس و مراکز درمانی
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2C5E8A] mt-2.5 tracking-tight">
            مطب و مراکز جراحی دکتر مرضیه زمانیان
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1.5 leading-relaxed">
            جهت شفافیت مراجعین گرامی، تفکیک محل ویزیت‌های سرپایی و بیمارستان جراحی‌های IVF به شرح زیر است:
          </p>
        </div>

        {/* Dual Clinic & Surgery Location Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* CARD 1: Outpatient Office (Hospital Amir Mazandarani Floor 3) */}
          <div className="bg-[#F8F9FA] p-6 rounded-3xl border-2 border-[#2C5E8A]/20 hover:border-[#2C5E8A]/40 transition shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-black bg-[#2C5E8A]/10 text-[#2C5E8A] px-3 py-1 rounded-full">
                  <Stethoscope className="w-3.5 h-3.5" />
                  محل ویزیت‌ها و سونوگرافی سرپایی
                </span>
                <span className="text-[11px] font-mono font-bold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                  کد پستی: {CLINIC_INFO.postalCode}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-black text-slate-800 mb-2">
                مطب فوق‌تخصصی دکتر زمانیان (ساری)
              </h3>

              <div className="space-y-2 text-xs text-slate-600 mb-4">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#2C5E8A] shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong>نشانی:</strong> {CLINIC_INFO.address}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#8FA382] shrink-0" />
                  <span><strong>ساعات حضور:</strong> {CLINIC_INFO.hoursWeekday}</span>
                </div>
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-[#2C5E8A] shrink-0" />
                  <span><strong>تلفن‌های تماس:</strong></span>
                  <a href={`tel:${CLINIC_INFO.phone1Raw}`} className="font-bold text-[#2C5E8A] font-mono dir-ltr hover:underline">
                    {CLINIC_INFO.phone1}
                  </a>
                  <span className="text-slate-300">|</span>
                  <a href={`tel:${CLINIC_INFO.phone2Raw}`} className="font-bold text-[#2C5E8A] font-mono dir-ltr hover:underline">
                    {CLINIC_INFO.phone2}
                  </a>
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 text-[11px] text-slate-500 mb-4">
                <strong>خدمات مطب:</strong> ویزیت زنان، سونوگرافی واژینال رشد فولیکول، پایش ضخامت آندومتر، تست‌های پیش از بارداری و تنظیم پروتکل‌های دارویی.
              </div>
            </div>

            {/* Routing for Office */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold text-slate-500">مسیریابی مطب:</span>
              <div className="flex gap-2">
                <a
                  href={`https://maps.google.com/?q=${CLINIC_INFO.coordinates.lat},${CLINIC_INFO.coordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 bg-white rounded-lg border border-slate-200 hover:border-[#2C5E8A] text-[11px] font-bold text-slate-700 hover:text-[#2C5E8A] transition flex items-center gap-1"
                >
                  <span>گوگل‌مپ</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
                <a
                  href={`https://neshan.org/maps/@${CLINIC_INFO.coordinates.lat},${CLINIC_INFO.coordinates.lng},16z`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 bg-white rounded-lg border border-slate-200 hover:border-[#2C5E8A] text-[11px] font-bold text-slate-700 hover:text-[#2C5E8A] transition flex items-center gap-1"
                >
                  <span>نشان</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
                <a
                  href={`https://balad.ir/location?latitude=${CLINIC_INFO.coordinates.lat}&longitude=${CLINIC_INFO.coordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 bg-white rounded-lg border border-slate-200 hover:border-[#2C5E8A] text-[11px] font-bold text-slate-700 hover:text-[#2C5E8A] transition flex items-center gap-1"
                >
                  <span>بلد</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </div>
            </div>
          </div>

          {/* CARD 2: IVF Surgery Hospital (Kowsar Infertility Center at Imam Khomeini Hospital) */}
          <div className="bg-gradient-to-br from-amber-50/70 via-white to-amber-50/30 p-6 rounded-3xl border-2 border-amber-300 hover:border-amber-400 transition shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-black bg-amber-500 text-white px-3 py-1 rounded-full shadow-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                  مرکز اعمال جراحی و اتاق عمل IVF
                </span>
                <span className="text-[11px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md">
                  مرکز دولتی طرف قرارداد بیمه
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-black text-slate-800 mb-2">
                بخش ناباروری دولتی کوثر بیمارستان امام خمینی ساری
              </h3>

              <div className="space-y-2 text-xs text-slate-700 mb-4">
                <div className="p-3 bg-amber-100/70 rounded-xl border border-amber-200/90 text-amber-950 font-bold leading-relaxed">
                  {CLINIC_INFO.ivfSurgeryCenter.notice}
                </div>
                <div className="flex items-start gap-2 pt-1">
                  <Building className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong>نشانی مرکز جراحی:</strong> {CLINIC_INFO.ivfSurgeryCenter.address}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-amber-200 text-[11px] text-slate-600 mb-4">
                <strong>اعمال جراحی این مرکز:</strong> عمل تخمک‌کشی (پانکچر)، انتقال جنین (ET)، تزریق اسپرم به داخل تخمک (ICSI)، فریز تخمک، جنین و اسپرم، بیوپسی ژنتیکی PGT.
              </div>
            </div>

            {/* Routing for Kowsar Hospital */}
            <div className="pt-3 border-t border-amber-200/80 flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold text-slate-600">مسیریابی بیمارستان امام خمینی:</span>
              <div className="flex gap-2">
                <a
                  href={`https://maps.google.com/?q=${CLINIC_INFO.ivfSurgeryCenter.coordinates.lat},${CLINIC_INFO.ivfSurgeryCenter.coordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 bg-white rounded-lg border border-amber-200 hover:border-amber-500 text-[11px] font-bold text-slate-700 hover:text-amber-800 transition flex items-center gap-1"
                >
                  <span>گوگل‌مپ</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
                <a
                  href={`https://neshan.org/maps/@${CLINIC_INFO.ivfSurgeryCenter.coordinates.lat},${CLINIC_INFO.ivfSurgeryCenter.coordinates.lng},16z`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 bg-white rounded-lg border border-amber-200 hover:border-amber-500 text-[11px] font-bold text-slate-700 hover:text-amber-800 transition flex items-center gap-1"
                >
                  <span>نشان</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
                <a
                  href={`https://balad.ir/location?latitude=${CLINIC_INFO.ivfSurgeryCenter.coordinates.lat}&longitude=${CLINIC_INFO.ivfSurgeryCenter.coordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 bg-white rounded-lg border border-amber-200 hover:border-amber-500 text-[11px] font-bold text-slate-700 hover:text-amber-800 transition flex items-center gap-1"
                >
                  <span>بلد</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* IVR CALL CENTER & PHONE DIRECTORY CARD */}
        <div className="mb-10 bg-gradient-to-r from-slate-900 via-slate-800 to-[#1e3a57] rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-700/60 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#2C5E8A]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
                <PhoneCall className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>سامانه هوشمند تلفن گویا (کال سنتر) مطب دکتر زمانیان</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                پاسخگویی، نوبت‌دهی و مشاوره تخصصی
              </h3>
              <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                جهت سهولت مراجعین محترم، سیستم تلفن گویای مطب به صورت هوشمند تماس شما را مستقیماً به مسئول مربوطه متصل می‌نماید:
              </p>
            </div>

            {/* Big Call Center Number */}
            <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-700/80 text-center space-y-1.5 shrink-0 self-start lg:self-auto">
              <span className="text-[11px] text-amber-300 font-bold block">
                شماره سراسری تلفن گویا (کال سنتر):
              </span>
              <a
                href={`tel:${CLINIC_INFO.callCenterRaw}`}
                className="text-2xl sm:text-3xl font-black font-mono text-white hover:text-amber-300 transition dir-ltr block"
              >
                {CLINIC_INFO.callCenter}
              </a>
              <span className="text-[10px] text-slate-400 block">
                لمس شماره جهت برقراری تماس سریع
              </span>
            </div>
          </div>

          {/* Interactive Routing Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 mt-6 pt-6 border-t border-slate-700/80">
            {/* Action 1: Secretary Asadi */}
            <div className="bg-white/10 hover:bg-white/15 p-4 rounded-2xl border border-white/10 transition backdrop-blur-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded bg-amber-500/30 text-amber-300 font-bold text-[10px]">
                    کلید ۱ در تلفن گویا
                  </span>
                  <span className="text-xs text-slate-300 font-bold">هماهنگی ویزیت</span>
                </div>
                <h4 className="text-sm font-black text-white mb-1">
                  منشی مطب: سرکار خانم اسدی
                </h4>
                <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
                  دریافت نوبت ویزیت، استعلام روزهای حضور پزشک در بیمارستان امیر مازندرانی و لغو یا جابجایی وقت.
                </p>
              </div>
              <a
                href={`tel:${CLINIC_INFO.callCenterRaw}`}
                className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>تماس با منشی (خانم اسدی)</span>
              </a>
            </div>

            {/* Action 2: Counselor Jafari */}
            <div className="bg-white/10 hover:bg-white/15 p-4 rounded-2xl border border-white/10 transition backdrop-blur-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/30 text-emerald-300 font-bold text-[10px]">
                    کلید ۲ در تلفن گویا
                  </span>
                  <span className="text-xs text-slate-300 font-bold">مشاوره تخصصی</span>
                </div>
                <h4 className="text-sm font-black text-white mb-1">
                  مشاور درمانی: سرکار خانم جعفری
                </h4>
                <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
                  مشاوره فرآیند درمان ناباروری، راهنمایی آزمایش‌های اولیه AMH، هماهنگی داروها و اعمال کوثر.
                </p>
              </div>
              <a
                href={`tel:${CLINIC_INFO.callCenterRaw}`}
                className="w-full py-2 bg-[#8FA382] hover:bg-[#7d9171] text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>تماس با مشاور (خانم جعفری)</span>
              </a>
            </div>

            {/* Direct Lines */}
            <div className="bg-white/10 hover:bg-white/15 p-4 rounded-2xl border border-white/10 transition backdrop-blur-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded bg-blue-500/30 text-blue-300 font-bold text-[10px]">
                    خطوط مستقیم مطب
                  </span>
                  <span className="text-xs text-slate-300 font-bold">امیر مازندرانی</span>
                </div>
                <h4 className="text-sm font-black text-white mb-1">
                  شماره‌های مستقیم مطب ساری
                </h4>
                <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
                  در صورت تمایل می‌توانید مستقیماً با تلفن‌های ثابت مطب در طبقه سوم تماس حاصل فرمایید.
                </p>
              </div>
              <div className="space-y-1.5">
                <a
                  href={`tel:${CLINIC_INFO.phone1Raw}`}
                  className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-mono font-bold text-xs rounded-xl transition flex items-center justify-between px-3 border border-slate-600"
                >
                  <span className="text-[10px] font-sans text-slate-300">خط ۱ مطب:</span>
                  <span className="dir-ltr">{CLINIC_INFO.phone1}</span>
                </a>
                <a
                  href={`tel:${CLINIC_INFO.phone2Raw}`}
                  className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-mono font-bold text-xs rounded-xl transition flex items-center justify-between px-3 border border-slate-600"
                >
                  <span className="text-[10px] font-sans text-slate-300">خط ۲ مطب:</span>
                  <span className="dir-ltr">{CLINIC_INFO.phone2}</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* SMART MESSENGER & TELEPHONCHI AUTO-SMS DISPATCH CARD */}
        <div className="mb-10 bg-[#F0F4EF] rounded-3xl p-6 sm:p-8 border border-[#8FA382]/30 text-right shadow-xs">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8FA382]/20 text-[#8FA382] text-xs font-bold border border-[#8FA382]/30">
                <Share2 className="w-3.5 h-3.5" />
                <span>اتصال هوشمند به تلفنچی (۰۱۱۹۱۰۱۲۱۲۶) و شبکه‌های اجتماعی</span>
              </div>
              <h3 className="text-xl font-black text-[#2C5E8A]">
                دریافت فوری لینک مطب و نوبت‌دهی آنلاین روی گوشی شما
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                با تماس با شماره گویا <strong>۰۱۱۹۱۰۱۲۱۲۶ (خط ابری تلفنچی)</strong>، لینک این وب‌سایت و نوبت‌دهی دکتردکتر به صورت خودکار پیامک می‌شود. همچنین می‌توانید از طریق دکمه‌های زیر، لینک اطلاعات مطب را مستقیماً در <strong>واتس‌اپ، بله یا تلگرام</strong> ذخیره یا ارسال نمایید:
              </p>
            </div>

            {/* Quick Copy Link Button */}
            <button
              type="button"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  navigator.clipboard.writeText(
                    `مطب فوق‌تخصصی زنان و درمان ناباروری دکتر مرضیه زمانیان (نظام پزشکی ۸۹۷۰۲)
نوبت‌دهی آنلاین در سایت دکتردکتر: https://drdr.ir/dr/89702
تلفن گویا و کال‌سنتر: ۰۱۱۹۱۰۱۲۱۲۶
تلفن‌های مستقیم مطب: ۰۱۱۳۳۲۴۲۱۲۶ و ۰۱۱۳۳۲۵۵۲۰۵
آدرس: ساری، بیمارستان امیر مازندرانی، ط ۳
مرکز جراحی‌های IVF: بخش ناباروری کوثر بیمارستان امام خمینی ساری
وب‌سایت: ${window.location.origin}`
                  );
                  setLinkCopied(true);
                  setTimeout(() => setLinkCopied(false), 2500);
                }
              }}
              className="px-5 py-3 rounded-2xl bg-white border border-[#8FA382]/40 hover:bg-[#8FA382] hover:text-white text-[#2C5E8A] text-xs font-bold transition flex items-center gap-2 shadow-2xs cursor-pointer shrink-0"
            >
              <Copy className="w-4 h-4" />
              <span>{linkCopied ? '✓ مشخصات و لینک کپی شد!' : 'کپی مشخصات کامل مطب و لینک'}</span>
            </button>
          </div>

          {/* Social Messenger Buttons Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-[#8FA382]/20">
            {/* WhatsApp */}
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                'مطب فوق‌تخصصی زنان و نازایی دکتر مرضیه زمانیان ساری\nنوبت‌دهی اینترنتی دکتردکتر: https://drdr.ir/dr/89702\nتلفن گویا: 01191012126\nتلفن مستقیم: 01133242126\nساری، بیمارستان امیر مازندرانی، ط ۳\nاعمال جراحی IVF در بیمارستان دولتی کوثر ساری'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white hover:bg-emerald-50 rounded-2xl border border-slate-200 hover:border-emerald-500 transition flex items-center gap-2.5 text-slate-800 shadow-2xs"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-slate-900 block">واتس‌اپ (WhatsApp)</span>
                <span className="text-[10px] text-emerald-600 block">ارسال مستقیم لینک</span>
              </div>
            </a>

            {/* Bale (بله) */}
            <a
              href={`https://ble.ir/share/url?url=${encodeURIComponent('https://drdr.ir/dr/89702')}&text=${encodeURIComponent(
                'مطب دکتر مرضیه زمانیان ساری (نظام پزشکی ۸۹۷۰۲) - فلوشیپ فوق‌تخصصی زنان و IVF\nتلفن گویا: 01191012126\nمحل جراحی‌ها: بیمارستان کوثر ساری'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white hover:bg-teal-50 rounded-2xl border border-slate-200 hover:border-teal-500 transition flex items-center gap-2.5 text-slate-800 shadow-2xs"
            >
              <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 font-bold text-xs">
                بله
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-slate-900 block">پیام‌رسان بله (Bale)</span>
                <span className="text-[10px] text-teal-600 block">اشتراک‌گذاری ایرانی</span>
              </div>
            </a>

            {/* Telegram */}
            <a
              href={`https://t.me/share/url?url=${encodeURIComponent('https://drdr.ir/dr/89702')}&text=${encodeURIComponent(
                'مطب دکتر مرضیه زمانیان ساری - فلوشیپ زنان و IVF (نظام: ۸۹۷۰۲)\nتلفن گویا: 01191012126\nخط مستقیم: 01133242126'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white hover:bg-sky-50 rounded-2xl border border-slate-200 hover:border-sky-500 transition flex items-center gap-2.5 text-slate-800 shadow-2xs"
            >
              <div className="w-8 h-8 rounded-xl bg-sky-500 text-white flex items-center justify-center shrink-0">
                <Send className="w-4 h-4" />
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-slate-900 block">تلگرام (Telegram)</span>
                <span className="text-[10px] text-sky-600 block">ارسال به دوستان</span>
              </div>
            </a>

            {/* Direct SMS to Phone */}
            <a
              href={`sms:?body=${encodeURIComponent(
                'مطب دکتر مرضیه زمانیان ساری\nنوبت‌دهی آنلاین: https://drdr.ir/dr/89702\nتلفن گویا: 01191012126\nمطب: 01133242126\nساری، بیمارستان امیر مازندرانی، ط ۳'
              )}`}
              className="p-3 bg-white hover:bg-amber-50 rounded-2xl border border-slate-200 hover:border-amber-500 transition flex items-center gap-2.5 text-slate-800 shadow-2xs"
            >
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 font-bold">
                <PhoneCall className="w-4 h-4" />
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-slate-900 block">پیامک گوشی (SMS)</span>
                <span className="text-[10px] text-amber-700 block">ذخیره روی سیم‌کارت</span>
              </div>
            </a>
          </div>
        </div>

        {/* Feedback / Inquiry Form */}
        <div className="bg-[#F8F9FA] p-6 sm:p-8 rounded-3xl border border-slate-200">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-base sm:text-lg font-bold text-[#2C5E8A] mb-1 text-center">
              فرم استعلام پیام و سوالات مشاوره‌ای
            </h3>
            <p className="text-xs text-[#64748B] mb-6 text-center">
              پیام‌های ارسالی از این بخش توسط دستیاران و مسئول پذیرش مطب دکتر زمانیان بررسی و پاسخ داده می‌شوند.
            </p>

            {submitted ? (
              <div className="bg-white p-6 rounded-2xl border border-emerald-200 text-center space-y-4 animate-in zoom-in-95 duration-200">
                <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-bold text-[#2C5E8A] text-base mb-1">
                    پیام شما با موفقیت ثبت گردید
                  </h4>
                  <p className="text-xs text-[#64748B] leading-relaxed max-w-md mx-auto">
                    همکاران ما در مطب دکتر زمانیان با شما تماس خواهند گرفت یا از طریق پیامک پاسخ سوال درمانی شما را ارسال می‌نمایند.
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl inline-block border border-slate-200">
                  <span className="text-[11px] text-slate-500 block">کد رهگیری پیام شما:</span>
                  <span className="text-sm font-black text-[#2C5E8A] dir-ltr tracking-wider">
                    {trackingCode}
                  </span>
                </div>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-xs text-[#8FA382] hover:text-[#2C5E8A] font-bold underline cursor-pointer"
                  >
                    ارسال پیام جدید
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      نام و نام‌خانوادگی بیمار <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="مثال: مریم رضایی"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#2C5E8A]/20 focus:border-[#2C5E8A] outline-none bg-white transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      شماره تماس همراه <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="۰۹۱۲XXXXXXX"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#2C5E8A]/20 focus:border-[#2C5E8A] outline-none bg-white dir-ltr text-right transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    موضوع استعلام یا سوال
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#2C5E8A]/20 focus:border-[#2C5E8A] outline-none bg-white text-slate-700 transition"
                  >
                    <option value="مشاوره اولیه ناباروری و IVF">مشاوره اولیه ناباروری و IVF</option>
                    <option value="هماهنگی عمل پانکچر در بیمارستان کوثر">هماهنگی عمل پانکچر در بیمارستان کوثر</option>
                    <option value="پایش سونوگرافی فولیکول در مطب">پایش سونوگرافی فولیکول در مطب</option>
                    <option value="پوشش بیمه‌ای جراحی‌های ناباروری">پوشش بیمه‌ای جراحی‌های ناباروری</option>
                    <option value="پیگیری آزمایش‌های ژنتیک و جنین">پیگیری آزمایش‌های ژنتیک و جنین</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    متن پیام یا شرح حال بیمار <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="شرح کوتاه از سابقه ناباروری، داروها یا سوال مورد نظر خود را بنویسید..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#2C5E8A]/20 focus:border-[#2C5E8A] outline-none bg-white transition leading-relaxed"
                  />
                </div>

                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="px-8 py-3 bg-[#2C5E8A] hover:bg-[#234b6e] text-white rounded-xl text-xs font-bold transition shadow-sm active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>ارسال پیام به مطب دکتر زمانیان</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
