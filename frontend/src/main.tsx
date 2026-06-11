import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import telegramAnalytics from '@telegram-apps/analytics'
import './index.css'
import App from './App.tsx'

// ─── Telegram Mini App Analytics ──────────────────────────────────────────
// Initialise only when running inside a Telegram Mini App AND a token has
// been provided. Required for listing in the Telegram App Center.
//
// Token & app identifier come from @DataChief_bot on Telegram — open that bot,
// register the app, and paste the token into Railway as VITE_TG_ANALYTICS_TOKEN.
const tgAnalyticsToken = import.meta.env.VITE_TG_ANALYTICS_TOKEN as string | undefined;
const tgAnalyticsAppName = (import.meta.env.VITE_TG_ANALYTICS_APP_NAME as string | undefined) || 'lexon';

if (tgAnalyticsToken && window.Telegram?.WebApp?.initData) {
  try {
    telegramAnalytics.init({
      token: tgAnalyticsToken,
      appName: tgAnalyticsAppName,
    });
  } catch (err) {
    // Analytics failure must never block the app from loading.
    console.warn('[tg-analytics] init failed:', err);
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
