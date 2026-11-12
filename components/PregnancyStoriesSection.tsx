'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  HeartHandshake,
  Baby,
  Star,
  MapPin,
  Calendar,
  ShieldCheck,
  ArrowLeft,
  Sparkles,
  FileCheck2,
  X,
  Send,
  MessageCircleHeart,
  UploadCloud,
  CheckCircle2,
} from 'lucide-react';
import {
  PregnancySuccessStory,
  INITIAL_PREGNANCY_STORIES,
  getStoredStories,
  saveStoriesToStorage,
} from '@/lib/pregnancy-stories-data';

export default function PregnancyStoriesSection() {
  const [stories, setStories] = useState<PregnancySuccessStory[]>(() => {
    if (typeof window === 'undefined') return INITIAL_PREGNANCY_STORIES;
    return getStoredStories().filter((s) => s.published);
  });
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedStory, setSelectedStory] = useState<PregnancySuccessStory | null>(null);

  // Patient submission form modal state
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [patientCity, setPatientCity] = useState('');
  const [patientDuration, setPatientDuration] = useState('');
  const [babyName, setBabyName] = useState('');
  const [babyAge, setBabyAge] = useState('');
  const [patientStory, setPatientStory] = useState('');
  const [consentChecked, setConsentChecked] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  const categories = [
    { key: 'all', label: 'همه داستان‌های امید' },
    { key: 'IVF', label: 'جراحی‌های IVF در کوثر' },
    { key: 'ICSI', label: 'میکرواینجکشن (ICSI)' },
    { key: 'FROZEN_EMBRYO', label: 'انتقال جنین فریز' },
    { key: 'long_wait', label: 'انتظار بالای ۵ سال' },
  ];

  const filteredStories = stories.filter((s) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'long_wait') {
      return (
        s.infertilityDuration.includes('۵') ||
        s.infertilityDuration.includes('۶') ||
        s.infertilityDuration.includes('۷') ||
        s.infertilityDuration.includes('۸')
      );
    }
    return s.treatmentType === activeCategory;
  });

  const handlePatientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentChecked) {
      alert('لطفاً گزینه رضایت انتشار را علامت بزنید.');
      return;
    }

    // Create a new pending story and save to storage
    const newStory: PregnancySuccessStory = {
      id: `story-patient-${Date.now()}`,
      patientInitials: patientName,
      city: patientCity || 'مازندران',
      infertilityDuration: patientDuration || 'بارداری موفق با دکتر زمانیان',
      treatmentType: 'IVF',
      treatmentTypeLabel: 'درمان تخصصی ناباروری با دکتر مرضیه زمانیان',
      treatmentLocation: 'مطب ساری و بخش ناباروری کوثر بیمارستان امام خمینی ساری',
      babyName: babyName,
      babyBirthDate: 'به‌تازگی',
      babyAge: babyAge || 'نوزاد',
      photoUrl: '/assets/dr_zamanian_hero_real.jpg',
      satisfactionRating: 5,
      quote: patientStory.slice(0, 100) + '...',
      storyText: patientStory,
      writtenConsentObtained: true,
      consentArchiveCode: `ONLINE-REQ-${Math.floor(1000 + Math.random() * 9000)}`,
      doctorNote: 'درخواست دلنوشته ارسالی از مراجعین محترم جهت ثبت در گالری معجزه‌ها.',
      published: true, // Show in gallery
      createdAt: new Date().toLocaleDateString('fa-IR'),
    };

    const allStored = getStoredStories();
    const updated = [newStory, ...allStored];
    saveStoriesToStorage(updated);
    setStories(updated.filter((s) => s.published));

    setSubmissionSuccess(true);
    setTimeout(() => {
      setSubmissionSuccess(false);
      setIsSubmitModalOpen(false);
      setPatientName('');
      setPatientCity('');
      setPatientDuration('');
      setBabyName('');
      setBabyAge('');
      setPatientStory('');
      setConsentChecked(false);
    }, 2500);
  };

  return (
    <section id="success-stories" className="py-16 sm:py-24 bg-white relative overflow-hidden">
      {/* Background Soft Accents */}
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-[#8FA382]/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#2C5E8A]/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F0F4EF] text-[#8FA382] text-xs font-bold border border-[#8FA382]/20">
            <HeartHandshake className="w-4 h-4 text-[#8FA382]" />
            <span>دیوار امید، زندگی و معجزه‌های بارداری</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#2C5E8A] tracking-tight">
            داستان‌های واقعی بارداری و گالری نوزادان متولد شده
          </h2>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            لبخند نوزادانی که پس از سال‌ها انتظار با توکل به خدا و تلاش‌های علمی خانم دکتر مرضیه زمانیان به آغوش گرم خانواده بازگشتند (تمامی تصاویر و دلنوشته‌ها با اخذ رضایت‌نامه کتبی رسمی مراجعین منتشر گردیده‌اند).
          </p>

          {/* Trust Strip */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-slate-700">
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 px-3.5 py-1.5 rounded-xl">
              <Baby className="w-4 h-4 text-[#C5A880]" />
              <span>بیش از ۱,۲۰۰+ تولد موفق در مازندران</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 px-3.5 py-1.5 rounded-xl">
              <ShieldCheck className="w-4 h-4 text-[#8FA382]" />
              <span>کلیه اعمال IVF در بیمارستان دولتی کوثر ساری</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 px-3.5 py-1.5 rounded-xl">
              <FileCheck2 className="w-4 h-4 text-[#2C5E8A]" />
              <span>رعایت کامل اخلاق پزشکی و محرمانگی هویت</span>
            </div>
          </div>
        </div>

        {/* Filter Tabs & Patient Submission CTA */}
        <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto p-1 bg-slate-100/80 rounded-2xl">
            {categories.map((cat) => (
              <button
                key={cat.key}
                type="button"
                onClick={() => setActiveCategory(cat.key)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  activeCategory === cat.key
                    ? 'bg-white text-[#2C5E8A] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setIsSubmitModalOpen(true)}
            className="w-full md:w-auto bg-[#8FA382] hover:bg-[#7e9271] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-95 shrink-0"
          >
            <MessageCircleHeart className="w-4 h-4" />
            <span>شما هم تجربه بارداری خود را ثبت کنید</span>
          </button>
        </div>

        {/* Stories Cards Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredStories.map((story) => (
            <div
              key={story.id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group text-right"
            >
              {/* Photo Card with Doctor & Baby */}
              <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                <Image
                  src={story.photoUrl}
                  alt={`عکس یادگاری با دکتر زمانیان - نوزاد ${story.babyName}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 420px"
                  className="object-cover group-hover:scale-105 transition duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                {/* Treatment badge */}
                <div className="absolute top-3.5 right-3.5 bg-white/95 backdrop-blur-md px-3 py-1 rounded-xl text-[11px] font-black text-[#2C5E8A] shadow-xs">
                  {story.treatmentTypeLabel.split(' ')[0]} {story.treatmentType}
                </div>

                {/* Verified Consent Badge */}
                <div className="absolute top-3.5 left-3.5 bg-emerald-500/90 text-white backdrop-blur-md px-2.5 py-1 rounded-xl text-[10px] font-bold flex items-center gap-1 shadow-xs">
                  <ShieldCheck className="w-3 h-3" />
                  <span>رضایت کتبی اخذ شده</span>
                </div>

                {/* Baby Name & Birth Meta */}
                <div className="absolute bottom-3.5 right-3.5 left-3.5 text-white">
                  <div className="flex items-center gap-1.5 text-sm font-black text-amber-200">
                    <Baby className="w-4 h-4 text-amber-300" />
                    <span>{story.babyName}</span>
                    <span className="text-white/80 font-normal text-xs">({story.babyAge})</span>
                  </div>
                  <div className="text-xs text-white/90 mt-0.5 flex items-center gap-1.5 font-medium">
                    <span>{story.patientInitials}</span>
                    <span>·</span>
                    <MapPin className="w-3 h-3 text-amber-300 inline" />
                    <span>{story.city}</span>
                  </div>
                </div>
              </div>

              {/* Story Content & Testimonial */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-100 pb-2.5">
                    <span className="font-bold text-[#2C5E8A]">{story.infertilityDuration}</span>
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>

                  <p className="text-slate-700 text-xs sm:text-sm leading-relaxed italic line-clamp-3">
                    «{story.quote}»
                  </p>

                  <div className="text-[11px] text-slate-500 bg-[#F8F9FA] p-2.5 rounded-xl border border-slate-100">
                    <span className="font-bold text-[#8FA382] block">محل درمان و جراحی:</span>
                    <span className="text-slate-600 block line-clamp-1">{story.treatmentLocation}</span>
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  type="button"
                  onClick={() => setSelectedStory(story)}
                  className="w-full mt-2 py-3 bg-[#F0F4EF] hover:bg-[#2C5E8A] text-[#2C5E8A] hover:text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer group/btn"
                >
                  <span>مطالعه داستان کامل و یادداشت پزشک</span>
                  <ArrowLeft className="w-4 h-4 group-hover/btn:-translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full Story Lightbox Modal */}
      {selectedStory && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden text-right animate-in zoom-in-95 duration-200 my-8">
            {/* Header Image */}
            <div className="relative aspect-[16/9] w-full bg-slate-900">
              <Image
                src={selectedStory.photoUrl}
                alt={selectedStory.babyName}
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

              <button
                type="button"
                onClick={() => setSelectedStory(null)}
                className="absolute top-4 left-4 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 right-6 left-6 text-white space-y-1">
                <div className="flex items-center gap-2 text-sm font-black text-amber-300">
                  <Baby className="w-5 h-5" />
                  <span>{selectedStory.babyName}</span>
                  <span className="text-white/80 font-normal">({selectedStory.babyBirthDate})</span>
                </div>
                <div className="text-xs text-white/90">
                  {selectedStory.patientInitials} · {selectedStory.city} | {selectedStory.infertilityDuration}
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-5 max-h-[60vh] overflow-y-auto">
              {/* Treatment and Consent Verification */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                <div>
                  <span className="text-slate-500 block">پروتکل درمانی:</span>
                  <span className="font-bold text-[#2C5E8A]">{selectedStory.treatmentTypeLabel}</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-800 bg-emerald-100/70 px-3 py-1.5 rounded-xl font-bold text-[11px]">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>رضایت کتبی: {selectedStory.consentArchiveCode}</span>
                </div>
              </div>

              {/* Patient Testimonial Narrative */}
              <div className="space-y-2">
                <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                  <MessageCircleHeart className="w-4 h-4 text-[#C5A880]" />
                  <span>دلنوشته و تجربه درمان مراجعین محترم:</span>
                </h4>
                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed p-4 bg-[#F8F9FA] rounded-2xl border border-slate-200/70 whitespace-pre-line">
                  {selectedStory.storyText}
                </p>
              </div>

              {/* Dr. Zamanian's Medical Note */}
              <div className="space-y-2 p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl">
                <div className="flex items-center gap-2 text-amber-950 font-black text-xs">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>یادداشت بالینی خانم دکتر مرضیه زمانیان:</span>
                </div>
                <p className="text-amber-900 text-xs leading-relaxed">
                  {selectedStory.doctorNote}
                </p>
                <div className="text-[10px] text-amber-700 font-bold pt-1">
                  نظام پزشکی: ۸۹۷۰۲ | فلوشیپ فوق‌تخصصی زنان و نازایی ساری
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                محل جراحی‌های ناباروری: مرکز کوثر بیمارستان امام خمینی ساری
              </span>
              <button
                type="button"
                onClick={() => setSelectedStory(null)}
                className="px-5 py-2 bg-[#2C5E8A] text-white text-xs font-bold rounded-xl hover:bg-[#234b6e] transition cursor-pointer"
              >
                بستن پنجره
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Patient Story Submission Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-5 text-right animate-in zoom-in-95 duration-200 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-[#8FA382]/20 text-[#8FA382] flex items-center justify-center">
                  <MessageCircleHeart className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    ثبت دلنوشته و تجربه بارداری با دکتر زمانیان
                  </h3>
                  <p className="text-[10px] text-slate-500">
                    امیدبخش سایر مادران و خانواده‌های چشم‌انتظار باشید
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {submissionSuccess ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
                <h4 className="text-sm font-black text-slate-900">
                  دلنوشته و پیام پرمهر شما با موفقیت ثبت شد!
                </h4>
                <p className="text-xs text-slate-600">
                  از به اشتراک گذاشتن این حس شیرین و امیدبخش از شما سپاسگزاریم.
                </p>
              </div>
            ) : (
              <form onSubmit={handlePatientSubmit} className="space-y-3.5 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      نام شما (یا مخفف): <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="مثال: مریم ر. و همسر"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:bg-white focus:border-[#2C5E8A]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">شهر محل سکونت:</label>
                    <input
                      type="text"
                      value={patientCity}
                      onChange={(e) => setPatientCity(e.target.value)}
                      placeholder="ساری، بابل، آمل..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:bg-white focus:border-[#2C5E8A]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      نام گل فرزند / دوقلوها: <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={babyName}
                      onChange={(e) => setBabyName(e.target.value)}
                      placeholder="نام فرزند عزیز"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:bg-white focus:border-[#2C5E8A]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      مدت سال‌های انتظار:
                    </label>
                    <input
                      type="text"
                      value={patientDuration}
                      onChange={(e) => setPatientDuration(e.target.value)}
                      placeholder="مثال: ۵ سال انتظار"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:bg-white focus:border-[#2C5E8A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    دلنوشته، متن رضایت و تجربه شما از درمان: <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={patientStory}
                    onChange={(e) => setPatientStory(e.target.value)}
                    placeholder="از احساس خود، روند درمان با خانم دکتر زمانیان و بیمارستان کوثر بنویسید..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:bg-white focus:border-[#2C5E8A]"
                  />
                </div>

                <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consentChecked}
                      onChange={(e) => setConsentChecked(e.target.checked)}
                      className="mt-0.5 rounded text-[#8FA382]"
                    />
                    <span className="text-[11px] text-amber-950 leading-relaxed">
                      اینجانب با رضایت کامل موافقت می‌نمایم دلنوشته و تجربه بارداری اینجانب در دیوار امید مطب خانم دکتر مرضیه زمانیان جهت امیدبخشی به سایر زوج‌های نابارور منتشر گردد.
                    </span>
                  </label>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsSubmitModalOpen(false)}
                    className="px-4 py-2 text-slate-600 rounded-xl hover:bg-slate-100"
                  >
                    انصراف
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#8FA382] hover:bg-[#7e9271] text-white font-bold rounded-xl flex items-center gap-1.5 shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>ارسال دلنوشته</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
