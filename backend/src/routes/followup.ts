import { Router, Request, Response } from 'express';
import Anthropic from '@anthropic-ai/sdk';

const router = Router();
const client = new Anthropic();

// ─── Per-user rate limit (separate from analyze limit) ─────────────────────
// More generous: follow-ups are cheap and free for the user.

const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_PER_WINDOW = 15;
const followUpLog = new Map<string, number[]>();

setInterval(() => {
  const cutoff = Date.now() - WINDOW_MS;
  for (const [id, ts] of followUpLog) {
    const fresh = ts.filter(t => t > cutoff);
    if (fresh.length === 0) followUpLog.delete(id);
    else followUpLog.set(id, fresh);
  }
}, 30 * 60 * 1000);

function checkLimit(telegramId: string): { allowed: boolean; retryAfterMs?: number } {
  const now = Date.now();
  const cutoff = now - WINDOW_MS;
  const ts = (followUpLog.get(telegramId) || []).filter(t => t > cutoff);

  if (ts.length >= MAX_PER_WINDOW) {
    return { allowed: false, retryAfterMs: WINDOW_MS - (now - Math.min(...ts)) };
  }
  ts.push(now);
  followUpLog.set(telegramId, ts);
  return { allowed: true };
}

// ─── Language map (same as claude.ts) ──────────────────────────────────────
const LANGUAGE_MAP: Record<string, string> = {
  ro: 'Romanian', ru: 'Russian', es: 'Spanish', ar: 'Arabic', fr: 'French',
  de: 'German', pt: 'Portuguese', it: 'Italian', tr: 'Turkish', uk: 'Ukrainian',
  pl: 'Polish', zh: 'Chinese', nl: 'Dutch', sv: 'Swedish', fi: 'Finnish',
  no: 'Norwegian', da: 'Danish', cs: 'Czech', sk: 'Slovak', hu: 'Hungarian',
  el: 'Greek', bg: 'Bulgarian', hr: 'Croatian', sr: 'Serbian', id: 'Indonesian',
  ms: 'Malay', hi: 'Hindi', bn: 'Bengali', ja: 'Japanese', ko: 'Korean',
  vi: 'Vietnamese', th: 'Thai', fa: 'Persian', he: 'Hebrew',
};

// ─── Route ──────────────────────────────────────────────────────────────────

router.post('/', async (req: Request, res: Response): Promise<void> => {
  const { fullResult, question, telegramId, languageCode } = req.body as {
    fullResult: string;
    question: string;
    telegramId: string;
    languageCode?: string;
  };

  // 1. Validate
  if (!fullResult || !question || !telegramId) {
    res.status(400).json({ error: 'Missing required fields.' });
    return;
  }
  const q = question.trim();
  if (q.length < 3) {
    res.status(400).json({ error: 'Question is too short.' });
    return;
  }
  if (q.length > 600) {
    res.status(400).json({ error: 'Question too long (max 600 characters).' });
    return;
  }

  // 2. Rate limit
  const limit = checkLimit(telegramId);
  if (!limit.allowed) {
    const mins = Math.ceil((limit.retryAfterMs ?? WINDOW_MS) / 60_000);
    res.status(429).json({
      error: `Follow-up limit reached. Try again in ${mins} minute${mins !== 1 ? 's' : ''}.`,
    });
    return;
  }

  // 3. Language instruction (mirrors claude.ts behaviour)
  const lang = languageCode?.toLowerCase().split('-')[0] ?? 'en';
  const langName = LANGUAGE_MAP[lang];
  const langInstruction = langName
    ? ` Answer in ${langName}.`
    : '';

  // 4. Call Claude — small, focused prompt; no JSON structure needed
  try {
    const prompt =
      `You are a legal assistant. The user received this legal analysis:\n\n` +
      `${fullResult}\n\n` +
      `---\n\n` +
      `Answer the user's follow-up question based on the analysis above. ` +
      `Be concise (2–5 sentences unless more is truly needed). ` +
      `Use plain language. Do not repeat the analysis back to the user. ` +
      `If the question is outside the analysis, answer from general legal knowledge and note that.` +
      langInstruction +
      `\n\nQuestion: ${q}`;

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });

    const textBlock = response.content.find(b => b.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      throw new Error('Unexpected response from Claude');
    }

    res.json({ answer: textBlock.text.trim() });
  } catch (err) {
    console.error('Follow-up error:', err);
    res.status(500).json({ error: 'Failed to answer. Please try again.' });
  }
});

export default router;
