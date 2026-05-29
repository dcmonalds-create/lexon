import { Router, Request, Response } from 'express';
import { analyzeWithClaude } from '../services/claude';
import { createSession } from '../services/payment';
import { AnalyzeRequest, AnalyzeResponse } from '../../../shared/types';

const router = Router();

// ─── PDF page cap ─────────────────────────────────────────────────────────

const MAX_PDF_PAGES = 15;

/**
 * Counts PDF pages by scanning the decoded binary for /Type /Page markers.
 * No extra dependency needed — works for all standard PDF files.
 * Falls back to 1 if the structure can't be parsed (better to allow than block).
 */
function countPdfPages(base64Data: string): number {
  try {
    const buffer = Buffer.from(base64Data, 'base64');
    const text = buffer.toString('latin1');
    // Match /Type /Page but NOT /Type /Pages (the parent catalog node)
    const matches = text.match(/\/Type\s*\/Page(?!s)/g);
    return matches ? matches.length : 1;
  } catch {
    return 1;
  }
}

// ─── Per-user rate limit ───────────────────────────────────────────────────

const MAX_REQUESTS_PER_WINDOW = 5;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

// Map<telegramId, timestamp[]>
const userRequestLog = new Map<string, number[]>();

// Purge stale entries every 30 minutes to prevent memory leak
setInterval(() => {
  const cutoff = Date.now() - WINDOW_MS;
  for (const [id, timestamps] of userRequestLog) {
    const fresh = timestamps.filter((t) => t > cutoff);
    if (fresh.length === 0) {
      userRequestLog.delete(id);
    } else {
      userRequestLog.set(id, fresh);
    }
  }
}, 30 * 60 * 1000);

/**
 * Returns { allowed: true } or { allowed: false, retryAfterMs: number }.
 * Records the request if allowed.
 */
function checkAndRecordUserLimit(telegramId: string): { allowed: boolean; retryAfterMs?: number } {
  const now = Date.now();
  const cutoff = now - WINDOW_MS;
  const timestamps = (userRequestLog.get(telegramId) || []).filter((t) => t > cutoff);

  if (timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    // Tell the client when the oldest request will expire
    const oldestInWindow = Math.min(...timestamps);
    const retryAfterMs = WINDOW_MS - (now - oldestInWindow);
    return { allowed: false, retryAfterMs };
  }

  timestamps.push(now);
  userRequestLog.set(telegramId, timestamps);
  return { allowed: true };
}

// ─── Route ─────────────────────────────────────────────────────────────────

router.post('/', async (req: Request, res: Response): Promise<void> => {
  const { toolId, input, telegramId, fileData, fileType, fileName } =
    req.body as AnalyzeRequest;

  // 1. Validate required fields
  if (!toolId || !input || !telegramId) {
    res.status(400).json({
      error: 'Missing required fields: toolId, input, telegramId',
    });
    return;
  }

  // 2. Per-user rate limit (5 analyses per hour per telegramId)
  const limitCheck = checkAndRecordUserLimit(telegramId);
  if (!limitCheck.allowed) {
    const minutesLeft = Math.ceil((limitCheck.retryAfterMs ?? WINDOW_MS) / 60_000);
    res.status(429).json({
      error: `Limit reached: 5 analyses per hour. Try again in ${minutesLeft} minute${minutesLeft !== 1 ? 's' : ''}.`,
    });
    return;
  }

  // 3. PDF page cap — reject before calling Claude to avoid large costs
  if (fileData && fileType === 'application/pdf') {
    const pageCount = countPdfPages(fileData);
    if (pageCount > MAX_PDF_PAGES) {
      res.status(400).json({
        error: `PDF has ${pageCount} pages — maximum is ${MAX_PDF_PAGES}. Please upload only the relevant pages.`,
      });
      return;
    }
  }

  // 4. Run analysis
  try {
    const attachment = fileData && fileType
      ? { fileData, fileType, fileName }
      : undefined;

    const result = await analyzeWithClaude(toolId, input, attachment);

    const sessionToken = createSession(
      telegramId,
      toolId,
      input.slice(0, 200),
      result.teaser,
      result.full
    );

    const response: AnalyzeResponse = { teaser: result.teaser, sessionToken };
    res.json(response);
  } catch (err) {
    console.error('Analysis error:', err);
    res.status(500).json({ error: 'Analysis failed. Please try again.' });
  }
});

export default router;
