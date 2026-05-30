import { Router, Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

// ─── Augment Express.User with our profile shape ─────────────────────────────
declare global {
  namespace Express {
    interface User {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    }
  }
}

// ─── Passport config ──────────────────────────────────────────────────────────
const APP_URL = process.env.APP_URL || 'http://localhost:3001';
const googleConfigured =
  Boolean(process.env.GOOGLE_CLIENT_ID) &&
  Boolean(process.env.GOOGLE_CLIENT_SECRET);

// Only register Google Strategy when credentials are actually present.
// Without this guard, passport throws at boot time if the env vars are empty.
if (googleConfigured) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: `${APP_URL}/auth/google/callback`,
      },
      (_accessToken, _refreshToken, profile, done) => {
        const user: Express.User = {
          id: `google_${profile.id}`,
          firstName: profile.name?.givenName || profile.displayName || 'User',
          lastName: profile.name?.familyName || '',
          email: profile.emails?.[0]?.value || '',
        };
        return done(null, user);
      }
    )
  );
}

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user: Express.User, done) => done(null, user));

// ─── Middleware: require Google to be configured ──────────────────────────────
function requireGoogleConfig(req: Request, res: Response, next: NextFunction): void {
  if (!googleConfigured) {
    res.status(503).json({
      error: 'Google OAuth not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in Railway.',
    });
    return;
  }
  next();
}

// ─── Routes ───────────────────────────────────────────────────────────────────
const router = Router();

/** Kick off Google OAuth */
router.get(
  '/google',
  requireGoogleConfig,
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

/** Google callback — sets session cookie, redirects to SPA root */
router.get(
  '/google/callback',
  requireGoogleConfig,
  passport.authenticate('google', { failureRedirect: '/?auth=failed' }),
  (_req, res) => {
    res.redirect('/?auth=success');
  }
);

/** Session check — frontend polls this on load to resume an authenticated session */
router.get('/me', (req, res) => {
  if (req.isAuthenticated?.()) {
    res.json(req.user);
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

/** Sign out */
router.post('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.json({ ok: true });
  });
});

export default router;
