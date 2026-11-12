'use client';

import React from 'react';
import Image from 'next/image';
import {
  Calendar,
  Clock,
  Phone,
  Info,
  Building,
  CheckCircle2,
  ExternalLink,
  Send,
  MapPin,
  ShieldCheck,
  Stethoscope,
} from 'lucide-react';
import { DOCTORS, CLINIC_INFO, Doctor } from '@/lib/clinic-data';

interface DoctorScheduleProps {
  selectedDepartmentId?: string;
  onSelectDepartmentId?: (id: string) => void;
  onOpenAppointmentModal: (doctor: Doctor) => void;
}

export default function DoctorSchedule({ onOpenAppointmentModal }: DoctorScheduleProps) {
  const doctor = DOCTORS[0];

  const venues = [
    {
      title: 'ویزیت و سونوگرافی تخصصی در مطب',
      badge: 'مطب اصلی ساری',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      days: 'شنبه، یکشنبه و سه‌شنبه (عصرها)',
      hours: '۱۴:۰۰ الی ۲۲:۰۰ (۲ تا ۱۰ شب)',
      location: 'مازندران، ساری، بلوار امیر مازندرانی، بیمارستان امیر مازندرانی، طبقه سوم',
      desc: 'مشاوره اولیه زوجین، سونوگرافی واژینال و داپلر پایش رشد فولیکول، بررسی علل سقط مکرر و تنظیم پروتکل‌های دارویی.',
      note: 'توجه: ویزیت در مطب همه روزه نیست و منحصراً در روزهای شنبه، یکشنبه و سه‌شنبه انجام می‌پذیرد.',
    },
    {
      title: 'اتاق عمل بیمارستان امیر مازندرانی (بخش خصوصی)',
      badge: 'جراحی زنان خصوصی',
      badgeColor: 'bg-sky-100 text-sky-800 border-sky-200',
      days: 'دوشنبه‌ها و چهارشنبه‌ها (عصر)',
      hours: '۱۴:۰۰ الی ۱۸:۰۰ عصر',
      location: 'ساری، بلوار امیر مازندرانی، اتاق عمل جراحی‌های محدود زنان',
      desc: 'انواع جراحی‌های کم‌تهاجمی لاپاراسکوپی، هیستروسکوپی، خارج کردن فیبروم (میومکتومی)، کیست‌های تخمدان و ترمیم‌های ژنیکولوژی.',
      note: 'هماهنگی و تشکیل پرونده جراحی از قبل در مطب یا بیمارستان انجام می‌شود.',
    },
    {
      title: 'اتاق عمل بیمارستان امام خمینی ساری (بخش دولتی)',
      badge: 'جراحی‌های دولتی غیر IVF',
      badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      days: 'چهارشنبه صبح‌ها',
      hours: '۰۸:۰۰ الی ۱۲:۰۰ ظهر',
      location: 'ساری، خیابان رازی، مجتمع آموزشی درمانی بیمارستان امام خمینی',
      desc: 'اعمال جراحی زنان و مراقبت‌های بستری بیماران با تعرفه دولتی دانشگاهی.',
      note: 'پذیرش از طریق درمانگاه تخصصی و ارجاع قبلی.',
    },
    {
      title: 'بخش جامع ناباروری دولتی کوثر بیمارستان امام خمینی',
      badge: 'اعمال جراحی IVF دولتی',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
      days: 'طبق تقویم سیکل‌های فعال IVF',
      hours: 'شیفت صبح (هماهنگی دقیق با آزمایشگاه جنین‌شناسی)',
      location: 'ساری، خیابان رازی، بیمارستان امام خمینی، مرکز درمان ناباروری کوثر',
      desc: 'کلیه کارهای جراحی مربوط به IVF شامل عمل پانکچر (تخمک‌کشی)، انتقال جنین‌های تازه و فریز (ET/FET) با تعرفه حمایتی دولتی.',
      note: 'پوشش ۹۰٪ بیمه‌های پایه و بسته‌های حمایتی وزارت بهداشت.',
    },
  ];

  return (
    <section id="doctors" className="py-20 bg-[#F8F9FA] scroll-mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold text-[#8FA382] uppercase tracking-wider bg-[#F0F4EF] px-3.5 py-1.5 rounded-full border border-[#8FA382]/20 inline-block">
              تقویم بالینی و کاری
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2C5E8A] mt-2.5 tracking-tight">
              برنامه هفتگی حضور دکتر مرضیه زمانیان در مراکز درمانی
            </h2>
            <p className="text-[#64748B] text-sm mt-1 leading-relaxed">
              تفکیک دقیق شیفت‌های ویزیت مطب، اعمال جراحی لاپاراسکوپی و جراحی‌های IVF در ساری
            </p>
          </div>

          <div className="inline-flex items-center gap-2 bg-[#F6F2EB] border border-[#C5A880]/40 px-4 py-2.5 rounded-xl text-xs font-medium text-amber-950 shadow-2xs">
            <Info className="w-4 h-4 text-[#C5A880] shrink-0" />
            <span>ویزیت مطب فقط با نوبت‌دهی قبلی تلفنی یا تلگرامی انجام می‌شود</span>
          </div>
        </div>

        {/* Doctor Spotlight Card + Venues Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Doctor Bio Card (4 Cols) */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-md space-y-6">
            <div className="relative w-full aspect-4/3 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner">
              <Image
                src={doctor.imageUrl}
                alt={doctor.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 400px"
                className="object-cover object-top"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-3 right-3 left-3 text-white">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md">
                  نظام پزشکی: {doctor.councilId}
                </span>
                <h3 className="font-extrabold text-lg mt-1">{doctor.name}</h3>
              </div>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-[#64748B]">
              <div className="flex items-center gap-2 text-slate-800 font-bold">
                <Stethoscope className="w-4 h-4 text-[#2C5E8A]" />
                <span>{doctor.specialty}</span>
              </div>
              <p>{doctor.bio}</p>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2.5">
              <button
                type="button"
                onClick={() => onOpenAppointmentModal(doctor)}
                className="w-full py-3 bg-[#2C5E8A] hover:bg-[#234b6e] text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Phone className="w-4 h-4" />
                هماهنگی نوبت تلفنی (پذیرش مطب)
              </button>

              <a
                href="https://t.me/Ebiiiiii_bot"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-800 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4 text-sky-600" />
                رزرو نوبت در ربات تلگرام (@Ebiiiiii_bot)
              </a>
            </div>
          </div>

          {/* Venues & Shifts (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            {venues.map((venue, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:border-[#2C5E8A]/40 transition group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#2C5E8A]" />
                    <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                      {venue.title}
                    </h4>
                  </div>
                  <span
                    className={`text-[11px] font-bold px-3 py-1 rounded-full border self-start sm:self-auto ${venue.badgeColor}`}
                  >
                    {venue.badge}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-3 text-xs">
                  <div className="flex items-center gap-2 text-slate-700 font-bold bg-slate-50 p-2.5 rounded-xl">
                    <Calendar className="w-4 h-4 text-[#2C5E8A] shrink-0" />
                    <span>{venue.days}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 font-bold bg-slate-50 p-2.5 rounded-xl">
                    <Clock className="w-4 h-4 text-[#C5A880] shrink-0" />
                    <span>{venue.hours}</span>
                  </div>
                </div>

                <p className="text-xs text-[#64748B] leading-relaxed mb-2">
                  {venue.desc}
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 border-t border-slate-100/80 text-[11px]">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    {venue.location}
                  </span>
                  <span className="font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200">
                    {venue.note}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
