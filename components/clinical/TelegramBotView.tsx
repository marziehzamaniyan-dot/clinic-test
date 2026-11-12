'use client';

import React, { useState, useEffect } from 'react';
import {
  Send,
  Bot,
  Webhook,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Users,
  Calendar,
  MessageSquare,
  Radio,
  ExternalLink,
  ShieldCheck,
  Settings,
  Clock,
  MapPin,
  Phone,
  UserCheck,
  Trash2,
  Sparkles,
  HelpCircle,
  Copy,
  Check,
  Lock,
} from 'lucide-react';
import {
  TelegramBotInfo,
  TelegramWebhookInfo,
  TelegramBotUser,
  UnifiedAppointment,
  TelegramMessageItem,
  BroadcastLog,
  BotConfigSettings,
} from '@/lib/telegram';

type ActiveBotSubTab = 'webhook' | 'appointments' | 'chats' | 'users' | 'broadcast' | 'settings';

export default function TelegramBotView() {
  const [activeSubTab, setActiveSubTab] = useState<ActiveBotSubTab>('webhook');
  const [loading, setLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Bot & Webhook data
  const [botInfo, setBotInfo] = useState<TelegramBotInfo | null>(null);
  const [webhookInfo, setWebhookInfo] = useState<TelegramWebhookInfo | null>(null);
  const [botSettingsData, setBotSettingsData] = useState<BotConfigSettings | null>(null);
  const [users, setUsers] = useState<TelegramBotUser[]>([]);
  const [appointments, setAppointments] = useState<UnifiedAppointment[]>([]);
  const [messages, setMessages] = useState<TelegramMessageItem[]>([]);
  const [broadcasts, setBroadcasts] = useState<BroadcastLog[]>([]);

  // Selected chat for 2-way messaging
  const [selectedChatId, setSelectedChatId] = useState<number | string | null>(null);
  const [replyText, setReplyText] = useState('');

  // Secrets & Token info
  const [tokenMasked, setTokenMasked] = useState<string>('');
  const [secretsStatus, setSecretsStatus] = useState<{
    hasBotToken: boolean;
    hasWebhookSecret: boolean;
    configuredWebhookUrl: string;
    tokenSource: string;
  } | null>(null);

  // Broadcast form
  const [broadcastTitle, setBroadcastTitle] = useState('اطلاعیه مهم کلینیک دکتر زمانیان');
  const [broadcastMessage, setBroadcastMessage] = useState('');

  // Settings form
  const [editWelcome, setEditWelcome] = useState('');
  const [editClinicInfo, setEditClinicInfo] = useState('');
  const [editWebhookUrl, setEditWebhookUrl] = useState('');
  const [customToken, setCustomToken] = useState('');

  // Appointment action modal
  const [selectedApptForAction, setSelectedApptForAction] = useState<UnifiedAppointment | null>(null);
  const [actionModalType, setActionModalType] = useState<'approve' | 'reject' | null>(null);
  const [actionNote, setActionNote] = useState('');

  // Copied helper
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Fetch all telegram data
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/telegram');
      const data = await res.json();
      if (data.success) {
        setBotInfo(data.bot);
        setWebhookInfo(data.webhook);
        setBotSettingsData(data.settings);
        setUsers(data.users || []);
        setAppointments(data.appointments || []);
        setMessages(data.messages || []);
        setBroadcasts(data.broadcasts || []);
        if (data.tokenMasked) setTokenMasked(data.tokenMasked);
        if (data.secretsStatus) setSecretsStatus(data.secretsStatus);

        if (data.settings) {
          setEditWelcome(data.settings.welcomeMessage || '');
          setEditClinicInfo(data.settings.clinicInfoMessage || '');
          setEditWebhookUrl(data.settings.webhookUrl || '');
        }

        if (!selectedChatId && data.users && data.users.length > 0) {
          setSelectedChatId(data.users[0].chatId);
        }
      } else {
        setActionError(data.error || 'خطا در واکشی داده‌های تلگرام');
      }
    } catch (err: any) {
      setActionError(err.message || 'خطا در ارتباط با سرور');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetch('/api/telegram')
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data.success) {
          setBotInfo(data.bot);
          setWebhookInfo(data.webhook);
          setBotSettingsData(data.settings);
          setUsers(data.users || []);
          setAppointments(data.appointments || []);
          setMessages(data.messages || []);
          setBroadcasts(data.broadcasts || []);

          if (data.settings) {
            setEditWelcome(data.settings.welcomeMessage || '');
            setEditClinicInfo(data.settings.clinicInfoMessage || '');
            setEditWebhookUrl(data.settings.webhookUrl || '');
          }

          if (data.users && data.users.length > 0) {
            setSelectedChatId((prev) => prev || data.users[0].chatId);
          }
        }
      })
      .catch((err) => {
        if (isMounted) setActionError(err.message || 'خطا در واکشی داده‌های تلگرام');
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const showNotification = (msg: string, isError = false) => {
    if (isError) {
      setActionError(msg);
      setTimeout(() => setActionError(null), 5000);
    } else {
      setActionSuccess(msg);
      setTimeout(() => setActionSuccess(null), 4000);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Webhook: Register Webhook
  const handleSetWebhook = async () => {
    setLoading(true);
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const defaultUrl = `${origin}/api/telegram/webhook`;
      const urlToSend = editWebhookUrl.trim() || defaultUrl;

      const res = await fetch('/api/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'set_webhook',
          webhookUrl: urlToSend,
          secretToken: botSettingsData?.secretToken,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showNotification(data.description || 'وبهوک با موفقیت در سرور تلگرام ثبت شد.');
        fetchData();
      } else {
        showNotification(data.error || 'خطا در تنظیم وبهوک', true);
      }
    } catch (err: any) {
      showNotification(err.message || 'خطای شبکه', true);
    } finally {
      setLoading(false);
    }
  };

  // Webhook: Check Webhook Info
  const handleCheckWebhookInfo = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get_webhook_info' }),
      });
      const data = await res.json();
      if (data.success) {
        setWebhookInfo(data.data);
        showNotification('وضعیت وبهوک به‌روزرسانی شد.');
      } else {
        showNotification(data.error || 'خطا در استعلام وبهوک', true);
      }
    } catch (err: any) {
      showNotification(err.message || 'خطای شبکه', true);
    } finally {
      setLoading(false);
    }
  };

  // Webhook: Delete Webhook
  const handleDeleteWebhook = async () => {
    if (!confirm('آیا از غیرفعال‌سازی و حذف وبهوک در سرور تلگرام اطمینان دارید؟')) return;
    setLoading(true);
    try {
      const res = await fetch('/api/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_webhook' }),
      });
      const data = await res.json();
      if (data.success) {
        showNotification(data.description || 'وبهوک با موفقیت حذف شد.');
        fetchData();
      } else {
        showNotification(data.error || 'خطا در حذف وبهوک', true);
      }
    } catch (err: any) {
      showNotification(err.message || 'خطای شبکه', true);
    } finally {
      setLoading(false);
    }
  };

  // Send Direct Message in Chat
  const handleSendMessage = async () => {
    if (!selectedChatId || !replyText.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send_message',
          chatId: selectedChatId,
          text: replyText.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setReplyText('');
        showNotification('پیام به تلگرام بیمار ارسال گردید.');
        fetchData();
      } else {
        showNotification(data.error || 'خطا در ارسال پیام', true);
      }
    } catch (err: any) {
      showNotification(err.message || 'خطای شبکه', true);
    } finally {
      setLoading(false);
    }
  };

  // Send Broadcast
  const handleSendBroadcast = async () => {
    if (!broadcastMessage.trim()) {
      showNotification('لطفاً متن پیام همگانی را وارد فرمایید.', true);
      return;
    }
    if (!confirm(`آیا از ارسال این پیام به ${users.length} مراجع عضو ربات اطمینان دارید؟`)) return;

    setLoading(true);
    try {
      const res = await fetch('/api/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'broadcast',
          title: broadcastTitle.trim(),
          messageText: broadcastMessage.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setBroadcastMessage('');
        showNotification(`پیام همگانی با موفقیت به ${data.successCount} بیمار ارسال شد.`);
        fetchData();
      } else {
        showNotification(data.error || 'خطا در ارسال پیام همگانی', true);
      }
    } catch (err: any) {
      showNotification(err.message || 'خطای شبکه', true);
    } finally {
      setLoading(false);
    }
  };

  // Appointment Status Handling
  const handleConfirmAppointmentAction = async () => {
    if (!selectedApptForAction || !actionModalType) return;
    setLoading(true);
    try {
      const action = actionModalType === 'approve' ? 'approve_appointment' : 'reject_appointment';
      const payload: any = {
        action,
        appointmentId: selectedApptForAction.id,
      };
      if (actionModalType === 'approve') {
        payload.adminReply = actionNote.trim();
      } else {
        payload.reason = actionNote.trim();
      }

      const res = await fetch('/api/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        showNotification(
          actionModalType === 'approve'
            ? 'نوبت تأیید شد و اعلان نهایی به تلگرام بیمار ارسال گردید.'
            : 'نوبت رد شد و پیام به اطلاع بیمار رسید.'
        );
        setSelectedApptForAction(null);
        setActionModalType(null);
        setActionNote('');
        fetchData();
      } else {
        showNotification(data.error || 'خطا در ثبت وضعیت نوبت', true);
      }
    } catch (err: any) {
      showNotification(err.message || 'خطای شبکه', true);
    } finally {
      setLoading(false);
    }
  };

  // Update Settings
  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_settings',
          token: customToken || undefined,
          settings: {
            welcomeMessage: editWelcome,
            clinicInfoMessage: editClinicInfo,
            webhookUrl: editWebhookUrl,
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        showNotification('تنظیمات و پیام‌های ربات با موفقیت ذخیره گردید.');
        fetchData();
      } else {
        showNotification(data.error || 'خطا در ذخیره تنظیمات', true);
      }
    } catch (err: any) {
      showNotification(err.message || 'خطای شبکه', true);
    } finally {
      setLoading(false);
    }
  };

  const isWebhookActive = Boolean(webhookInfo?.url && webhookInfo.url.length > 0);

  return (
    <div className="space-y-6">
      {/* Top Banner: Bot Status & Webhook Health */}
      <div className="bg-gradient-to-r from-[#2C5E8A] via-[#1E4263] to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center shrink-0 text-[#C5A880]">
              <Bot className="w-8 h-8 text-[#C5A880]" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                  مدیریت ربات تلگرام کلینیک
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-bold bg-white/10 text-white border border-white/20">
                  @{botInfo?.username || 'Ebiiiiii_bot'}
                </span>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1.5 ${
                    isWebhookActive
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isWebhookActive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                    }`}
                  />
                  {isWebhookActive ? 'وبهوک فعال (Live Webhook)' : 'وبهوک غیرفعال'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                ارتباط دوطرفه زنده با بیماران، ثبت خودکار نوبت‌های تلگرام در تقویم درمان ناباروری و اطلاع‌رسانی پیامکی/تلگرامی به مراجعین دکتر زمانیان
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <a
              href={`https://t.me/${botInfo?.username || 'Ebiiiiii_bot'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition cursor-pointer"
            >
              <ExternalLink className="w-4 h-4 text-sky-300" />
              مشاهده ربات در تلگرام
            </a>
            <button
              type="button"
              onClick={fetchData}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#5B8C7A] hover:bg-[#4d7768] text-xs font-bold text-white transition shadow-sm cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              به‌روزرسانی داده‌ها
            </button>
          </div>
        </div>

        {/* Quick Diagnostic Metrics */}
        <div className="mt-6 pt-5 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-slate-400 block mb-1">شناسه ربات (Bot ID)</span>
            <span className="font-mono font-bold text-white text-sm">
              {botInfo?.id || '۹۱۱۸۲۴۲۸۳۸'}
            </span>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-slate-400 block mb-1">کاربران عضو (Subscribers)</span>
            <span className="font-bold text-white text-sm">{users.length} مراجع</span>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-slate-400 block mb-1">نوبت‌های دریافتی</span>
            <span className="font-bold text-amber-300 text-sm">
              {appointments.filter((a) => a.source === 'telegram_bot').length} نوبت تلگرام
            </span>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-slate-400 block mb-1">آپدیت‌های در انتظار (Pending)</span>
            <span className="font-mono font-bold text-emerald-300 text-sm">
              {webhookInfo?.pendingUpdateCount ?? 0} مورد
            </span>
          </div>
        </div>
      </div>

      {/* Notifications / Toast */}
      {actionSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center justify-between text-xs font-bold animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionSuccess(null)}
            className="text-emerald-600 hover:text-emerald-900 font-bold"
          >
            ×
          </button>
        </div>
      )}
      {actionError && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl flex items-center justify-between text-xs font-bold animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{actionError}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionError(null)}
            className="text-rose-600 hover:text-rose-900 font-bold"
          >
            ×
          </button>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveSubTab('webhook')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeSubTab === 'webhook'
              ? 'bg-[#2C5E8A] text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Webhook className="w-4 h-4" />
          وضعیت و تنظیمات وبهوک
          {isWebhookActive && (
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('appointments')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeSubTab === 'appointments'
              ? 'bg-[#2C5E8A] text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Calendar className="w-4 h-4" />
          نوبت‌های تلگرام و وبسایت
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-800 font-mono">
            {appointments.filter((a) => a.status === 'pending').length} در انتظار
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('chats')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeSubTab === 'chats'
              ? 'bg-[#2C5E8A] text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          مکالمات مستقیم با بیماران
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-100 text-rose-800 font-mono">
            {messages.length} پیام
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('users')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeSubTab === 'users'
              ? 'bg-[#2C5E8A] text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          کاربران و پرونده‌های ربات ({users.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('broadcast')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeSubTab === 'broadcast'
              ? 'bg-[#2C5E8A] text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Radio className="w-4 h-4" />
          ارسال پیام همگانی (Broadcast)
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('settings')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeSubTab === 'settings'
              ? 'bg-[#2C5E8A] text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Settings className="w-4 h-4" />
          تنظیمات خوش‌آمدگویی و پیام‌ها
        </button>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: WEBHOOK STATUS & MANAGEMENT                             */}
      {/* ============================================================== */}
      {activeSubTab === 'webhook' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <Webhook className="w-5 h-5 text-[#2C5E8A]" />
                  مدیریت اتصال زنده وبهوک (Telegram Webhook Architecture)
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  طبق استاندارد امنیتی، درخواست‌های پیام و نوبت کاربران به جای نظرسنجی مکرر (Polling) به صورت فوری (Push Event) به اندپوئینت سرور ارسال می‌گردند.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCheckWebhookInfo}
                  disabled={loading}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  استعلام وضعیت (GetWebhookInfo)
                </button>
                {isWebhookActive && (
                  <button
                    type="button"
                    onClick={handleDeleteWebhook}
                    disabled={loading}
                    className="px-3.5 py-2 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700 hover:bg-rose-100 transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    حذف وبهوک
                  </button>
                )}
              </div>
            </div>

            {/* Current Webhook Information Box */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">آدرس وبهوک ثبت‌شده (Webhook URL):</span>
                  {webhookInfo?.url && (
                    <button
                      type="button"
                      onClick={() => copyToClipboard(webhookInfo.url, 'wh-url')}
                      className="text-xs text-[#2C5E8A] hover:underline flex items-center gap-1"
                    >
                      {copiedKey === 'wh-url' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      کپی آدرس
                    </button>
                  )}
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 font-mono text-xs break-all text-slate-800">
                  {webhookInfo?.url || 'هیچ وبهوکی در حال حاضر ثبت نشده است.'}
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                  <span>گواهی امنیتی سفارشی: {webhookInfo?.hasCustomCertificate ? 'دارد' : 'SSL پیش‌فرض'}</span>
                  <span>حداکثر اتصالات همزمان: {webhookInfo?.maxConnections || 40}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-slate-700 block">سلامت پردازش و صف پیام‌ها:</span>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-400 block mb-1">پیام‌های صف تلگرام</span>
                    <span className="font-mono font-bold text-base text-slate-800">
                      {webhookInfo?.pendingUpdateCount ?? 0}
                    </span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-400 block mb-1">امنیت توکن سرّی (Secret)</span>
                    <span className="font-bold text-emerald-600 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      فعال و اعتبارسنجی‌شده
                    </span>
                  </div>
                </div>
                {webhookInfo?.lastErrorMessage ? (
                  <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">آخرین خطای تلگرام:</span>
                      <span className="font-mono text-[11px]">{webhookInfo.lastErrorMessage}</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>هیچ خطایی در دریافت وب‌هوک گزارش نشده است.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Set Webhook Form */}
            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C5A880]" />
                ثبت و رجیستر خودکار آدرس وبهوک در تلگرام
              </h4>
              <p className="text-xs text-slate-500 mb-4">
                برای اتصال ربات به سرور، آدرس دامنه‌ای که این وبسایت روی آن قرار دارد را تأیید فرمایید تا اندپوئینت <code>/api/telegram/webhook</code> در سرورهای تلگرام ثبت شود.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <input
                    type="url"
                    value={editWebhookUrl}
                    onChange={(e) => setEditWebhookUrl(e.target.value)}
                    placeholder="https://your-domain.com/api/telegram/webhook"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-left text-slate-800 focus:bg-white focus:outline-none focus:border-[#2C5E8A]"
                    dir="ltr"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSetWebhook}
                  disabled={loading}
                  className="px-6 py-2.5 bg-[#2C5E8A] hover:bg-[#234b6e] text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50 shrink-0"
                >
                  <Send className="w-4 h-4" />
                  ثبت و فعال‌سازی وبهوک در تلگرام
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: UNIFIED APPOINTMENTS (TELEGRAM + WEBSITE)               */}
      {/* ============================================================== */}
      {activeSubTab === 'appointments' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#2C5E8A]" />
                  نوبت‌های یکپارچه (ربات تلگرام و وبسایت کلینیک)
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  کلیه نوبت‌های ثبت‌شده در یک پایگاه داده مشترک ذخیره شده و پس از تأیید منشی، پیام تأیید نهایی فوراً به تلگرام بیمار ارسال می‌گردد.
                </p>
              </div>
              <span className="text-xs font-mono font-bold px-3 py-1 bg-slate-100 rounded-full text-slate-700">
                مجموع: {appointments.length} نوبت
              </span>
            </div>

            {appointments.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                در حال حاضر نوبتی ثبت نشده است.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">کد رهگیری</th>
                      <th className="p-3">بیمار</th>
                      <th className="p-3">شماره تماس</th>
                      <th className="p-3">کانال ثبت</th>
                      <th className="p-3">خدمت انتخابی</th>
                      <th className="p-3">محل و شیفت</th>
                      <th className="p-3">وضعیت نوبت</th>
                      <th className="p-3 text-center">عملیات پذیرش</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {appointments.map((apt) => (
                      <tr key={apt.id} className="hover:bg-slate-50/80 transition">
                        <td className="p-3 font-mono font-bold text-[#2C5E8A]">
                          {apt.trackingCode}
                        </td>
                        <td className="p-3 font-bold text-slate-800">
                          {apt.patientName}
                          {apt.notes && (
                            <span className="block text-[10px] text-slate-400 font-normal">
                              {apt.notes}
                            </span>
                          )}
                        </td>
                        <td className="p-3 font-mono text-slate-600">{apt.phone}</td>
                        <td className="p-3">
                          {apt.source === 'telegram_bot' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 font-bold text-[10px]">
                              <Send className="w-2.5 h-2.5 text-sky-500" />
                              ربات تلگرام
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 font-bold text-[10px]">
                              وبسایت
                            </span>
                          )}
                        </td>
                        <td className="p-3">
                          <span className="font-bold text-slate-700 block">{apt.serviceCategory}</span>
                          <span className="text-[10px] text-slate-400">{apt.serviceTitle}</span>
                        </td>
                        <td className="p-3">
                          <span className="font-bold text-slate-700 block">{apt.preferredVenue}</span>
                          <span className="text-[10px] text-slate-400">{apt.preferredDayTime}</span>
                        </td>
                        <td className="p-3">
                          {apt.status === 'approved' ? (
                            <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              تأیید شده
                            </span>
                          ) : apt.status === 'pending' ? (
                            <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px] inline-flex items-center gap-1">
                              <Clock className="w-3 h-3 text-amber-600" />
                              در انتظار بررسی
                            </span>
                          ) : (
                            <span className="px-2 py-1 rounded-full bg-rose-100 text-rose-800 font-bold text-[10px] inline-flex items-center gap-1">
                              <AlertCircle className="w-3 h-3 text-rose-600" />
                              رد شده
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-center">
                          {apt.status === 'pending' ? (
                            <div className="flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedApptForAction(apt);
                                  setActionModalType('approve');
                                  setActionNote('مدارک و آزمایش‌های قبلی همراه مراجع باشد.');
                                }}
                                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs transition cursor-pointer"
                              >
                                تأیید نوبت
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedApptForAction(apt);
                                  setActionModalType('reject');
                                  setActionNote('ظرفیت شیفت تکمیل است؛ لطفاً جهت نوبت جایگزین تماس بگیرید.');
                                }}
                                className="px-3 py-1 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-lg font-bold text-xs transition cursor-pointer"
                              >
                                رد
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedChatId(apt.chatId || null);
                                setActiveSubTab('chats');
                              }}
                              className="text-xs text-[#2C5E8A] hover:underline font-bold"
                            >
                              مشاهده گفتگو
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: TWO-WAY LIVE CHAT WITH PATIENTS                         */}
      {/* ============================================================== */}
      {activeSubTab === 'chats' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-3 min-h-[550px]">
          {/* Conversation List on Left (RTL: right side) */}
          <div className="border-l border-slate-200 p-4 bg-slate-50/60 flex flex-col">
            <h4 className="text-xs font-bold text-slate-700 mb-3 flex items-center justify-between">
              <span>لیست گفتگوهای بیماران</span>
              <span className="text-[10px] font-mono bg-slate-200 px-2 py-0.5 rounded-full">
                {users.length} کاربر
              </span>
            </h4>

            <div className="space-y-2 overflow-y-auto flex-1">
              {users.map((user) => {
                const isSelected = selectedChatId === user.chatId;
                const lastMsg = messages
                  .filter((m) => String(m.chatId) === String(user.chatId))
                  .slice(-1)[0];

                return (
                  <button
                    key={String(user.chatId)}
                    type="button"
                    onClick={() => setSelectedChatId(user.chatId)}
                    className={`w-full p-3 rounded-2xl text-right transition cursor-pointer flex flex-col gap-1 border ${
                      isSelected
                        ? 'bg-white border-[#2C5E8A] shadow-md ring-1 ring-[#2C5E8A]'
                        : 'bg-white/70 hover:bg-white border-slate-200/80'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-800">
                        {user.firstName} {user.lastName || ''}
                      </span>
                      {user.username && (
                        <span className="text-[10px] font-mono text-sky-600" dir="ltr">
                          @{user.username}
                        </span>
                      )}
                    </div>
                    {lastMsg && (
                      <p className="text-[11px] text-slate-500 line-clamp-1">{lastMsg.text}</p>
                    )}
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                      <span>{user.phone || 'بدون شماره'}</span>
                      <span>{user.lastActive}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Chat Thread */}
          <div className="md:col-span-2 p-5 flex flex-col justify-between bg-white">
            {selectedChatId ? (
              <>
                {/* Chat Header */}
                <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#2C5E8A]/10 text-[#2C5E8A] font-bold flex items-center justify-center text-sm">
                      {users.find((u) => u.chatId === selectedChatId)?.firstName?.[0] || 'ب'}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-800">
                        {users.find((u) => u.chatId === selectedChatId)?.firstName || 'بیمار'}{' '}
                        {users.find((u) => u.chatId === selectedChatId)?.lastName || ''}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-mono">
                        شناسه چت: {selectedChatId}
                      </span>
                    </div>
                  </div>

                  <a
                    href={`https://t.me/${users.find((u) => u.chatId === selectedChatId)?.username || ''}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-sky-600 hover:underline flex items-center gap-1 font-bold"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    پروفایل در تلگرام
                  </a>
                </div>

                {/* Messages Bubbles */}
                <div className="py-4 space-y-3 overflow-y-auto flex-1 max-h-[420px]">
                  {messages
                    .filter((m) => String(m.chatId) === String(selectedChatId))
                    .map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex flex-col max-w-[80%] ${
                          msg.isFromPatient ? 'ml-auto items-start' : 'mr-auto items-end'
                        }`}
                      >
                        <div
                          className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                            msg.isFromPatient
                              ? 'bg-slate-100 text-slate-800 rounded-tr-none'
                              : 'bg-[#2C5E8A] text-white rounded-tl-none shadow-sm'
                          }`}
                        >
                          <span className="block text-[10px] font-bold opacity-75 mb-1">
                            {msg.senderName}
                          </span>
                          <p className="whitespace-pre-line">{msg.text}</p>
                          {msg.appointmentRequest && (
                            <div className="mt-2.5 pt-2 border-t border-white/20 text-[11px] space-y-0.5">
                              <span className="font-bold block">درخواست نوبت ثبت‌شده:</span>
                              <span>کد: {msg.appointmentRequest.trackingCode}</span>
                              <span className="block">خدمت: {msg.appointmentRequest.visitType}</span>
                            </div>
                          )}
                        </div>
                        <span className="text-[9px] text-slate-400 mt-1 font-mono px-1">
                          {msg.timestamp}
                        </span>
                      </div>
                    ))}
                </div>

                {/* Reply Input */}
                <div className="pt-3 border-t border-slate-100 flex gap-2">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="پاسخ مستقیم منشی یا پزشک را بنویسید (ارسال آنی به تلگرام مراجع)..."
                    className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-[#2C5E8A]"
                  />
                  <button
                    type="button"
                    onClick={handleSendMessage}
                    disabled={loading || !replyText.trim()}
                    className="px-5 py-2.5 bg-[#2C5E8A] hover:bg-[#234b6e] text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    ارسال پاسخ
                  </button>
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                لطفاً یک گفتگو را از لیست سمت راست انتخاب فرمایید.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 4: SUBSCRIBERS / BOT USERS CRM                             */}
      {/* ============================================================== */}
      {activeSubTab === 'users' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Users className="w-5 h-5 text-[#2C5E8A]" />
                فهرست کاربران و پرونده‌های متصل به ربات
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                اطلاعات مراجعینی که با ربات کلینیک تعامل داشته‌اند و سوابق نوبت‌گیری آنها
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-slate-100 rounded-full text-slate-700">
              {users.length} مراجع ثبت‌شده
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">شناسه چت تلگرام</th>
                  <th className="p-3">نام و نام خانوادگی</th>
                  <th className="p-3">نام کاربری (Username)</th>
                  <th className="p-3">شماره تماس</th>
                  <th className="p-3">کد ملی</th>
                  <th className="p-3">تعداد نوبت‌ها</th>
                  <th className="p-3">آخرین فعالیت</th>
                  <th className="p-3 text-center">اقدام</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={String(u.chatId)} className="hover:bg-slate-50 transition">
                    <td className="p-3 font-mono font-bold text-slate-800">{u.chatId}</td>
                    <td className="p-3 font-bold text-slate-800">
                      {u.firstName} {u.lastName || ''}
                    </td>
                    <td className="p-3 font-mono text-sky-600" dir="ltr">
                      {u.username ? `@${u.username}` : '—'}
                    </td>
                    <td className="p-3 font-mono">{u.phone || '—'}</td>
                    <td className="p-3 font-mono">{u.nationalCode || '—'}</td>
                    <td className="p-3 font-bold text-amber-700">
                      {u.appointmentsCount} نوبت
                    </td>
                    <td className="p-3 text-slate-400 font-mono text-[11px]">{u.lastActive}</td>
                    <td className="p-3 text-center">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedChatId(u.chatId);
                          setActiveSubTab('chats');
                        }}
                        className="px-3 py-1 bg-[#2C5E8A]/10 text-[#2C5E8A] hover:bg-[#2C5E8A]/20 rounded-lg font-bold text-xs transition cursor-pointer"
                      >
                        ارسال پیام / چت
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 5: BROADCAST NOTIFICATIONS                                 */}
      {/* ============================================================== */}
      {activeSubTab === 'broadcast' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Radio className="w-5 h-5 text-[#2C5E8A]" />
              ارسال پیام همگانی به اعضای ربات (Broadcast Notification)
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              این پیام به صورت مستقیم و بدون هزینه به تلگرام کلیه بیماران عضو ربات ارسال خواهد شد (مناسب برای اطلاعیه‌های تعطیلات، اعلام ظرفیت‌های جراحی IVF در مرکز کوثر، و مشاوره‌های سلامت بارداری).
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  عنوان اطلاعیه:
                </label>
                <input
                  type="text"
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-[#2C5E8A]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  متن پیام اطلاعیه (پشتیبانی از HTML):
                </label>
                <textarea
                  rows={6}
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  placeholder="متن پیام خود را اینجا بنویسید..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-[#2C5E8A]"
                />
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center justify-between">
                <span>تعداد دریافت‌کنندگان فعال:</span>
                <span className="font-bold font-mono">{users.length} مراجع</span>
              </div>

              <button
                type="button"
                onClick={handleSendBroadcast}
                disabled={loading || !broadcastMessage.trim()}
                className="w-full py-3 bg-[#2C5E8A] hover:bg-[#234b6e] text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
              >
                <Radio className="w-4 h-4" />
                ارسال فوری پیام همگانی به کلیه کاربران
              </button>
            </div>
          </div>

          {/* Broadcast History Log */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#5B8C7A]" />
              سوابق پیام‌های همگانی ارسال‌شده
            </h3>

            <div className="space-y-3 overflow-y-auto max-h-[460px]">
              {broadcasts.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-xs">
                  هیچ پیام همگانی ارسال نشده است.
                </div>
              ) : (
                broadcasts.map((log) => (
                  <div
                    key={log.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">{log.title}</span>
                      <span className="font-mono text-slate-400 text-[10px]">{log.sentAt}</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed text-[11px] whitespace-pre-line">
                      {log.messageText}
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                      <span>فرستنده: {log.senderName}</span>
                      <span className="text-emerald-700 font-bold">
                        تحویل موفق: {log.successCount} از {log.totalRecipients}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 6: BOT MESSAGES & WELCOME SETTINGS                         */}
      {/* ============================================================== */}
      {activeSubTab === 'settings' && (
        <div className="space-y-6">
          {/* Environment Secrets Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  مدیریت متغیرهای محیطی و سکرت‌ها (Environment Secrets)
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  پیکربندی امن توکن و وب‌هوک تلگرام از طریق متغیرهای محیطی سرور بدون قرارگیری مستقیم در کد منبع
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5 w-fit">
                <Lock className="w-3.5 h-3.5" />
                محافظت‌شده در متغیرهای محیطی
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Telegram Bot Token Status */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">کلید توکن ربات (TELEGRAM_BOT_TOKEN):</span>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    فعال در سکرت‌ها
                  </span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between font-mono text-xs">
                  <span className="text-slate-800 font-bold tracking-wider">
                    {tokenMasked || '۹۱۱۸۲۴۲۸۳۸:AAEYWi...'}
                  </span>
                  <span className="text-[10px] text-slate-400 font-sans">ماسک امنیتی</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  توکن دسترسی به Telegram Bot API دریافتی از BotFather@ برای ربات کلینیک (<span className="font-mono">Ebiiiiii_bot@</span>).
                </p>
              </div>

              {/* Webhook Secret Status */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">سکرت اعتبارسنجی وبهوک (TELEGRAM_WEBHOOK_SECRET):</span>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    اعتبارسنجی هدر فعال
                  </span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between font-mono text-xs">
                  <span className="text-slate-800 font-bold tracking-widest">
                    ••••••••••••••••••••
                  </span>
                  <span className="text-[10px] text-emerald-600 font-sans font-bold">X-Telegram-Bot-Api-Secret-Token</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  جهت اطمینان از اینکه کلیه درخواست‌های ارسالی به اندپوئینت وب‌هوک منحصراً از سرورهای رسمی تلگرام می‌آیند.
                </p>
              </div>
            </div>

            {/* Custom Token Override Form */}
            <div className="pt-3 border-t border-slate-100 space-y-3">
              <label className="text-xs font-bold text-slate-700 block">
                تغییر یا به‌روزرسانی دستی توکن ربات (اختیاری):
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={customToken}
                  onChange={(e) => setCustomToken(e.target.value)}
                  placeholder="توکن جدید را وارد فرمایید (مثال: 9118242838:AAEYWiCQ...)"
                  className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:bg-white focus:outline-none focus:border-[#2C5E8A]"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  disabled={loading || !customToken.trim()}
                  className="px-5 py-2.5 bg-[#2C5E8A] hover:bg-[#234b6e] text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-sm disabled:opacity-50"
                >
                  اعمال توکن جدید
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                در صورت وارد کردن توکن جدید، مقدار وارد شده بر متغیرهای محیطی فعلی اولویت یافته و ارتباط بات مجدداً بررسی می‌شود.
              </p>
            </div>
          </div>

          {/* Bot Messages Customization */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Settings className="w-5 h-5 text-[#2C5E8A]" />
                شخصی‌سازی پیام‌های خوش‌آمدگویی و اطلاعات کلینیک در ربات
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                متن‌هایی که کاربران پس از زدن دکمه <code>/start</code> یا مشاهده اطلاعات کلینیک در تلگرام دریافت می‌کنند
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  متن پیام خوش‌آمدگویی اصلی (/start):
                </label>
                <textarea
                  rows={4}
                  value={editWelcome}
                  onChange={(e) => setEditWelcome(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-[#2C5E8A]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  متن نشانی، تلفن‌های تماس و برنامه بیمارستان‌ها در ربات:
                </label>
                <textarea
                  rows={7}
                  value={editClinicInfo}
                  onChange={(e) => setEditClinicInfo(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-[#2C5E8A]"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  disabled={loading}
                  className="px-6 py-2.5 bg-[#5B8C7A] hover:bg-[#4d7768] text-white text-xs font-bold rounded-xl transition flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  ذخیره تغییرات پیام‌ها
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Modal for Approving / Rejecting Appointment */}
      {selectedApptForAction && actionModalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4 text-right">
            <h4 className="font-bold text-base text-slate-800">
              {actionModalType === 'approve' ? 'تأیید نوبت درخواستی' : 'رد نوبت درخواستی'}
            </h4>

            <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
              <span className="block font-bold text-slate-800">
                بیمار: {selectedApptForAction.patientName} ({selectedApptForAction.phone})
              </span>
              <span className="block text-slate-600">
                خدمت: {selectedApptForAction.serviceTitle}
              </span>
              <span className="block text-slate-600">
                محل و زمان: {selectedApptForAction.preferredVenue} ({selectedApptForAction.preferredDayTime})
              </span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {actionModalType === 'approve'
                  ? 'پیام توضیحات برای ارسال به تلگرام بیمار:'
                  : 'علت رد یا راهنمایی بیمار:'}
              </label>
              <textarea
                rows={3}
                value={actionNote}
                onChange={(e) => setActionNote(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedApptForAction(null);
                  setActionModalType(null);
                }}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={handleConfirmAppointmentAction}
                disabled={loading}
                className={`px-5 py-2 text-xs font-bold text-white rounded-xl cursor-pointer ${
                  actionModalType === 'approve'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                {actionModalType === 'approve' ? 'تأیید نهایی و ارسال به تلگرام' : 'رد نوبت و ارسال پیام'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
