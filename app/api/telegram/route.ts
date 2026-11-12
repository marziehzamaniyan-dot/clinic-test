import { NextRequest, NextResponse } from 'next/server';
import {
  fetchBotMe,
  getTelegramWebhookInfo,
  setTelegramWebhook,
  deleteTelegramWebhook,
  sendTelegramDirectMessage,
  broadcastTelegramMessage,
  getStoredTelegramMessages,
  getStoredBotUsers,
  getUnifiedAppointments,
  getBroadcastLogs,
  approveUnifiedAppointment,
  rejectUnifiedAppointment,
  botSettings,
  updateBotSettings,
  getBotToken,
  setBotToken,
  processWebhookUpdate,
} from '@/lib/telegram';

export async function GET() {
  try {
    const [botInfoRes, webhookInfoRes] = await Promise.all([
      fetchBotMe(),
      getTelegramWebhookInfo(),
    ]);

    const users = getStoredBotUsers();
    const appointments = getUnifiedAppointments();
    const messages = getStoredTelegramMessages();
    const broadcasts = getBroadcastLogs();

    return NextResponse.json({
      success: true,
      bot: botInfoRes.data || null,
      botError: botInfoRes.error || null,
      webhook: webhookInfoRes.data || null,
      webhookError: webhookInfoRes.error || null,
      tokenMasked: getBotToken() ? `${getBotToken().substring(0, 10)}...` : '',
      settings: botSettings,
      users,
      appointments,
      messages,
      broadcasts,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'خطا در واکشی اطلاعات ربات تلگرام' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    // 1. Webhook: Register Webhook
    if (action === 'set_webhook') {
      const { webhookUrl, secretToken } = body;
      const targetUrl = webhookUrl || botSettings.webhookUrl || `${req.nextUrl.origin}/api/telegram/webhook`;
      const res = await setTelegramWebhook(targetUrl, secretToken);
      const updatedInfo = await getTelegramWebhookInfo();
      return NextResponse.json({ ...res, webhookInfo: updatedInfo.data });
    }

    // 2. Webhook: Get Live Info
    if (action === 'get_webhook_info') {
      const res = await getTelegramWebhookInfo();
      return NextResponse.json(res);
    }

    // 3. Webhook: Delete Webhook
    if (action === 'delete_webhook') {
      const res = await deleteTelegramWebhook();
      const updatedInfo = await getTelegramWebhookInfo();
      return NextResponse.json({ ...res, webhookInfo: updatedInfo.data });
    }

    // 4. Send Direct Message to Patient
    if (action === 'send_message') {
      const { chatId, text } = body;
      if (!chatId || !text) {
        return NextResponse.json({ error: 'شناسه چت و متن پیام الزامی است.' }, { status: 400 });
      }
      const res = await sendTelegramDirectMessage(chatId, text);
      return NextResponse.json(res);
    }

    // 5. Broadcast Message to All Bot Subscribers
    if (action === 'broadcast') {
      const { messageText, title } = body;
      if (!messageText || !messageText.trim()) {
        return NextResponse.json({ error: 'متن پیام همگانی الزامی است.' }, { status: 400 });
      }
      const res = await broadcastTelegramMessage(messageText.trim(), title || 'پیام همگانی کلینیک');
      return NextResponse.json(res);
    }

    // 6. Approve Appointment & Auto-Notify Patient
    if (action === 'approve_appointment') {
      const { appointmentId, adminReply } = body;
      if (!appointmentId) {
        return NextResponse.json({ error: 'شناسه نوبت الزامی است.' }, { status: 400 });
      }
      const res = approveUnifiedAppointment(appointmentId, adminReply);
      return NextResponse.json(res);
    }

    // 7. Reject Appointment & Send Reason to Patient
    if (action === 'reject_appointment') {
      const { appointmentId, reason } = body;
      if (!appointmentId) {
        return NextResponse.json({ error: 'شناسه نوبت الزامی است.' }, { status: 400 });
      }
      const res = rejectUnifiedAppointment(appointmentId, reason);
      return NextResponse.json(res);
    }

    // 8. Update Bot Settings & Welcome Messages
    if (action === 'update_settings') {
      const { settings, token } = body;
      if (token && token.trim()) {
        setBotToken(token.trim());
      }
      if (settings) {
        updateBotSettings(settings);
      }
      const botInfo = await fetchBotMe();
      return NextResponse.json({ success: true, settings: botSettings, bot: botInfo.data });
    }

    // 9. Simulate Incoming Webhook (for testing interactive flow inside panel)
    if (action === 'simulate_incoming') {
      const { update } = body;
      if (update) {
        await processWebhookUpdate(update);
        return NextResponse.json({ success: true, message: 'پیام تستی با موفقیت شبیه‌سازی و پردازش شد.' });
      }
      return NextResponse.json({ error: 'شیء آپدیت الزامی است.' }, { status: 400 });
    }

    return NextResponse.json({ error: 'عملیات نامعتبر است.' }, { status: 400 });
  } catch (err: any) {
    console.error('[Admin Telegram API Error]:', err);
    return NextResponse.json({ error: err.message || 'خطای سرور' }, { status: 500 });
  }
}
