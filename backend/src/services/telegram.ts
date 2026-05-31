// Minimal wrapper around the Telegram Bot API sendMessage endpoint.
// Requires TELEGRAM_BOT_TOKEN env var. If absent, sendMessage is a no-op
// (logs a warning once) so dev environments without the token still boot.

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
let warnedMissingToken = false;

export interface SendMessageResult {
  ok: boolean;
  // True for permanent failures (bad chat_id, bot blocked) — caller should
  // stop retrying. False for transient errors (network, rate limit, 5xx).
  permanentFailure: boolean;
  error?: string;
}

export async function sendTelegramMessage(
  chatId: string,
  text: string,
): Promise<SendMessageResult> {
  if (!TOKEN) {
    if (!warnedMissingToken) {
      console.warn('[telegram] TELEGRAM_BOT_TOKEN not set — reminder sending disabled');
      warnedMissingToken = true;
    }
    return { ok: false, permanentFailure: false, error: 'no_token' };
  }

  // Telegram chat IDs are integers; reject identities we know aren't a chat
  // (google_*, phantom_*, anon_*) so we don't waste API calls.
  if (!/^-?\d+$/.test(chatId)) {
    return { ok: false, permanentFailure: true, error: 'non_telegram_id' };
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });

    if (res.ok) return { ok: true, permanentFailure: false };

    // 400 = bad chat_id / blocked bot, 403 = user blocked / kicked.
    // Both are unrecoverable for this chat_id — don't retry.
    if (res.status === 400 || res.status === 403) {
      const body = await res.text().catch(() => '');
      return { ok: false, permanentFailure: true, error: `${res.status}: ${body.slice(0, 200)}` };
    }
    return { ok: false, permanentFailure: false, error: `http_${res.status}` };
  } catch (err: any) {
    return { ok: false, permanentFailure: false, error: err?.message || 'network_error' };
  }
}
