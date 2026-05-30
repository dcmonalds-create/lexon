import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import session from 'express-session';
import passport from 'passport';
import rateLimit from 'express-rate-limit';
import analyzeRouter from './routes/analyze';
import unlockRouter from './routes/unlock';
import historyRouter from './routes/history';
import followUpRouter from './routes/followup';
import solanaUnlockRouter from './routes/solana-unlock';
import authRouter from './routes/auth';

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);

// Trust Railway/proxy headers so req.ip reflects the real client IP
app.set('trust proxy', 1);

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '25mb' }));

// ─── Session (needed for Google OAuth) ────────────────────────────────────────
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'lexon-dev-secret-change-in-prod',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax',   // required for OAuth redirect cookies to survive cross-origin hops
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// ─── IP-based rate limits ──────────────────────────────────────────────────

// Analyze endpoint: max 10 requests per IP per hour
const analyzeIpLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  keyGenerator: (req) => {
    const forwarded = req.headers['x-forwarded-for'];
    const ip = typeof forwarded === 'string'
      ? forwarded.split(',')[0].trim()
      : req.ip || 'unknown';
    return ip;
  },
  handler: (_req, res) => {
    res.status(429).json({
      error: 'Too many requests from your network. Max 10 per hour per IP.',
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Global hard ceiling: max 200 requests per minute across ALL IPs
const globalLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 200,
  handler: (_req, res) => {
    res.status(429).json({ error: 'Server is busy. Please try again shortly.' });
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ─── Routes ───────────────────────────────────────────────────────────────────

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'lexon-backend' });
});

app.use('/api/analyze', globalLimit, analyzeIpLimit, analyzeRouter);
app.use('/api/unlock', unlockRouter);
app.use('/api/history', historyRouter);
app.use('/api/followup', globalLimit, followUpRouter);
app.use('/api/solana-unlock', globalLimit, solanaUnlockRouter);
app.use('/auth', authRouter);

// ─── Frontend static build ────────────────────────────────────────────────────
const frontendDist = path.join(__dirname, '../../../../frontend/dist');
app.use(express.static(frontendDist));
app.get('*', (_req, res) => {
  res.sendFile(path.join(frontendDist, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`LexOn running on port ${PORT}`);
});
