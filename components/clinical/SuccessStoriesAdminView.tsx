'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  HeartHandshake,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  Eye,
  Trash2,
  Edit3,
  UploadCloud,
  FileCheck2,
  Sparkles,
  Baby,
  Star,
  MapPin,
  Calendar,
  X,
  Clock,
  ShieldCheck,
  Filter,
} from 'lucide-react';
import {
  PregnancySuccessStory,
  INITIAL_PREGNANCY_STORIES,
  getStoredStories,
  saveStoriesToStorage,
} from '@/lib/pregnancy-stories-data';
import { UserRole } from '@/lib/clinic-mgmt-logic';

interface SuccessStoriesAdminViewProps {
  currentRole: UserRole;
}

export default function SuccessStoriesAdminView({ currentRole }: SuccessStoriesAdminViewProps) {
  const [stories, setStories] = useState<PregnancySuccessStory[]>(() => {
    if (typeof window === 'undefined') return INITIAL_PREGNANCY_STORIES;
    return getStoredStories();
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Modal State for New / Edit Story
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStory, setEditingStory] = useState<PregnancySuccessStory | null>(null);

  // Form Fields
  const [formPatient, setFormPatient] = useState('');
  const [formCity, setFormCity] = useState('ساری');
  const [formDuration, setFormDuration] = useState('');
  const [formTreatmentType, setFormTreatmentType] = useState<PregnancySuccessStory['treatmentType']>('IVF');
  const [formLocation, setFormLocation] = useState('بخش کوثر بیمارستان امام خمینی ساری');
  const [formBabyName, setFormBabyName] = useState('');
  const [formBirthDate, setFormBirthDate] = useState('');
  const [formBabyAge, setFormBabyAge] = useState('');
  const [formQuote, setFormQuote] = useState('');
  const [formStoryText, setFormStoryText] = useState('');
  const [formDoctorNote, setFormDoctorNote] = useState('');
  const [formConsent, setFormConsent] = useState(true);
  const [formConsentCode, setFormConsentCode] = useState('');
  const [formPublished, setFormPublished] = useState(true);
  const [formRating, setFormRating] = useState(5);
  const [formPhotoUrl, setFormPhotoUrl] = useState<string>('/assets/baby_family_success.jpg');
  const [customPhotoName, setCustomPhotoName] = useState<string>('');

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const openNewStoryModal = () => {
    setEditingStory(null);
    setFormPatient('');
    setFormCity('ساری');
    setFormDuration('۵ سال سابقه انتظار');
    setFormTreatmentType('IVF');
    setFormLocation('عمل پانکچر و انتقال در مرکز ناباروری دولتی کوثر بیمارستان امام خمینی ساری');
    setFormBabyName('');
    setFormBirthDate('آبان ۱۴۰۳');
    setFormBabyAge('نوزاد');
    setFormQuote('');
    setFormStoryText('');
    setFormDoctorNote('پایش فولیکولار دقیق با سونوگرافی واژینال در مطب و تشکیل جنین‌های بلاستوسیست در آزمایشگاه کوثر');
    setFormConsent(true);
    setFormConsentCode(`CS-MED-1403/${Math.floor(100 + Math.random() * 900)}`);
    setFormPublished(true);
    setFormRating(5);
    setFormPhotoUrl('/assets/baby_family_success.jpg');
    setCustomPhotoName('');
    setIsModalOpen(true);
  };

  const openEditStoryModal = (story: PregnancySuccessStory) => {
    setEditingStory(story);
    setFormPatient(story.patientInitials);
    setFormCity(story.city);
    setFormDuration(story.infertilityDuration);
    setFormTreatmentType(story.treatmentType);
    setFormLocation(story.treatmentLocation);
    setFormBabyName(story.babyName);
    setFormBirthDate(story.babyBirthDate);
    setFormBabyAge(story.babyAge);
    setFormQuote(story.quote);
    setFormStoryText(story.storyText);
    setFormDoctorNote(story.doctorNote);
    setFormConsent(story.writtenConsentObtained);
    setFormConsentCode(story.consentArchiveCode);
    setFormPublished(story.published);
    setFormRating(story.satisfactionRating);
    setFormPhotoUrl(story.photoUrl);
    setCustomPhotoName('');
    setIsModalOpen(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('لطفاً یک فایل تصویری (JPG یا PNG) انتخاب نمایید.');
      return;
    }

    setCustomPhotoName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setFormPhotoUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveStory = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formPatient.trim()) {
      alert('لطفاً نام یا شناسه بیمار را وارد نمایید.');
      return;
    }
    if (!formBabyName.trim()) {
      alert('لطفاً نام یا مشخصات نوزاد را وارد نمایید.');
      return;
    }
    if (!formQuote.trim() && !formStoryText.trim()) {
      alert('لطفاً متن رضایت‌نامه یا دلنوشته بیمار را وارد نمایید.');
      return;
    }
    if (!formConsent) {
      alert('برای حفظ حریم خصوصی مراجعین، اخذ رضایت‌نامه کتبی بیمار قبل از بارگذاری الزامی است.');
      return;
    }

    const typeLabels: Record<PregnancySuccessStory['treatmentType'], string> = {
      IVF: 'جراحی IVF و انتقال در بیمارستان کوثر',
      ICSI: 'میکرواینجکشن (ICSI)',
      FROZEN_EMBRYO: 'انتقال جنین فریز شده',
      MEDICATION_MONITORING: 'پایش فولیکول و درمان دارویی',
      HYSTEROSCOPY: 'هیستروسکوپی درمانی و رفع چسبندگی',
    };

    if (editingStory) {
      const updated = stories.map((s) =>
        s.id === editingStory.id
          ? {
              ...s,
              patientInitials: formPatient,
              city: formCity,
              infertilityDuration: formDuration,
              treatmentType: formTreatmentType,
              treatmentTypeLabel: typeLabels[formTreatmentType],
              treatmentLocation: formLocation,
              babyName: formBabyName,
              babyBirthDate: formBirthDate,
              babyAge: formBabyAge,
              photoUrl: formPhotoUrl,
              satisfactionRating: formRating,
              quote: formQuote || formStoryText.slice(0, 100) + '...',
              storyText: formStoryText,
              writtenConsentObtained: formConsent,
              consentArchiveCode: formConsentCode,
              doctorNote: formDoctorNote,
              published: formPublished,
            }
          : s
      );
      setStories(updated);
      saveStoriesToStorage(updated);
      showToast('داستان بارداری و رضایت بیمار با موفقیت ویرایش شد.');
    } else {
      const newStory: PregnancySuccessStory = {
        id: `story-${Date.now()}`,
        patientInitials: formPatient,
        city: formCity,
        infertilityDuration: formDuration,
        treatmentType: formTreatmentType,
        treatmentTypeLabel: typeLabels[formTreatmentType],
        treatmentLocation: formLocation,
        babyName: formBabyName,
        babyBirthDate: formBirthDate,
        babyAge: formBabyAge,
        photoUrl: formPhotoUrl,
        satisfactionRating: formRating,
        quote: formQuote || formStoryText.slice(0, 100) + '...',
        storyText: formStoryText,
        writtenConsentObtained: formConsent,
        consentArchiveCode: formConsentCode,
        doctorNote: formDoctorNote,
        published: formPublished,
        createdAt: new Date().toLocaleDateString('fa-IR'),
      };
      const updated = [newStory, ...stories];
      setStories(updated);
      saveStoriesToStorage(updated);
      showToast('داستان موفقیت و تصویر یادگاری با موفقیت ثبت و ذخیره گردید.');
    }

    setIsModalOpen(false);
  };

  const handleTogglePublish = (id: string) => {
    const updated = stories.map((s) => (s.id === id ? { ...s, published: !s.published } : s));
    setStories(updated);
    saveStoriesToStorage(updated);
    showToast('وضعیت انتشار در وب‌سایت به‌روزرسانی شد.');
  };

  const handleDelete = (id: string) => {
    if (confirm('آیا از حذف این رکورد داستان موفقیت اطمینان دارید؟')) {
      const updated = stories.filter((s) => s.id !== id);
      setStories(updated);
      saveStoriesToStorage(updated);
      showToast('رکورد با موفقیت حذف شد.');
    }
  };

  const filteredStories = stories.filter((s) => {
    if (filterType !== 'all' && s.treatmentType !== filterType) return false;
    if (filterStatus === 'published' && !s.published) return false;
    if (filterStatus === 'draft' && s.published) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        s.patientInitials.toLowerCase().includes(q) ||
        s.babyName.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q) ||
        s.quote.toLowerCase().includes(q) ||
        s.consentArchiveCode.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const totalStories = stories.length;
  const publishedCount = stories.filter((s) => s.published).length;
  const verifiedConsentCount = stories.filter((s) => s.writtenConsentObtained).length;

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1E293B] border border-[#8FA382] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-5 h-5 text-[#8FA382] shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Header with Title and New Story Action */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#8FA382] mb-1">
            <HeartHandshake className="w-4 h-4 text-[#8FA382]" />
            <span>مدیریت تجربیات موفق درمان ناباروری و رضایت بیماران</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#1E293B]">
            داستان‌های بارداری و گالری نوزادان متولد شده
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            بارگذاری مشخصات بیماران باردار شده، تصاویر یادگاری با دکتر زمانیان و ثبت رضایت‌نامه‌های رسمی
          </p>
        </div>

        <button
          type="button"
          onClick={openNewStoryModal}
          className="bg-[#2C5E8A] hover:bg-[#234b6e] text-white px-5 py-3 rounded-2xl text-xs font-bold transition flex items-center gap-2 shadow-md shadow-[#2C5E8A]/20 cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>+ بارگذاری داستان و عکس جدید بیمار</span>
        </button>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 block font-medium">کل داستان‌های ثبت شده</span>
            <span className="text-2xl font-black text-[#2C5E8A] mt-1 block">{totalStories} مورد</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#2C5E8A]/10 text-[#2C5E8A] flex items-center justify-center font-bold">
            <Baby className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 block font-medium">منتشر شده در وب‌سایت عمومی</span>
            <span className="text-2xl font-black text-emerald-600 mt-1 block">{publishedCount} داستان</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Eye className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 block font-medium">دارای رضایت‌نامه کتبی تاییدشده</span>
            <span className="text-2xl font-black text-[#8FA382] mt-1 block">{verifiedConsentCount} مورد (۱۰۰٪)</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#F0F4EF] text-[#8FA382] flex items-center justify-center font-bold">
            <FileCheck2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex-1 min-w-[260px] relative">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجو بر اساس نام بیمار، نام نوزاد، شهر یا شماره رضایت‌نامه..."
            className="w-full pr-10 pl-4 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#2C5E8A] outline-none transition"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="text-xs py-2 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 outline-none"
          >
            <option value="all">همه روش‌های درمانی</option>
            <option value="IVF">آی‌وی‌اف (IVF)</option>
            <option value="ICSI">میکرواینجکشن (ICSI)</option>
            <option value="FROZEN_EMBRYO">انتقال جنین فریز</option>
            <option value="MEDICATION_MONITORING">پایش دارویی</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs py-2 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 outline-none"
          >
            <option value="all">همه وضعیت‌ها</option>
            <option value="published">فقط منتشرشده در سایت</option>
            <option value="draft">فقط پیش‌نویس</option>
          </select>
        </div>
      </div>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStories.map((story) => (
          <div
            key={story.id}
            className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col group hover:shadow-md transition"
          >
            {/* Image Preview */}
            <div className="relative aspect-[4/3] bg-slate-100">
              <Image
                src={story.photoUrl}
                alt={`عکس یادگاری با دکتر زمانیان - ${story.babyName}`}
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover group-hover:scale-102 transition duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

              {/* Status Badge */}
              <div className="absolute top-3 right-3 flex items-center gap-2">
                <span
                  className={`px-2.5 py-1 rounded-xl text-[10px] font-bold backdrop-blur-md ${
                    story.published
                      ? 'bg-emerald-500/90 text-white shadow-xs'
                      : 'bg-amber-500/90 text-slate-900 shadow-xs'
                  }`}
                >
                  {story.published ? 'منتشر در سایت' : 'پیش‌نویس'}
                </span>

                <span className="px-2 py-1 rounded-xl text-[10px] font-bold bg-white/90 text-[#2C5E8A] backdrop-blur-md shadow-xs">
                  {story.treatmentType}
                </span>
              </div>

              {/* Patient / Baby Title on bottom of image */}
              <div className="absolute bottom-3 right-3 left-3 text-white text-right">
                <div className="flex items-center gap-1.5 text-xs font-black">
                  <Baby className="w-4 h-4 text-amber-300" />
                  <span>{story.babyName}</span>
                  <span className="text-white/70 font-normal">({story.babyBirthDate})</span>
                </div>
                <div className="text-[11px] text-white/90 mt-0.5 flex items-center gap-1.5">
                  <span>{story.patientInitials}</span>
                  <span>·</span>
                  <MapPin className="w-3 h-3 text-amber-300 inline" />
                  <span>{story.city}</span>
                </div>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4 text-right">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-500 border-b border-slate-100 pb-2">
                  <span className="font-semibold text-slate-700">{story.infertilityDuration}</span>
                  <span className="text-[#8FA382] font-bold">۵ از ۵ ★</span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed italic">
                  «{story.quote}»
                </p>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px] text-slate-500 space-y-1">
                  <div className="flex items-center gap-1 text-[#2C5E8A] font-bold">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#8FA382]" />
                    <span>رضایت‌نامه کتبی رسمی: {story.consentArchiveCode}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 line-clamp-1">
                    {story.treatmentLocation}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleTogglePublish(story.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    story.published
                      ? 'bg-amber-50 hover:bg-amber-100 text-amber-800'
                      : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {story.published ? 'عدم انتشار' : 'انتشار در سایت'}
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => openEditStoryModal(story)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                    title="ویرایش مشخصات"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(story.id)}
                    className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition cursor-pointer"
                    title="حذف رکورد"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredStories.length === 0 && (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
          <Baby className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">موردی با فیلترهای انتخابی یافت نشد</h3>
          <p className="text-xs text-slate-400">
            می‌توانید با دکمه بالا داستان موفقیت بارداری جدیدی اضافه کنید.
          </p>
        </div>
      )}

      {/* Upload & Edit Story Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-200 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#2C5E8A]/10 text-[#2C5E8A] flex items-center justify-center font-bold">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#1E293B]">
                    {editingStory ? 'ویرایش داستان و اطلاعات بیمار' : 'بارگذاری اطلاعات بیمار باردار شده و عکس با پزشک'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    ثبت تجربیات بارداری، رضایت‌نامه رسمی و تصویر یادگاری در مطب
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStory} className="space-y-4 text-right">
              {/* Row 1: Patient Name & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    نام / حروف اختصاری بیمار: <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formPatient}
                    onChange={(e) => setFormPatient(e.target.value)}
                    placeholder="مثال: خانم فاطمه م. و همسر"
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#2C5E8A] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    شهر سکونت:
                  </label>
                  <input
                    type="text"
                    value={formCity}
                    onChange={(e) => setFormCity(e.target.value)}
                    placeholder="ساری، بابل، قائمشهر، آمل..."
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#2C5E8A] outline-none"
                  />
                </div>
              </div>

              {/* Row 2: Infertility duration & Treatment Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    مدت زمان ناباروری و تلاش:
                  </label>
                  <input
                    type="text"
                    value={formDuration}
                    onChange={(e) => setFormDuration(e.target.value)}
                    placeholder="مثال: ۶ سال سابقه ناباروری"
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#2C5E8A] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    روش درمانی انجام شده:
                  </label>
                  <select
                    value={formTreatmentType}
                    onChange={(e) =>
                      setFormTreatmentType(e.target.value as PregnancySuccessStory['treatmentType'])
                    }
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#2C5E8A] outline-none"
                  >
                    <option value="IVF">آی‌وی‌اف (عمل IVF در بیمارستان کوثر ساری)</option>
                    <option value="ICSI">میکرواینجکشن (ICSI)</option>
                    <option value="FROZEN_EMBRYO">انتقال جنین فریز شده</option>
                    <option value="MEDICATION_MONITORING">پایش دقیق فولیکول و درمان دارویی</option>
                    <option value="HYSTEROSCOPY">هیستروسکوپی درمانی</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Baby Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    نام نوزاد / نوزادان: <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formBabyName}
                    onChange={(e) => setFormBabyName(e.target.value)}
                    placeholder="رادین عزیز / دوقلوها..."
                    className="w-full px-3 py-1.5 text-xs rounded-lg bg-white border border-slate-200 focus:border-[#2C5E8A] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    تاریخ تولد:
                  </label>
                  <input
                    type="text"
                    value={formBirthDate}
                    onChange={(e) => setFormBirthDate(e.target.value)}
                    placeholder="مهرماه ۱۴۰۳"
                    className="w-full px-3 py-1.5 text-xs rounded-lg bg-white border border-slate-200 focus:border-[#2C5E8A] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    سن کنونی نوزاد:
                  </label>
                  <input
                    type="text"
                    value={formBabyAge}
                    onChange={(e) => setFormBabyAge(e.target.value)}
                    placeholder="۳ ماهه / ۶ ماهه"
                    className="w-full px-3 py-1.5 text-xs rounded-lg bg-white border border-slate-200 focus:border-[#2C5E8A] outline-none"
                  />
                </div>
              </div>

              {/* Photo Upload with Doctor Section */}
              <div className="space-y-2 border border-dashed border-slate-300 p-4 rounded-2xl bg-slate-50/70">
                <label className="block text-xs font-bold text-slate-800">
                  تصویر یادگاری بیمار و نوزاد با دکتر زمانیان:
                </label>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="relative w-28 h-24 rounded-2xl overflow-hidden bg-slate-200 border border-slate-300 shrink-0">
                    <Image
                      src={formPhotoUrl}
                      alt="پیش‌نمایش تصویر"
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="flex-1 space-y-2 w-full">
                    <label className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-300 hover:border-[#2C5E8A] text-slate-700 rounded-xl text-xs font-bold cursor-pointer transition shadow-2xs">
                      <UploadCloud className="w-4 h-4 text-[#2C5E8A]" />
                      <span>بارگذاری عکس از کامپیوتر یا گوشی</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>

                    {customPhotoName && (
                      <div className="text-[11px] text-emerald-600 font-bold truncate">
                        ✓ فایل انتخاب شد: {customPhotoName}
                      </div>
                    )}

                    <div className="text-[10px] text-slate-400">
                      یا انتخاب از نمونه‌های عکاسی شده مطب:
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setFormPhotoUrl('/assets/baby_family_success.jpg')}
                        className="text-[10px] px-2 py-1 bg-white border border-slate-200 rounded-lg hover:border-[#2C5E8A]"
                      >
                        نمونه ۱ (مادر و نوزاد)
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormPhotoUrl('/assets/twins_success.jpg')}
                        className="text-[10px] px-2 py-1 bg-white border border-slate-200 rounded-lg hover:border-[#2C5E8A]"
                      >
                        نمونه ۲ (دوقلوها)
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormPhotoUrl('/assets/dr_zamanian_hero_real.jpg')}
                        className="text-[10px] px-2 py-1 bg-white border border-slate-200 rounded-lg hover:border-[#2C5E8A]"
                      >
                        نمونه ۳ (دکتر با نوزاد)
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormPhotoUrl('/assets/dr_zamanian_ultrasound.jpg')}
                        className="text-[10px] px-2 py-1 bg-white border border-slate-200 rounded-lg hover:border-[#2C5E8A]"
                      >
                        نمونه ۴ (سونوگرافی در مطب)
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quote / Short Testimonial */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  جمله طلایی / دلنوشته کوتاه بیمار: <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formQuote}
                  onChange={(e) => setFormQuote(e.target.value)}
                  placeholder="مثال: خانم دکتر زمانیان معجزه امید را به زندگی ما پس از ۶ سال بازگرداندند..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#2C5E8A] outline-none"
                />
              </div>

              {/* Detailed Story / Letter */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  متن کامل تجربه درمان و رضایت‌نامه بیمار:
                </label>
                <textarea
                  rows={3}
                  value={formStoryText}
                  onChange={(e) => setFormStoryText(e.target.value)}
                  placeholder="شرح روند درمان، سال‌های انتظار، تجربیات مراجعه به مطب و بیمارستان کوثر..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#2C5E8A] outline-none"
                />
              </div>

              {/* Doctor Clinical Note */}
              <div>
                <label className="block text-xs font-bold text-[#2C5E8A] mb-1">
                  یادداشت تخصصی خانم دکتر زمانیان (پروتکل درمانی):
                </label>
                <textarea
                  rows={2}
                  value={formDoctorNote}
                  onChange={(e) => setFormDoctorNote(e.target.value)}
                  placeholder="توضیح مختصر پزشکی در خصوص پروتکل دارویی، گرید جنین‌ها یا مراقبت‌های دوره بارداری..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#2C5E8A] outline-none"
                />
              </div>

              {/* Written Consent Verification (Ethics Requirement) */}
              <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl space-y-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formConsent}
                    onChange={(e) => setFormConsent(e.target.checked)}
                    className="mt-1 rounded text-[#8FA382] focus:ring-[#8FA382]"
                  />
                  <div>
                    <span className="text-xs font-black text-emerald-900 block">
                      تأییدیه قانونی اخذ رضایت‌نامه کتبی و اخلاقی از بیمار
                    </span>
                    <span className="text-[11px] text-emerald-800 leading-relaxed block mt-0.5">
                      رضایت‌نامه آگاهانه کتبی بیمار و همسر ایشان جهت انتشار تصویر یادگاری و متن رضایت در وب‌سایت مطب اخذ شده و در پرونده بالینی بایگانی گردیده است.
                    </span>
                  </div>
                </label>

                <div className="pt-2 flex items-center gap-2">
                  <span className="text-[11px] text-emerald-900 font-bold">کد بایگانی فرم رضایت:</span>
                  <input
                    type="text"
                    value={formConsentCode}
                    onChange={(e) => setFormConsentCode(e.target.value)}
                    placeholder="CS-MED-1403/..."
                    className="px-2 py-1 text-xs rounded-lg bg-white border border-emerald-300 font-mono text-emerald-950"
                  />
                </div>
              </div>

              {/* Publish Toggle */}
              <div className="flex items-center justify-between p-3 bg-slate-100 rounded-xl">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">وضعیت نمایش در وب‌سایت</span>
                  <span className="text-[11px] text-slate-500">
                    {formPublished
                      ? 'هم‌اکنون در بخش دیوار امید وب‌سایت برای عموم مراجعین قابل مشاهده خواهد بود.'
                      : 'به عنوان پیش‌نویس محرمانه فقط در پنل مدیریت نگهداری می‌شود.'}
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={formPublished}
                  onChange={(e) => setFormPublished(e.target.checked)}
                  className="w-5 h-5 rounded text-[#2C5E8A]"
                />
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-bold bg-[#2C5E8A] hover:bg-[#234b6e] text-white rounded-xl shadow-md transition cursor-pointer"
                >
                  {editingStory ? 'ذخیره تغییرات' : 'ثبت و انتشار داستان'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
