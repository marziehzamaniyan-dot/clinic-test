import { NextRequest, NextResponse } from 'next/server';
import { processWebhookUpdate, botSettings } from '@/lib/telegram';

/**
 * Telegram Webhook Handler Route
 * Receives live updates from Telegram Bot API via Webhook (POST)
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Verify Secret Token header if configured
    const secretHeader = req.headers.get('x-telegram-bot-api-secret-token');
    const configuredSecret = process.env.TELEGRAM_WEBHOOK_SECRET || botSettings.secretToken;

    if (configuredSecret && secretHeader && secretHeader !== configuredSecret) {
      console.warn('[Telegram Webhook] Unauthorized request - secret mismatch.');
      return NextResponse.json({ error: 'Unauthorized secret token' }, { status: 401 });
    }

    // 2. Parse Telegram Update Payload
    const update = await req.json();

    if (!update || (!update.message && !update.callback_query)) {
      return NextResponse.json({ ok: true, ignored: true });
    }

    // 3. Process the update (Message or Inline Keyboard callback)
    await processWebhookUpdate(update);

    // 4. Return 200 OK immediately as required by Telegram Webhook spec
    return NextResponse.json({ ok: true, processedUpdateId: update.update_id });
  } catch (error: any) {
    console.error('[Telegram Webhook Error]:', error);
    // Returning 200 OK even on partial error prevents Telegram from retrying endlessly
    return NextResponse.json({ ok: false, error: error.message }, { status: 200 });
  }
}

/**
 * Health check & status endpoint for Webhook diagnostics
 */
export async function GET() {
  return NextResponse.json({
    service: 'Dr. Marzieh Zamanian Clinic - Telegram Webhook Engine',
    status: 'online',
    timestamp: new Date().toISOString(),
    webhookEndpoint: '/api/telegram/webhook',
    security: {
      secretTokenConfigured: Boolean(process.env.TELEGRAM_WEBHOOK_SECRET || botSettings.secretToken),
    },
  });
}
