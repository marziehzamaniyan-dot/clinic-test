import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'مطب و کلینیک فوق‌تخصصی زنان و درمان ناباروری دکتر مرضیه زمانیان | ساری',
  description: 'مطب فوق‌تخصصی دکتر مرضیه زمانیان (بیمارستان امیر مازندرانی ساری، طبقه سوم) | کلیه جراحی‌های مربوط به IVF در بخش ناباروری دولتی کوثر بیمارستان امام خمینی ساری',
  openGraph: {
    title: 'مطب و کلینیک فوق‌تخصصی زنان و درمان ناباروری دکتر مرضیه زمانیان | ساری',
    description: 'مطب فوق‌تخصصی دکتر مرضیه زمانیان (بیمارستان امیر مازندرانی ساری، طبقه سوم) | کلیه جراحی‌های مربوط به IVF در بخش ناباروری دولتی کوثر بیمارستان امام خمینی ساری',
    type: 'website',
    locale: 'fa_IR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'مطب و کلینیک فوق‌تخصصی زنان و درمان ناباروری دکتر مرضیه زمانیان | ساری',
    description: 'مطب فوق‌تخصصی دکتر مرضیه زمانیان (بیمارستان امیر مازندرانی ساری، طبقه سوم) | کلیه جراحی‌های مربوط به IVF در بخش ناباروری دولتی کوثر بیمارستان امام خمینی ساری',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="fa" dir="rtl" className="scroll-smooth">
      <body suppressHydrationWarning className="bg-[#F8F9FA] text-[#1E293B] antialiased selection:bg-[#2C5E8A] selection:text-white">
        {children}
      </body>
    </html>
  );
}
