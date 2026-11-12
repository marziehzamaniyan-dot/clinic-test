'use client';

import React, { useState } from 'react';
import {
  X,
  User,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  LogIn,
  UserPlus,
  AlertCircle,
  Database,
  Loader2,
  Stethoscope,
  Briefcase,
} from 'lucide-react';
import { UserRole } from '@/lib/clinic-mgmt-logic';

export interface AuthUser {
  username: string;
  displayName: string;
  role: UserRole | 'PATIENT';
  nationalId?: string;
  phone?: string;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AuthUser) => void;
}

export default function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Login form state
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Register form state
  const [regFullName, setRegFullName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regNationalId, setRegNationalId] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<UserRole | 'PATIENT'>('PATIENT');
  const [medicalCode, setMedicalCode] = useState('');

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const u = loginUsername.trim();
    const p = loginPassword.trim();

    if (!u || !p) {
      setErrorMessage('لطفاً نام کاربری / کد ملی و کلمه عبور را وارد فرمایید.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: u, password: p }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || 'اطلاعات ورود نادرست است.');
        setIsLoading(false);
        return;
      }

      setSuccessMessage(
        `خوش آمدید، ${data.user.displayName}. ورود به سامانه با موفقیت انجام شد.`
      );

      setTimeout(() => {
        setIsLoading(false);
        onLoginSuccess(data.user);
        onClose();
      }, 700);
    } catch (err: any) {
      console.error('Login error:', err);
      setErrorMessage('خطا در برقراری ارتباط با سرور دیتابیس مونگو. لطفاً مجدداً تلاش فرمایید.');
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!regFullName.trim() || !regPassword.trim() || (!regNationalId.trim() && !regUsername.trim())) {
      setErrorMessage('لطفاً نام، نام کاربری یا کد ملی و کلمه عبور را تکمیل فرمایید.');
      return;
    }

    if (regPassword.trim().length < 5) {
      setErrorMessage('کلمه عبور باید حداقل ۵ کاراکتر باشد.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: regFullName.trim(),
          username: (regUsername.trim() || regNationalId.trim()).toLowerCase(),
          nationalId: regNationalId.trim(),
          phone: regPhone.trim(),
          password: regPassword.trim(),
          role: regRole,
          medicalCouncilNumber: medicalCode.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || 'خطا در ثبت‌نام کاربر در دیتابیس.');
        setIsLoading(false);
        return;
      }

      setSuccessMessage(
        `حساب کاربری با موفقیت در دیتابیس مونگو ایجاد شد! در حال انتقال به پنل...`
      );

      setTimeout(() => {
        setIsLoading(false);
        onLoginSuccess(data.user);
        onClose();
      }, 800);
    } catch (err: any) {
      console.error('Register error:', err);
      setErrorMessage('خطا در ذخیره‌سازی اطلاعات در دیتابیس مونگو.');
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden text-right flex flex-col my-8">
        {/* Header */}
        <div className="p-5 bg-gradient-to-l from-[#2C5E8A] to-[#234b6e] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-[#C5A880]">
              <Lock className="w-5 h-5 text-[#C5A880]" />
            </div>
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <span>احراز هویت و مدیریت کاربران</span>
              </h3>
              <span className="text-[11px] text-slate-200 flex items-center gap-1.5 mt-0.5">
                <Database className="w-3 h-3 text-emerald-400" />
                متصل به دیتابیس مونگو (MongoDB)
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
            aria-label="بستن پنجره"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-100 border-b border-slate-200 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setErrorMessage(null);
            }}
            className={`py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'login'
                ? 'bg-white text-[#2C5E8A] shadow-xs font-black'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>ورود به سیستم</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('register');
              setErrorMessage(null);
            }}
            className={`py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'register'
                ? 'bg-white text-[#2C5E8A] shadow-xs font-black'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>ثبت‌نام کاربر جدید</span>
          </button>
        </div>

        {/* Notifications */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 font-bold animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-bold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6">
          {activeTab === 'login' ? (
            /* REAL MONGODB LOGIN FORM (NO HARDCODED DEMO ACCOUNTS) */
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  نام کاربری، شماره پرونده یا کد ملی:
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    placeholder="کد ملی یا نام کاربری ثبت شده در دیتابیس..."
                    className="w-full pr-10 pl-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#2C5E8A]/20 focus:border-[#2C5E8A] outline-none transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700">کلمه عبور:</label>
                  <button
                    type="button"
                    onClick={() => setErrorMessage('جهت بازیابی رمز عبور با منشی مطب ۰۱۱-۳۳۲۴۲۱۲۶ تماس حاصل فرمایید.')}
                    className="text-[11px] text-[#2C5E8A] hover:underline cursor-pointer"
                  >
                    فراموشی رمز؟
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="رمز عبور حساب کاربری..."
                    className="w-full pr-10 pl-10 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#2C5E8A]/20 focus:border-[#2C5E8A] outline-none transition dir-ltr text-right"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 accent-[#2C5E8A] rounded"
                  />
                  <span>مرا در این دستگاه به خاطر بسپار</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#2C5E8A] hover:bg-[#234b6e] text-white rounded-xl text-xs font-bold transition shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-3"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>در حال بررسی اعتبار در دیتابیس مونگو...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>ورود به سامانه</span>
                  </>
                )}
              </button>

              <div className="pt-3 border-t border-slate-100 text-center">
                <p className="text-[11px] text-slate-500">
                  حساب کاربری ندارید؟{' '}
                  <button
                    type="button"
                    onClick={() => setActiveTab('register')}
                    className="text-[#2C5E8A] font-bold hover:underline cursor-pointer"
                  >
                    ثبت‌نام کاربر جدید
                  </button>
                </p>
              </div>
            </form>
          ) : (
            /* REAL MONGODB REGISTER FORM */
            <form onSubmit={handleRegister} className="space-y-3.5">
              {/* Role Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  نوع حساب کاربری:
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setRegRole('PATIENT')}
                    className={`p-2 rounded-xl border text-right transition cursor-pointer flex items-center gap-2 ${
                      regRole === 'PATIENT'
                        ? 'border-[#2C5E8A] bg-[#2C5E8A]/10 text-[#2C5E8A] font-bold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <User className="w-4 h-4 shrink-0 text-[#2C5E8A]" />
                    <div>
                      <div className="text-[11px] font-bold">بیمار / مراجع</div>
                      <div className="text-[9px] text-slate-500">مشاهده پرونده و نوبت</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRegRole('SUPER_ADMIN')}
                    className={`p-2 rounded-xl border text-right transition cursor-pointer flex items-center gap-2 ${
                      regRole !== 'PATIENT'
                        ? 'border-[#C5A880] bg-[#C5A880]/15 text-amber-900 font-bold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Stethoscope className="w-4 h-4 shrink-0 text-[#C5A880]" />
                    <div>
                      <div className="text-[11px] font-bold">کادر پزشکی / مدیریت</div>
                      <div className="text-[9px] text-slate-500">دسترسی‌های کلینیک</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* If Staff / Admin is selected, show specific role selection */}
              {regRole !== 'PATIENT' && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <label className="block text-[11px] font-bold text-slate-700">
                    سمت سازمانی در کلینیک:
                  </label>
                  <select
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value as UserRole)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none"
                  >
                    <option value="SUPER_ADMIN">مدیر کل (دکتر مرضیه زمانیان / سوپر ادمین)</option>
                    <option value="RECEPTIONIST">مدیر پذیرش و نوبت‌دهی (خانم اسدی)</option>
                    <option value="CONTENT_EDITOR">مشاور و ویرایشگر محتوا (خانم جعفری)</option>
                  </select>

                  {regRole === 'SUPER_ADMIN' && (
                    <div>
                      <label className="block text-[10px] text-slate-600 font-medium mb-1">
                        شماره نظام پزشکی:
                      </label>
                      <input
                        type="text"
                        value={medicalCode}
                        onChange={(e) => setMedicalCode(e.target.value)}
                        placeholder="مثال: ۸۹۷۰۲"
                        className="w-full px-2.5 py-1 rounded-lg border border-slate-300 text-xs bg-white font-mono"
                      />
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  نام و نام‌خانوادگی کامل <span className="text-rose-500">*</span>:
                </label>
                <input
                  type="text"
                  required
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  placeholder="مثال: دکتر مرضیه زمانیان یا نام بیمار..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#2C5E8A]/20 focus:border-[#2C5E8A] outline-none bg-white transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    نام کاربری یا کد ملی:
                  </label>
                  <input
                    type="text"
                    required
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    placeholder="dr.zamanian یا کد ملی..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#2C5E8A]/20 focus:border-[#2C5E8A] outline-none bg-white dir-ltr text-right transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    شماره موبایل:
                  </label>
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="۰۹۱۲XXXXXXX"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#2C5E8A]/20 focus:border-[#2C5E8A] outline-none bg-white dir-ltr text-right transition font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  کلمه عبور امن <span className="text-rose-500">*</span>:
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="حداقل ۵ کاراکتر..."
                    className="w-full pr-3 pl-10 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#2C5E8A]/20 focus:border-[#2C5E8A] outline-none bg-white dir-ltr text-right transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[10px] text-slate-600 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>کلیه کلمات عبور با الگوریتم رمزنگاری Bcrypt هش و در دیتابیس مونگو ذخیره می‌شوند.</span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#2C5E8A] hover:bg-[#234b6e] text-white rounded-xl text-xs font-bold transition shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>در حال ذخیره در دیتابیس مونگو...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>ثبت حساب کاربری جدید در دیتابیس</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center text-[10px] text-slate-400">
          سامانه امن مطب دکتر زمانیان | بیمارستان امیر مازندرانی ساری (ط ۳)
        </div>
      </div>
    </div>
  );
}
