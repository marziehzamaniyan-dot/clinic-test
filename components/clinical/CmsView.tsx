'use client';

import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Edit3,
  Trash2,
  CheckCircle,
  Eye,
  Globe,
  Tag,
  Calendar,
  Sparkles,
  Layers,
  HelpCircle,
  AlertCircle,
} from 'lucide-react';
import { UserRole } from '@/lib/clinic-mgmt-logic';

export interface ClinicArticle {
  id: string;
  title: string;
  category: 'IVF_EDUCATION' | 'ANNOUNCEMENT' | 'PREGNANCY' | 'NUTRITION';
  categoryLabel: string;
  author: string;
  status: 'published' | 'draft';
  date: string;
  summary: string;
  content: string;
}

const INITIAL_ARTICLES: ClinicArticle[] = [
  {
    id: 'ART-101',
    title: 'همه چیز درباره پایش رشد فولیکول و زمان دقیق تزریق آمپول آزادسازی (HCG)',
    category: 'IVF_EDUCATION',
    categoryLabel: 'آموزش درمان ناباروری',
    author: 'دکتر مرضیه زمانیان',
    status: 'published',
    date: '۱۴۰۳/۰۸/۱۵',
    summary:
      'در سیکل‌های تحریک تخمک‌گذاری، اندازه‌گیری دقیق قطر فولیکول‌ها با سونوگرافی واژینال و تنظیم ساعت تزریق HCG، تعیین‌کننده‌ترین گام در موفقیت عمل پانکچر است.',
    content:
      'در فرآیند لقاح آزمایشگاهی (IVF)، رشد فولیکول‌ها به طور روزانه یا یک‌روز درمیان با سونوگرافی واژینال ارزیابی می‌شود. هنگامی که فولیکول‌های غالب به ابعاد ۱۸ الی ۲۲ میلی‌متر برسند، آمپول HCG تجویز می‌گردد. عمل پانکچر دقیقاً ۳۵ الی ۳۶ ساعت پس از تزریق انجام می‌شود.',
  },
  {
    id: 'ART-102',
    title: 'اطلاعیه مهم: برنامه شیفت‌های فوق‌تخصصی کلینیک در تعطیلات پاییزه',
    category: 'ANNOUNCEMENT',
    categoryLabel: 'اطلاعیه‌ها و اخبار',
    author: 'تیم روابط عمومی کلینیک',
    status: 'published',
    date: '۱۴۰۳/۰۸/۱۸',
    summary:
      'به اطلاع بیماران تحت سیکل فعال می‌رساند بخش جنین‌شناسی و اتاق عمل‌های IVF کلینیک بدون تعطیلی دایر خواهند بود.',
    content:
      'کلیه سونوگرافی‌های رصد فولیکولار، اعمال تخمک‌کشی و انتقال جنین در روزهای تعطیل رسمی نیز طبق نوبت‌های از پیش اعلام‌شده در اتاق عمل ۱ و ۲ انجام می‌پذیرند.',
  },
  {
    id: 'ART-103',
    title: 'نقش آزمایش ژنتیک جنین (PGT-A) در افزایش شانس تولد نوزاد سالم',
    category: 'IVF_EDUCATION',
    categoryLabel: 'آموزش درمان ناباروری',
    author: 'دکتر مرضیه زمانیان',
    status: 'draft',
    date: '۱۴۰۳/۰۸/۲۰',
    summary:
      'بررسی کروموزومی جنین در مرحله بلاستوسیست پیش از انتقال به رحم، احتمال لانه‌گزینی را تا بیش از ۷۰ درصد ارتقا می‌دهد.',
    content:
      'آزمایش ژنتیک پیش از لانه‌گزینی (PGT) یکی از بزرگترین دستاوردهای علم جنین‌شناسی است. در کلینیک ما بیوپسی از سلول‌های تروفکتودرم روز پنجم انجام و جنین‌ها فریز می‌شوند.',
  },
];

interface CmsViewProps {
  currentRole: UserRole;
}

export default function CmsView({ currentRole }: CmsViewProps) {
  const [articles, setArticles] = useState<ClinicArticle[]>(INITIAL_ARTICLES);
  const [selectedArticle, setSelectedArticle] = useState<ClinicArticle | null>(INITIAL_ARTICLES[0]);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState<ClinicArticle['category']>('IVF_EDUCATION');
  const [editSummary, setEditSummary] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editStatus, setEditStatus] = useState<'published' | 'draft'>('published');
  const [alertNotice, setAlertNotice] = useState<string | null>(null);

  // Clinic About & Banner texts
  const [heroBadge, setHeroBadge] = useState('پیشرفته‌ترین مرکز درمان ناباروری و سلامت بانوان');
  const [clinicStory, setClinicStory] = useState(
    'کلینیک تخصصی و فوق‌تخصصی زنان و زایمان دکتر مرضیه زمانیان با بهره‌گیری از پیشرفته‌ترین آزمایشگاه جنین‌شناسی و اتاق عمل‌های اختصاصی، بیش از ۱۵ سال است که امید را به بیش از ۱۰,۰۰۰ زوج در مسیر والد شدن هدیه نموده است.'
  );

  const startEdit = (art: ClinicArticle) => {
    setSelectedArticle(art);
    setEditTitle(art.title);
    setEditCategory(art.category);
    setEditSummary(art.summary);
    setEditContent(art.content);
    setEditStatus(art.status);
    setIsEditing(true);
  };

  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedArticle) return;

    const categoryLabels: Record<ClinicArticle['category'], string> = {
      IVF_EDUCATION: 'آموزش درمان ناباروری',
      ANNOUNCEMENT: 'اطلاعیه‌ها و اخبار',
      PREGNANCY: 'مراقبت‌های بارداری',
      NUTRITION: 'تغذیه و سلامت',
    };

    setArticles((prev) =>
      prev.map((art) =>
        art.id === selectedArticle.id
          ? {
              ...art,
              title: editTitle,
              category: editCategory,
              categoryLabel: categoryLabels[editCategory],
              summary: editSummary,
              content: editContent,
              status: editStatus,
            }
          : art
      )
    );

    setIsEditing(false);
    setAlertNotice('تغییرات مطلب با موفقیت ذخیره و در سایت عمومی به‌روزرسانی شد.');
    setTimeout(() => setAlertNotice(null), 3500);
  };

  const handleAddNew = () => {
    const newId = `ART-${Math.floor(100 + Math.random() * 900)}`;
    const newArt: ClinicArticle = {
      id: newId,
      title: 'عنوان مطلب جدید کلینیک',
      category: 'ANNOUNCEMENT',
      categoryLabel: 'اطلاعیه‌ها و اخبار',
      author: 'ویرایشگر محتوا',
      status: 'draft',
      date: '۱۴۰۳/۰۸/۲۱',
      summary: 'خلاصه کوتاه مطلب...',
      content: 'متن کامل مقاله یا اطلاعیه در این بخش درج خواهد شد.',
    };
    setArticles([newArt, ...articles]);
    startEdit(newArt);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-800">
                مدیریت محتوا و اطلاعیه‌های سایت (CMS)
              </h2>
              <span className="text-xs text-slate-500">
                ویرایش مقالات آموزشی، متون صفحه نخست و اطلاعیه‌های رسمی کلینیک دکتر زمانیان
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-500">نقش فعال:</span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/15 text-purple-700 border border-purple-500/30">
            {currentRole === 'SUPER_ADMIN' ? 'مدیر ارشد (Super Admin)' : 'ویرایشگر محتوا (Content Editor)'}
          </span>
          <button
            type="button"
            onClick={handleAddNew}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>ایجاد مطلب جدید</span>
          </button>
        </div>
      </div>

      {alertNotice && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 font-bold animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{alertNotice}</span>
        </div>
      )}

      {/* Main CMS Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Article List (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 flex flex-col">
          <h3 className="text-xs font-black text-slate-700 mb-3 flex items-center justify-between">
            <span>فهرست مقالات و اطلاعیه‌ها ({articles.length})</span>
            <span className="text-[10px] text-slate-400">آخرین بروزرسانی: امروز</span>
          </h3>

          <div className="space-y-2 overflow-y-auto max-h-[550px]">
            {articles.map((art) => {
              const isSelected = selectedArticle?.id === art.id;
              return (
                <div
                  key={art.id}
                  onClick={() => {
                    setSelectedArticle(art);
                    setIsEditing(false);
                  }}
                  className={`p-3.5 rounded-xl border transition cursor-pointer text-right ${
                    isSelected
                      ? 'border-purple-500 bg-purple-50/60 shadow-xs'
                      : 'border-slate-100 bg-slate-50/60 hover:bg-slate-100/70'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5 text-[10px]">
                    <span className="font-mono text-purple-700 font-bold">{art.id}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded font-bold ${
                        art.status === 'published'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {art.status === 'published' ? 'منتشر شده' : 'پیش‌نویس'}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-800 line-clamp-2 leading-relaxed mb-1">
                    {art.title}
                  </h4>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2">
                    <span>{art.categoryLabel}</span>
                    <span>{art.date}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Article Editor or Viewer (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
          {selectedArticle ? (
            isEditing ? (
              <form onSubmit={handleSaveArticle} className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                    <Edit3 className="w-4 h-4 text-purple-600" />
                    <span>ویرایش محتوا: {selectedArticle.id}</span>
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold cursor-pointer"
                    >
                      انصراف
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold cursor-pointer shadow-xs"
                    >
                      ذخیره و انتشار
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      عنوان مطلب / اطلاعیه:
                    </label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      required
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:border-purple-600 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">دسته‌بندی:</label>
                      <select
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value as any)}
                        className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:border-purple-600 outline-none bg-white"
                      >
                        <option value="IVF_EDUCATION">آموزش درمان ناباروری</option>
                        <option value="ANNOUNCEMENT">اطلاعیه‌ها و اخبار</option>
                        <option value="PREGNANCY">مراقبت‌های بارداری</option>
                        <option value="NUTRITION">تغذیه و سلامت</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">وضعیت انتشار:</label>
                      <select
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value as any)}
                        className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:border-purple-600 outline-none bg-white font-bold"
                      >
                        <option value="published">منتشر شده</option>
                        <option value="draft">پیش‌نویس</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    خلاصه مطلب (نمایش در کارت‌های سایت):
                  </label>
                  <textarea
                    rows={2}
                    value={editSummary}
                    onChange={(e) => setEditSummary(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:border-purple-600 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">متن کامل محتوا:</label>
                  <textarea
                    rows={8}
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:border-purple-600 outline-none leading-relaxed"
                  />
                </div>
              </form>
            ) : (
              <div className="space-y-5">
                <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-mono text-[10px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded font-bold">
                        {selectedArticle.id}
                      </span>
                      <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {selectedArticle.categoryLabel}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          selectedArticle.status === 'published'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {selectedArticle.status === 'published' ? 'منتشر شده در سایت' : 'پیش‌نویس'}
                      </span>
                    </div>

                    <h2 className="text-base font-black text-slate-800 leading-snug">
                      {selectedArticle.title}
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() => startEdit(selectedArticle)}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>ویرایش این مطلب</span>
                  </button>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[11px] font-bold text-slate-400 block mb-1">خلاصه کارت:</span>
                  <p className="text-xs text-slate-700 leading-relaxed">{selectedArticle.summary}</p>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-slate-400 block mb-2">متن بدنه مقاله:</span>
                  <div className="text-xs text-slate-700 leading-loose bg-white p-4 rounded-xl border border-slate-100">
                    {selectedArticle.content}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-100">
                  <span>نویسنده / ثبت‌کننده: {selectedArticle.author}</span>
                  <span>تاریخ ثبت: {selectedArticle.date}</span>
                </div>
              </div>
            )
          ) : (
            <div className="text-center text-slate-400 py-12 text-xs">
              یک مطلب را از ستون کناری جهت مشاهده یا ویرایش انتخاب کنید.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
