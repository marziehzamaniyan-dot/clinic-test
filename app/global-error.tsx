'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#F8F9FA] text-[#1E293B] text-center font-sans">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-200/80 shadow-md space-y-4">
          <h2 className="text-xl font-black text-rose-700">خطای سیستمی در سرور</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            متأسفانه در پردازش درخواست خطایی رخ داده است. لطفاً مجدداً تلاش فرمایید.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            className="px-5 py-2.5 bg-[#2C5E8A] hover:bg-[#234b6e] text-white text-xs font-bold rounded-xl transition cursor-pointer"
          >
            تلاش مجدد
          </button>
        </div>
      </body>
    </html>
  );
}
