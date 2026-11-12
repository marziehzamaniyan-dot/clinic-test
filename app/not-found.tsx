import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#F8F9FA] text-[#1E293B] text-center font-sans" dir="rtl">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-200/80 shadow-md space-y-4">
        <span className="text-4xl font-black text-[#2C5E8A]">۴۰۴</span>
        <h2 className="text-xl font-black text-[#2C5E8A]">صفحه مورد نظر یافت نشد</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          صفحه‌ای که به دنبال آن هستید وجود ندارد یا به آدرس دیگری منتقل شده است.
        </p>
        <Link
          href="/"
          className="inline-block px-5 py-2.5 bg-[#2C5E8A] hover:bg-[#234b6e] text-white text-xs font-bold rounded-xl transition"
        >
          بازگشت به صفحه اصلی کلینیک
        </Link>
      </div>
    </div>
  );
}
