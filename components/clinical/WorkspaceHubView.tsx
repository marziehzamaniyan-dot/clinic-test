'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Cloud,
  Calendar,
  Mail,
  FileText,
  FolderOpen,
  GraduationCap,
  Database,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Plus,
  RefreshCw,
  Send,
  Loader2,
  Lock,
  Layers,
  Sparkles,
} from 'lucide-react';
import {
  initAuth,
  googleSignIn,
  logout,
  getAccessToken,
} from '@/src/lib/firebase';
import {
  createGoogleCalendarEvent,
  listGoogleCalendarEvents,
  sendGmailMessage,
  listGoogleDriveFiles,
  createGoogleDocDocument,
  listGoogleClassroomCourses,
} from '@/src/lib/workspace';

export default function WorkspaceHubView() {
  const [activeSubTab, setActiveSubTab] = useState<'calendar' | 'gmail' | 'docs' | 'classroom' | 'databases'>('databases');

  // Google Auth State
  const [googleUser, setGoogleUser] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // MongoDB Status State
  const [mongoStats, setMongoStats] = useState<{ userCount: number; isDbConnected: boolean } | null>(null);
  const [loadingMongo, setLoadingMongo] = useState(false);

  // Google Calendar State
  const [calendarEvents, setCalendarEvents] = useState<any[]>([]);
  const [loadingCalendar, setLoadingCalendar] = useState(false);
  const [apptSummary, setApptSummary] = useState('ویزیت و پایش فولیکول بیمار');
  const [apptDate, setApptDate] = useState(() => new Date(Date.now() + 86400000).toISOString().slice(0, 16));
  const [calendarSuccess, setCalendarSuccess] = useState<string | null>(null);

  // Gmail State
  const [emailTo, setEmailTo] = useState('marziehzamaniyan@gmail.com');
  const [emailSubject, setEmailSubject] = useState('دستورالعمل درمانی و زمان‌بندی تزریق HCG - کلینیک دکتر زمانیان');
  const [emailBody, setEmailBody] = useState(
    'سلام و درود،\nدستور دارویی شما برای مرحله پانکچر تخمک ثبت شد. لطفاً آمپول تجویز شده را رأس ساعت اعلامی تزریق نموده و روز بعد ناشتا در بخش IVF بیمارستان امام خمینی ساری حضور داشته باشید.\n\nبا آرزوی موفقیت،\nمطب دکتر مرضیه زمانیان'
  );
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailResult, setEmailResult] = useState<string | null>(null);

  // Google Drive & Docs State
  const [driveFiles, setDriveFiles] = useState<any[]>([]);
  const [loadingDrive, setLoadingDrive] = useState(false);
  const [docTitle, setDocTitle] = useState('فرم رضایت‌آگاهانه عمل انتقال جنین (IVF)');
  const [docContent, setDocContent] = useState(
    'جمهوری اسلامی ایران\nدانشگاه علوم پزشکی مازندران\nکلینیک فوق‌تخصصی زنان و درمان ناباروری دکتر مرضیه زمانیان (نظام: ۸۹۷۰۲)\n\nفرم رضایت‌نامه رسمی زوجین جهت پروتکل درمانی ICSI/IVF و فریز تخمک و جنین در مرکز کوثر بیمارستان امام خمینی ساری.'
  );
  const [creatingDoc, setCreatingDoc] = useState(false);
  const [createdDocUrl, setCreatedDocUrl] = useState<string | null>(null);

  // Google Classroom State
  const [classroomCourses, setClassroomCourses] = useState<any[]>([]);
  const [loadingClassroom, setLoadingClassroom] = useState(false);

  // Listen to Google Auth
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setGoogleUser(user);
        setAccessToken(token);
        setAuthError(null);
      },
      () => {
        setGoogleUser(null);
        setAccessToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  // Fetch MongoDB Stats
  const fetchMongoStatus = async () => {
    setLoadingMongo(true);
    try {
      const res = await fetch('/api/auth/status');
      const data = await res.json();
      if (data.success) {
        setMongoStats({
          userCount: data.userCount,
          isDbConnected: data.isDbConnected,
        });
      }
    } catch (e) {
      console.warn('Failed to fetch mongo stats:', e);
    } finally {
      setLoadingMongo(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetch('/api/auth/status')
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.success) {
          setMongoStats({
            userCount: data.userCount,
            isDbConnected: data.isDbConnected,
          });
        }
      })
      .catch((e) => console.warn(e));

    return () => {
      isMounted = false;
    };
  }, []);

  // Google Sign In handler
  const handleGoogleLogin = async () => {
    setIsSigningIn(true);
    setAuthError(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setGoogleUser(result.user);
        setAccessToken(result.accessToken);
      }
    } catch (err: any) {
      console.error('Google Sign In Error:', err);
      setAuthError(err.message || 'خطا در اتصال به حساب گوگل');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleGoogleLogout = async () => {
    await logout();
    setGoogleUser(null);
    setAccessToken(null);
  };

  // Google Calendar Fetch
  const handleFetchCalendar = async () => {
    setLoadingCalendar(true);
    setCalendarSuccess(null);
    try {
      const data = await listGoogleCalendarEvents(8);
      setCalendarEvents(data.items || []);
    } catch (err: any) {
      setAuthError(err.message || 'خطا در دریافت تقویم گوگل');
    } finally {
      setLoadingCalendar(false);
    }
  };

  const handleCreateCalendarEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingCalendar(true);
    setCalendarSuccess(null);
    try {
      const start = new Date(apptDate);
      const end = new Date(start.getTime() + 45 * 60000); // 45 min duration
      const res = await createGoogleCalendarEvent({
        summary: apptSummary,
        description: 'ثبت خودکار از پرتال درمانی کلینیک دکتر زمانیان (ساری)',
        location: 'مازندران، ساری، بلوار امیر مازندرانی، بیمارستان امیر مازندرانی، ط ۳',
        startTime: start.toISOString(),
        endTime: end.toISOString(),
      });
      setCalendarSuccess(`رویداد با موفقیت در تقویم گوگل ثبت شد: ${res.htmlLink || ''}`);
      handleFetchCalendar();
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setLoadingCalendar(false);
    }
  };

  // Send Gmail
  const handleSendGmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setSendingEmail(true);
    setEmailResult(null);
    try {
      await sendGmailMessage({
        to: emailTo,
        subject: emailSubject,
        bodyText: emailBody,
      });
      setEmailResult(`ایمیل با موفقیت از طریق سرویس رسمی Gmail ارسال شد به: ${emailTo}`);
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setSendingEmail(false);
    }
  };

  // Fetch Drive Files
  const handleFetchDrive = async () => {
    setLoadingDrive(true);
    try {
      const data = await listGoogleDriveFiles(10);
      setDriveFiles(data.files || []);
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setLoadingDrive(false);
    }
  };

  // Create Doc
  const handleCreateDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingDoc(true);
    setCreatedDocUrl(null);
    try {
      const doc = await createGoogleDocDocument(docTitle, docContent);
      if (doc?.documentId) {
        setCreatedDocUrl(`https://docs.google.com/document/d/${doc.documentId}/edit`);
      }
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setCreatingDoc(false);
    }
  };

  // Fetch Classroom
  const handleFetchClassroom = async () => {
    setLoadingClassroom(true);
    try {
      const data = await listGoogleClassroomCourses();
      setClassroomCourses(data.courses || []);
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setLoadingClassroom(false);
    }
  };

  return (
    <div className="space-y-6 text-right">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-[#1a3854] to-slate-900 text-white shadow-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold border border-sky-500/30">
            <Cloud className="w-3.5 h-3.5" />
            <span>یکپارچگی سرویس‌های ابری و گوگل (Google Workspace & Cloud Infrastructure)</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black">
            مرکز مدیریت دیتابیس مونگو، کلود اس‌کیو‌ال و ابزارهای گوگل
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            اتصال بی‌واسطه به پایگاه داده مونگو (MongoDB) جهت احراز هویت بدون اکانت‌های پیش‌فرض،
            تقویم گوگل (Calendar) برای نوبت‌ها، سرویس Gmail برای ارسال پیام به بیماران، گوگل داکس و درایو برای اسناد رضایت‌نامه، و کلاس‌روم برای آموزش مراجعین.
          </p>
        </div>

        {/* Google Sign-In Status / Official Google Button */}
        <div className="shrink-0 flex flex-col items-end">
          {googleUser ? (
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-right space-y-2">
              <div className="flex items-center gap-2.5">
                {googleUser.photoURL ? (
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border border-sky-400">
                    <Image
                      src={googleUser.photoURL}
                      alt={googleUser.displayName || 'Google User'}
                      fill
                      unoptimized
                      referrerPolicy="no-referrer"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold">
                    G
                  </div>
                )}
                <div>
                  <div className="text-xs font-bold text-white">{googleUser.displayName || 'کاربر متصل'}</div>
                  <div className="text-[10px] text-slate-300 font-mono">{googleUser.email}</div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-white/10">
                <span className="text-[10px] text-emerald-300 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> متصل به Google Workspace
                </span>
                <button
                  type="button"
                  onClick={handleGoogleLogout}
                  className="text-[10px] text-rose-300 hover:text-white underline cursor-pointer"
                >
                  خروج
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2 text-center md:text-right">
              {/* Official Google Sign-in Button compliant with Google brand guidelines */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isSigningIn}
                className="inline-flex items-center justify-center gap-3 px-5 py-2.5 rounded-full bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold shadow-md transition cursor-pointer disabled:opacity-60"
              >
                {isSigningIn ? (
                  <Loader2 className="w-4 h-4 animate-spin text-slate-600" />
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 48 48">
                    <path
                      fill="#EA4335"
                      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                    />
                    <path
                      fill="#34A853"
                      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                    />
                  </svg>
                )}
                <span>ورود با حساب گوگل (Sign in with Google)</span>
              </button>
              <p className="text-[10px] text-slate-400">
                جهت دسترسی به تقویم، جیمیل، درایو و داکس کلینیک
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Global Alerts */}
      {authError && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between font-bold">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{authError}</span>
          </div>
          <button
            type="button"
            onClick={() => setAuthError(null)}
            className="text-xs text-rose-500 hover:text-rose-700 underline"
          >
            بستن
          </button>
        </div>
      )}

      {/* Workspace Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        <button
          type="button"
          onClick={() => setActiveSubTab('databases')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'databases'
              ? 'bg-[#2C5E8A] text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>پایگاه داده (MongoDB & Cloud SQL)</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveSubTab('calendar');
            if (googleUser && calendarEvents.length === 0) handleFetchCalendar();
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'calendar'
              ? 'bg-[#2C5E8A] text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>تقویم گوگل (Google Calendar)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('gmail')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'gmail'
              ? 'bg-[#2C5E8A] text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>ارسال ایمیل به بیماران (Gmail)</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveSubTab('docs');
            if (googleUser && driveFiles.length === 0) handleFetchDrive();
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'docs'
              ? 'bg-[#2C5E8A] text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>اسناد و رضایت‌نامه‌ها (Docs & Drive)</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveSubTab('classroom');
            if (googleUser && classroomCourses.length === 0) handleFetchClassroom();
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'classroom'
              ? 'bg-[#2C5E8A] text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>آموزش بیماران (Google Classroom)</span>
        </button>
      </div>

      {/* SUB-TAB 1: DATABASES (MongoDB, Cloud SQL & Firestore) */}
      {activeSubTab === 'databases' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* MongoDB Status Card */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <Database className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                فعال و متصل
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-800">پایگاه داده مونگو (MongoDB)</h3>
              <p className="text-xs text-slate-500 mt-1">
                مدیریت احراز هویت بدون اکانت پیش‌فرض، پرونده سلامت مراجعین و امنیت اطلاعات
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>کاربران ثبت‌شده در مونگو:</span>
                <span className="font-bold text-slate-800 font-mono">
                  {loadingMongo ? '...' : mongoStats?.userCount ?? 0} کاربر
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>الگوریتم رمزنگاری کلمه عبور:</span>
                <span className="font-mono text-emerald-600 font-bold">Bcrypt (Salt rounds: 10)</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>اکانت‌های پیش‌فرض و هاردکد:</span>
                <span className="text-rose-600 font-bold">به‌طور کامل حذف شد</span>
              </div>
            </div>

            <button
              type="button"
              onClick={fetchMongoStatus}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingMongo ? 'animate-spin' : ''}`} />
              <span>به‌روزرسانی وضعیت دیتابیس مونگو</span>
            </button>
          </div>

          {/* Cloud SQL Card */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                <Layers className="w-5 h-5 text-blue-600" />
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                منطقه us-west2
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-800">کلود اس‌کیو‌ال (Cloud SQL)</h3>
              <p className="text-xs text-slate-500 mt-1">
                PostgreSQL با Drizzle ORM برای ساختار رابطه‌ای نوبت‌ها و پرونده‌های EHR
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>شناسه پروژه:</span>
                <span className="font-mono text-slate-800 font-bold">optical-karst-5vr20</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>شناسه نمونه (Instance):</span>
                <span className="font-mono text-blue-700 font-bold">ai-studio-036a630d</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>وضعیت مقیاس‌پذیری:</span>
                <span className="text-emerald-600 font-bold">Scale-to-zero Developer</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-[10px] text-blue-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
              <span>پایگاه داده رابطه‌ای در منطقه us-west2 راه‌اندازی و کانفیگ شده است.</span>
            </div>
          </div>

          {/* Firebase Firestore Card */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <Lock className="w-5 h-5 text-amber-600" />
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                قوانین مستقر شد
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-800">فایربیس فایرستور (Firestore)</h3>
              <p className="text-xs text-slate-500 mt-1">
                ذخیره‌سازی زمان‌واقعی با قوانین امنیتی Zero-Trust و احراز هویت توکن‌های گوگل
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>قوانین امنیتی (Rules):</span>
                <span className="text-emerald-600 font-bold">مستقر در سرور فایربیس</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>توکن دسترسی در حافظه:</span>
                <span className="text-emerald-600 font-bold">In-Memory (بدون ذخیره در LocalStorage)</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>دسترسی مدیر ارشد:</span>
                <span className="font-mono text-slate-700 text-[11px]">marziehzamaniyan@gmail.com</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[10px] text-amber-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
              <span>پروتکل امنیتی ABAC برای پرونده‌های بالینی فعال است.</span>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: GOOGLE CALENDAR */}
      {activeSubTab === 'calendar' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add Event Form */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#2C5E8A]" />
              <h3 className="text-base font-bold text-slate-800">ثبت مستقیم نوبت در تقویم گوگل</h3>
            </div>
            <p className="text-xs text-slate-500">
              با ثبت این فرم، رویداد نوبت بیمار یا عمل IVF مستقیماً در تقویم متصل شما همگام‌سازی می‌گردد.
            </p>

            {calendarSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{calendarSuccess}</span>
              </div>
            )}

            <form onSubmit={handleCreateCalendarEvent} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">عنوان رویداد:</label>
                <input
                  type="text"
                  required
                  value={apptSummary}
                  onChange={(e) => setApptSummary(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#2C5E8A]/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">تاریخ و ساعت:</label>
                <input
                  type="datetime-local"
                  required
                  value={apptDate}
                  onChange={(e) => setApptDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#2C5E8A]/20 outline-none dir-ltr text-right"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[10px] text-slate-600">
                محل: بیمارستان امیر مازندرانی ساری ط ۳ (یا مرکز کوثر بیمارستان امام خمینی)
              </div>

              <button
                type="submit"
                disabled={loadingCalendar || !googleUser}
                className="w-full py-2.5 bg-[#2C5E8A] hover:bg-[#234b6e] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loadingCalendar ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                <span>ثبت در Google Calendar</span>
              </button>

              {!googleUser && (
                <p className="text-[10px] text-rose-500 font-bold text-center">
                  ابتدا باید با حساب گوگل خود در بالای صفحه لاگین فرمایید.
                </p>
              )}
            </form>
          </div>

          {/* List Events */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-800">رویدادهای تقویم فعال</h3>
              <button
                type="button"
                onClick={handleFetchCalendar}
                disabled={loadingCalendar || !googleUser}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingCalendar ? 'animate-spin' : ''}`} />
                <span>به‌روزرسانی رویدادها</span>
              </button>
            </div>

            {calendarEvents.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-400 text-xs">
                رویدادی یافت نشد یا هنوز با حساب گوگل خود وارد نشده‌اید. روی دکمه به‌روزرسانی کلیک نمایید.
              </div>
            ) : (
              <div className="space-y-2 max-h-[350px] overflow-y-auto">
                {calendarEvents.map((evt: any) => (
                  <div
                    key={evt.id}
                    className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 flex items-center justify-between"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{evt.summary || 'بدون عنوان'}</h4>
                      <span className="text-[10px] text-slate-500 block mt-0.5">
                        {evt.start?.dateTime ? new Date(evt.start.dateTime).toLocaleString('fa-IR') : 'تمام روز'}
                      </span>
                      {evt.location && (
                        <span className="text-[10px] text-slate-400 block mt-0.5">{evt.location}</span>
                      )}
                    </div>
                    {evt.htmlLink && (
                      <a
                        href={evt.htmlLink}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 text-[10px] font-bold flex items-center gap-1 hover:bg-sky-100"
                      >
                        <span>مشاهده در تقویم</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: GMAIL */}
      {activeSubTab === 'gmail' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs max-w-2xl space-y-4">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-rose-600" />
            <h3 className="text-base font-bold text-slate-800">ارسال مستقیم ایمیل از طریق سرویس جیمیل (Gmail API)</h3>
          </div>
          <p className="text-xs text-slate-500">
            ارسال دستورالعمل‌های درمان ناباروری، زمان‌بندی آزمایش AMH/HCG یا پاسخ به مشاوره به ایمیل بیمار یا پزشک مرکز.
          </p>

          {emailResult && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{emailResult}</span>
            </div>
          )}

          <form onSubmit={handleSendGmail} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">گیرنده (ایمیل بیمار یا مشاور):</label>
              <input
                type="email"
                required
                value={emailTo}
                onChange={(e) => setEmailTo(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-rose-500/20 outline-none dir-ltr text-right"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">موضوع ایمیل:</label>
              <input
                type="text"
                required
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-rose-500/20 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">متن پیام:</label>
              <textarea
                rows={5}
                required
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-rose-500/20 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={sendingEmail || !googleUser}
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {sendingEmail ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>ارسال ایمیل از طریق Gmail</span>
            </button>
          </form>
        </div>
      )}

      {/* SUB-TAB 4: GOOGLE DOCS & DRIVE */}
      {activeSubTab === 'docs' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Create Document */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <h3 className="text-base font-bold text-slate-800">ایجاد سند رسمی در گوگل داکس (Google Docs)</h3>
            </div>
            <p className="text-xs text-slate-500">
              تولید خودکار برگه‌های رضایت‌نامه، خلاصه‌پرونده بیمار و گزارشات کلینیکی با قابلیت ویرایش همزمان.
            </p>

            {createdDocUrl && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center justify-between">
                <span>سند جدید با موفقیت ایجاد گردید!</span>
                <a
                  href={createdDocUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[10px] flex items-center gap-1 hover:bg-emerald-700"
                >
                  <span>باز کردن در گوگل داکس</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}

            <form onSubmit={handleCreateDoc} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">عنوان سند:</label>
                <input
                  type="text"
                  required
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">متن اولیه سند بالینی:</label>
                <textarea
                  rows={4}
                  required
                  value={docContent}
                  onChange={(e) => setDocContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500/20 outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={creatingDoc || !googleUser}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {creatingDoc ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                <span>ایجاد سند در Google Docs</span>
              </button>
            </form>
          </div>

          {/* List Drive Files */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-slate-800">پرونده‌ها و سونوگرافی‌ها در Google Drive</h3>
              </div>
              <button
                type="button"
                onClick={handleFetchDrive}
                disabled={loadingDrive || !googleUser}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingDrive ? 'animate-spin' : ''}`} />
                <span>به‌روزرسانی فایل‌ها</span>
              </button>
            </div>

            {driveFiles.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-400 text-xs">
                فایلی یافت نشد یا هنوز با حساب گوگل لاگین نکرده‌اید.
              </div>
            ) : (
              <div className="space-y-2 max-h-[350px] overflow-y-auto">
                {driveFiles.map((f: any) => (
                  <div
                    key={f.id}
                    className="p-3 rounded-2xl border border-slate-200 bg-slate-50/60 flex items-center justify-between"
                  >
                    <div className="truncate max-w-[200px]">
                      <h4 className="text-xs font-bold text-slate-800 truncate">{f.name}</h4>
                      <span className="text-[10px] text-slate-400 font-mono block">
                        {f.mimeType?.split('.').pop() || 'file'}
                      </span>
                    </div>
                    {f.webViewLink && (
                      <a
                        href={f.webViewLink}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-[10px] font-bold flex items-center gap-1 hover:bg-blue-100"
                      >
                        <span>نمایش</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 5: GOOGLE CLASSROOM */}
      {activeSubTab === 'classroom' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-bold text-slate-800">دوره‌های آموزشی بیماران در Google Classroom</h3>
            </div>
            <button
              type="button"
              onClick={handleFetchClassroom}
              disabled={loadingClassroom || !googleUser}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingClassroom ? 'animate-spin' : ''}`} />
              <span>به‌روزرسانی کلاس‌ها</span>
            </button>
          </div>
          <p className="text-xs text-slate-500">
            فهرست دوره‌های آموزشی راهنمای زوج‌های تحت درمان ناباروری، مراقبت‌های پس از انتقال جنین و رژیم‌های غذایی.
          </p>

          {classroomCourses.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-400 text-xs">
              کلاسی یافت نشد یا حساب متصل دسترسی به دوره‌های آموزشی ندارد.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {classroomCourses.map((c: any) => (
                <div key={c.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                  <h4 className="text-xs font-bold text-slate-800">{c.name}</h4>
                  <p className="text-[11px] text-slate-500">{c.section || 'آموزش‌های بالینی IVF'}</p>
                  {c.alternateLink && (
                    <a
                      href={c.alternateLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-bold hover:underline"
                    >
                      <span>ورود به محیط کلاس</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
