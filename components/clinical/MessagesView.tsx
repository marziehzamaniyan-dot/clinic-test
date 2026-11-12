'use client';

import React, { useState } from 'react';
import {
  Mail,
  MailOpen,
  Search,
  Filter,
  CheckCircle,
  Clock,
  Send,
  Phone,
  AlertCircle,
  Archive,
  Star,
  UserCheck,
  ShieldAlert,
  Share2,
  MessageCircle,
  Copy,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { UserRole } from '@/lib/clinic-mgmt-logic';

export interface ContactMessage {
  id: string;
  senderName: string;
  phone: string;
  email?: string;
  subject: string;
  category: 'IVF_CONSULT' | 'APPOINTMENT' | 'GENETICS' | 'LAB_QUERY' | 'GENERAL';
  categoryLabel: string;
  message: string;
  timestamp: string;
  status: 'unread' | 'read' | 'replied' | 'archived';
  priority: 'high' | 'normal';
  assignedTo?: string;
  replyNote?: string;
}

const INITIAL_MESSAGES: ContactMessage[] = [
  {
    id: 'MSG-301',
    senderName: 'زهرا کاظمی',
    phone: '۰۹۱۲۳۴۵۶۷۸۹',
    email: 'z.kazemi@gmail.com',
    subject: 'درخواست مشاوره جهت شروع سیکل تخمک‌کشی (پانکچر)',
    category: 'IVF_CONSULT',
    categoryLabel: 'مشاوره IVF و ناباروری',
    message:
      'با سلام و احترام، بنده ۳۲ ساله هستم و دو دوره ناموفق در شهرستان داشته‌ام. آزمایش AMH جدید انجام داده‌ام و می‌خواستم بدانم آیا امکان ویزیت حضوری در شیفت روز دوشنبه دکتر زمانیان وجود دارد؟ مدارک قبلی را نیز به همراه دارم.',
    timestamp: 'امروز، ساعت ۱۰:۲۴',
    status: 'unread',
    priority: 'high',
    assignedTo: 'منشی مطب (خانم اسدی)',
  },
  {
    id: 'MSG-302',
    senderName: 'محمدحسین حسینی',
    phone: '۰۹۱۸۱۱۱۴۳۲۱',
    subject: 'پیگیری ارسال آزمایش ژنتیک PGT جنین‌ها',
    category: 'GENETICS',
    categoryLabel: 'نتایج ژنتیک و جنین‌شناسی',
    message:
      'سلام، پرونده شماره ۱۰۴۲ مربوط به خانم رضایی (همسرم). آزمایشگاه مرکزی اعلام کرده نمونه بیوپسی تروفکتودرم روز سوم ارسال شده. لطفاً بفرمایید نتیجه چند روز دیگر به دست دکتر زمانیان می‌رسد؟',
    timestamp: 'امروز، ساعت ۰۸:۴۵',
    status: 'read',
    priority: 'high',
    assignedTo: 'مشاور درمانی (خانم جعفری)',
    replyNote: 'تماس تلفنی برقرار شد و به آزمایشگاه جنین ارجاع داده شد.',
  },
  {
    id: 'MSG-303',
    senderName: 'مینا صادقی',
    phone: '۰۹۳۵۲۲۰۱۱۹۹',
    subject: 'تغییر زمان نوبت سونوگرافی واژینال روز پنجم',
    category: 'APPOINTMENT',
    categoryLabel: 'تغییر و ثبت نوبت',
    message:
      'سلام خسته نباشید. نوبت من برای فردا ساعت ۹ صبح بود اما با توجه به اینکه روز پنجم پریود من یک روز دیرتر شروع شد، آیا باید سونوگرافی را به پس‌فردا موکول کنم؟ ممنون می‌شوم راهنمایی بفرمایید.',
    timestamp: 'دیروز، ساعت ۱۸:۳۰',
    status: 'replied',
    priority: 'normal',
    assignedTo: 'منشی مطب (خانم اسدی)',
    replyNote: 'پیامک تأیید موکول شدن به پس‌فردا ساعت ۱۰ ارسال شد.',
  },
  {
    id: 'MSG-304',
    senderName: 'فاطمه احمدی‌نژاد',
    phone: '۰۹۱۲۸۸۸۹۹۰۰',
    subject: 'پرسش درباره پوشش بیمه تکمیلی دانا برای عمل انتقال جنین',
    category: 'GENERAL',
    categoryLabel: 'بیمه و امور مالی',
    message:
      'آیا معرفی‌نامه آنلاین بیمه دانا در کلینیک پذیرفته می‌شود یا باید فاکتور رسمی همراه با مهر متخصص زنان و جنین‌شناس دریافت کنیم؟',
    timestamp: '۲ روز پیش',
    status: 'archived',
    priority: 'normal',
  },
];

interface MessagesViewProps {
  currentRole: UserRole;
}

export default function MessagesView({ currentRole }: MessagesViewProps) {
  const [messages, setMessages] = useState<ContactMessage[]>(INITIAL_MESSAGES);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(INITIAL_MESSAGES[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unread' | 'read' | 'replied'>('all');
  const [replyText, setReplyText] = useState('');
  const [sendSmsNotification, setSendSmsNotification] = useState(true);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // Quick Dispatcher state for secretary (Ms. Asadi) and counselor (Ms. Jafari)
  const [quickPhone, setQuickPhone] = useState('');
  const [quickTemplate, setQuickTemplate] = useState<'drdr' | 'address' | 'stories'>('drdr');
  const [copiedQuick, setCopiedQuick] = useState(false);
  const [showDispatcher, setShowDispatcher] = useState(true);

  const quickTemplates = {
    drdr: `سلام و درود از مطب دکتر مرضیه زمانیان (ساری)
جهت دریافت و رزرو نوبت اینترنتی می‌توانید از طریق لینک سامانه دکتردکتر اقدام فرمایید:
https://drdr.ir/dr/89702
تلفن گویا: 01191012126 (۱: منشی خانم اسدی / ۲: مشاوره خانم جعفری)
تلفن‌های مستقیم مطب: 01133242126 - 01133255205`,
    address: `نشانی مطب و مراکز درمانی دکتر مرضیه زمانیان:
مطب و سونوگرافی: ساری، بلوار امیر مازندرانی، بیمارستان امیر مازندرانی، ط ۳ (کدپستی: ۴۸۱۶۷۴۵۳۶۵)
مرکز جراحی‌های IVF و تخمک‌کشی: بخش ناباروری دولتی کوثر بیمارستان امام خمینی ساری
تلفن گویا: 01191012126`,
    stories: `داستان‌های موفقیت بارداری و گالری نوزادان متولد شده با دستان دکتر مرضیه زمانیان را در وب‌سایت مطب مشاهده فرمایید:
https://drdr.ir/dr/89702
پایش دقیق دوره‌های IVF و درمان ناباروری در ساری`,
  };

  const getCleanPhone = (raw: string) => {
    let p = raw.replace(/\D/g, '');
    if (p.startsWith('0')) p = '98' + p.substring(1);
    return p;
  };

  const handleCopyQuickText = () => {
    navigator.clipboard.writeText(quickTemplates[quickTemplate]);
    setCopiedQuick(true);
    setTimeout(() => setCopiedQuick(false), 2500);
  };

  const filteredMessages = messages.filter((msg) => {
    if (statusFilter !== 'all' && msg.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = msg.senderName.toLowerCase().includes(q);
      const matchPhone = msg.phone.includes(q);
      const matchSub = msg.subject.toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchSub) return false;
    }
    return true;
  });

  const handleSelectMessage = (msg: ContactMessage) => {
    setSelectedMessage(msg);
    if (msg.status === 'unread') {
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, status: 'read' as const } : m))
      );
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMessage || !replyText.trim()) return;

    setMessages((prev) =>
      prev.map((m) =>
        m.id === selectedMessage.id
          ? {
              ...m,
              status: 'replied' as const,
              replyNote: replyText,
            }
          : m
      )
    );

    setNotificationMsg(
      sendSmsNotification
        ? `پاسخ ثبت شد و پیامک اطلاع‌رسانی به شماره ${selectedMessage.phone} ارسال گردید.`
        : 'پاسخ با موفقیت در سوابق پیام ذخیره شد.'
    );
    setReplyText('');
    setTimeout(() => setNotificationMsg(null), 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#2C5E8A]/10 text-[#2C5E8A] flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-800">صندوق پیام‌های تماس و مراجعین</h2>
              <span className="text-xs text-slate-500">
                مدیریت پیام‌های ثبت شده از طریق فرم تماس، درخواست‌های نوبت و مشاوره‌های آنلاین
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">نقش فعال:</span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#2C5E8A]/15 text-[#2C5E8A] border border-[#2C5E8A]/30">
            {currentRole === 'SUPER_ADMIN' ? 'مدیر ارشد (Super Admin)' : 'مدیر پذیرش (Receptionist)'}
          </span>
        </div>
      </div>

      {notificationMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 font-bold animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{notificationMsg}</span>
        </div>
      )}

      {/* QUICK DISPATCHER & TELEPHONCHI MESSENGER TOOL FOR SECRETARY */}
      <div className="bg-[#F0F4EF] rounded-2xl p-4 sm:p-5 border border-[#8FA382]/30 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-[#8FA382]" />
            <h3 className="text-xs sm:text-sm font-black text-[#2C5E8A]">
              سامانه ارسال سریع لینک و مشخصات مطب به بیمار (واتس‌اپ، بله، تلگرام، پیامک)
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setShowDispatcher(!showDispatcher)}
            className="text-[11px] text-[#2C5E8A] font-bold hover:underline"
          >
            {showDispatcher ? 'بستن پنل ارسال' : 'نمایش پنل ارسال'}
          </button>
        </div>

        {showDispatcher && (
          <div className="space-y-4 pt-2 border-t border-[#8FA382]/20">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
              {/* Phone input */}
              <div className="sm:col-span-4">
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  شماره موبایل بیمار (تماس‌گیرنده):
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={quickPhone}
                    onChange={(e) => setQuickPhone(e.target.value)}
                    placeholder="مثال: 09112521234"
                    className="w-full pr-8 pl-3 py-2 text-xs rounded-xl bg-white border border-slate-200 focus:border-[#2C5E8A] outline-none font-mono dir-ltr text-right"
                  />
                </div>
              </div>

              {/* Template selector */}
              <div className="sm:col-span-5">
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  قالب پیام ارسالی:
                </label>
                <select
                  value={quickTemplate}
                  onChange={(e) => setQuickTemplate(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-200 focus:border-[#2C5E8A] outline-none text-slate-800"
                >
                  <option value="drdr">لینک نوبت‌دهی آنلاین در دکتردکتر + تلفن گویا 01191012126</option>
                  <option value="address">نشانی مطب (بیمارستان امیر مازندرانی) و مرکز IVF کوثر ساری</option>
                  <option value="stories">لینک دیوار امید و گالری نوزادان متولد شده</option>
                </select>
              </div>

              {/* Copy action */}
              <div className="sm:col-span-3">
                <button
                  type="button"
                  onClick={handleCopyQuickText}
                  className="w-full py-2 bg-white hover:bg-slate-50 border border-[#8FA382]/40 text-[#2C5E8A] font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedQuick ? '✓ متن کپی شد' : 'کپی متن پیام'}</span>
                </button>
              </div>
            </div>

            {/* Live Message Preview & 1-Click Dispatch Buttons */}
            <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-2">
              <div className="text-[10px] text-slate-400 font-bold">پیش‌نمایش متنی که برای بیمار ارسال می‌شود:</div>
              <p className="text-slate-700 text-[11px] leading-relaxed whitespace-pre-line bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                {quickTemplates[quickTemplate]}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {/* WhatsApp */}
                <a
                  href={`https://api.whatsapp.com/send?${quickPhone ? `phone=${getCleanPhone(quickPhone)}&` : ''}text=${encodeURIComponent(quickTemplates[quickTemplate])}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>ارسال به واتس‌اپ بیمار</span>
                </a>

                {/* Bale */}
                <a
                  href={`https://ble.ir/share/url?url=https://drdr.ir/dr/89702&text=${encodeURIComponent(quickTemplates[quickTemplate])}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
                >
                  <span>ارسال در پیام‌رسان بله</span>
                </a>

                {/* Telegram */}
                <a
                  href={`https://t.me/share/url?url=https://drdr.ir/dr/89702&text=${encodeURIComponent(quickTemplates[quickTemplate])}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>ارسال در تلگرام</span>
                </a>

                {/* Direct SMS */}
                <a
                  href={`sms:${quickPhone || ''}?body=${encodeURIComponent(quickTemplates[quickTemplate])}`}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>ارسال پیامک (SMS)</span>
                </a>
              </div>
            </div>

            <div className="text-[10px] text-slate-500 flex items-center gap-1.5 pt-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>
                <strong>تنظیم ارسال خودکار در تلفنچی:</strong> در پنل مدیریت تلفنچی (شماره ۰۱۱۹۱۰۱۲۱۲۶) با فعال کردن وب‌هوک تماس‌های ورودی (Inbound Call SMS)، همین متن بعد از پایان تماس بیمار به صورت خودکار پیامک می‌شود.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Main Mail Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[580px]">
        {/* Left/Middle: Messages List (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col overflow-hidden">
          {/* Search & Filter Bar */}
          <div className="p-4 border-b border-slate-100 space-y-3 bg-slate-50/50">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="جستجو بر اساس نام، شماره تلفن یا موضوع..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-9 pl-3 py-2 text-xs rounded-xl bg-white border border-slate-200 focus:border-[#2C5E8A] outline-none"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 rounded-lg font-bold whitespace-nowrap cursor-pointer transition ${
                  statusFilter === 'all'
                    ? 'bg-[#2C5E8A] text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                همه ({messages.length})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('unread')}
                className={`px-2.5 py-1 rounded-lg font-bold whitespace-nowrap cursor-pointer transition ${
                  statusFilter === 'unread'
                    ? 'bg-rose-500 text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                خوانده‌نشده ({messages.filter((m) => m.status === 'unread').length})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('replied')}
                className={`px-2.5 py-1 rounded-lg font-bold whitespace-nowrap cursor-pointer transition ${
                  statusFilter === 'replied'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                پاسخ‌داده‌شده
              </button>
            </div>
          </div>

          {/* List items */}
          <div className="flex-1 divide-y divide-slate-100 overflow-y-auto max-h-[500px]">
            {filteredMessages.length > 0 ? (
              filteredMessages.map((msg) => {
                const isSelected = selectedMessage?.id === msg.id;
                return (
                  <div
                    key={msg.id}
                    onClick={() => handleSelectMessage(msg)}
                    className={`p-4 transition cursor-pointer text-right hover:bg-slate-50 ${
                      isSelected
                        ? 'bg-blue-50/70 border-r-4 border-[#2C5E8A]'
                        : msg.status === 'unread'
                        ? 'bg-amber-50/40 font-semibold'
                        : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-black text-slate-800">{msg.senderName}</span>
                      <span className="text-[10px] text-slate-400 font-medium">{msg.timestamp}</span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-700 truncate mb-1">{msg.subject}</h4>

                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                      {msg.message}
                    </p>

                    <div className="flex items-center justify-between mt-2.5 text-[10px]">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                        {msg.categoryLabel}
                      </span>

                      <div className="flex items-center gap-1.5">
                        {msg.priority === 'high' && (
                          <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 font-bold">
                            فوری
                          </span>
                        )}
                        {msg.status === 'unread' && (
                          <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                        )}
                        {msg.status === 'replied' && (
                          <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                            <CheckCircle className="w-3 h-3" /> پاسخ داده شد
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-xs text-slate-400">پیامی با این مشخصات یافت نشد</div>
            )}
          </div>
        </div>

        {/* Right: Message Detail & Reply Box (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col p-6">
          {selectedMessage ? (
            <div className="space-y-6 flex-1 flex flex-col">
              {/* Header */}
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <span className="text-[11px] font-mono text-[#2C5E8A] bg-[#2C5E8A]/10 px-2 py-0.5 rounded font-bold">
                      شناسه پیام: {selectedMessage.id}
                    </span>
                    <h3 className="text-base font-black text-slate-800 mt-2">
                      {selectedMessage.subject}
                    </h3>
                  </div>

                  <span className="text-xs text-slate-400 font-medium">
                    {selectedMessage.timestamp}
                  </span>
                </div>

                {/* Sender Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 p-3 bg-slate-50 rounded-xl text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">فرستنده:</span>
                    <span className="font-bold text-slate-700">{selectedMessage.senderName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">شماره تماس:</span>
                    <a
                      href={`tel:${selectedMessage.phone}`}
                      className="font-bold font-mono text-[#2C5E8A] hover:underline flex items-center gap-1"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      {selectedMessage.phone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Message Body */}
              <div className="flex-1 text-slate-700 text-xs leading-loose bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 block mb-2">متن پیام مراجع:</span>
                <p className="whitespace-pre-line">{selectedMessage.message}</p>
              </div>

              {/* Existing Reply if any */}
              {selectedMessage.replyNote && (
                <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-bold mb-1">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>پاسخ ثبت شده توسط کارشناس پذیرش:</span>
                  </div>
                  <p className="text-emerald-900 leading-relaxed">{selectedMessage.replyNote}</p>
                </div>
              )}

              {/* Reply Form */}
              <form onSubmit={handleSendReply} className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">
                    ثبت پاسخ یا یادداشت اقدام پذیرش:
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sendSmsNotification}
                      onChange={(e) => setSendSmsNotification(e.target.checked)}
                      className="rounded text-[#2C5E8A] focus:ring-[#2C5E8A]"
                    />
                    <span>ارسال پیامک آنی به بیمار</span>
                  </label>
                </div>

                <textarea
                  rows={3}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="پاسخ به سوال بیمار یا توضیحات تماس جهت ثبت در سوابق..."
                  className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:border-[#2C5E8A] focus:ring-2 focus:ring-[#2C5E8A]/10 outline-none"
                />

                <div className="flex justify-end gap-2">
                  <button
                    type="submit"
                    disabled={!replyText.trim()}
                    className="px-5 py-2 rounded-xl bg-[#2C5E8A] hover:bg-[#234b6e] text-white text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>ثبت و ارسال پاسخ</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-xs">
              <Mail className="w-10 h-10 stroke-1 mb-2 text-slate-300" />
              <span>یک پیام را از لیست انتخاب کنید تا جزئیات نمایش داده شود</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
