import { Router, Request, Response } from 'express';
import { analyzeWithClaude } from '../services/claude';
import { createSession } from '../services/payment';
import { AnalyzeRequest, AnalyzeResponse } from '../../../shared/types';

const router = Router();

const rateLimitMap = new Map<string, number[]>();
const MAX_REQUESTS = 5;
const WINDOW_MS = 60 * 60 * 1000;

function checkRateLimit(telegramId: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(telegramId) || [];
  const recent = timestamps.filter((t) => now - t < WINDOW_MS);
  rateLimitMap.set(telegramId, recent);
  return recent.length < MAX_REQUESTS;
}

router.post('/', async (req: Request, res: Response): Promise<void> => {
  const { toolId, input, telegramId, fileData, fileType, fileName } = req.body as AnalyzeRequest;

  if (!toolId || !input || !telegramId) {
    res.status(400).json({ error: 'Missing required fields: toolId, input, telegramId' });
    return;
  }

  if (!checkRateLimit(telegramId)) {
    res.status(429).json({ error: 'Rate limit exceeded. Max 5 analyses per hour.' });
    return;
  }

  const timestamps = rateLimitMap.get(telegramId) || [];
  timestamps.push(Date.now());
  rateLimitMap.set(telegramId, timestamps);

  try {
    const attachment = fileData && fileType ? { fileData, fileType, fileName } : undefined;
    const result = await analyzeWithClaude(toolId, input, attachment);

    const inputSummary = input.slice(0, 200);
    const sessionToken = createSession(telegramId, toolId, inputSummary, result.teaser, result.full);

    const response: AnalyzeResponse = {
      teaser: result.teaser,
      sessionToken,
    };

    res.json(response);
  } catch (err) {
    console.error('Analysis error:', err);
    res.status(500).json({ error: 'Analysis failed. Please try again.' });
  }
});

export default router;
