import axios from 'axios';
import { load } from 'cheerio';

const MAX_CHARS = 40_000;
const FETCH_TIMEOUT_MS = 12_000;

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

// Common ToS path suffixes to try when user gives a homepage URL
const TOS_PATH_CANDIDATES = [
  '/terms-of-service',
  '/terms',
  '/tos',
  '/terms-of-use',
  '/legal/terms',
  '/legal',
  '/en/terms',
  '/policies/terms',
  '/about/legal/terms',
  '/user-agreement',
];

// Keywords that indicate a link is the ToS page
const TOS_LINK_KEYWORDS = ['terms of service', 'terms of use', 'terms and conditions', 'user agreement', 'tos'];

function normalizeUrl(raw: string): string {
  raw = raw.trim();
  if (!/^https?:\/\//i.test(raw)) raw = 'https://' + raw;
  return raw;
}

function isHomepage(url: string): boolean {
  const { pathname } = new URL(url);
  return pathname === '/' || pathname === '';
}

/**
 * Given a homepage URL, try to discover the ToS URL by:
 * 1. Trying common suffix patterns (fast, no network hop)
 * 2. Parsing the homepage HTML for a link that looks like ToS
 */
async function discoverTosUrl(homeUrl: string): Promise<string> {
  const origin = new URL(homeUrl).origin;

  // Strategy 1: try known path suffixes one by one (stop at first 200)
  for (const suffix of TOS_PATH_CANDIDATES) {
    const candidate = origin + suffix;
    try {
      const res = await axios.head(candidate, {
        timeout: 4_000,
        headers: { 'User-Agent': USER_AGENT },
        maxRedirects: 3,
        validateStatus: (s) => s === 200,
      });
      if (res.status === 200) return candidate;
    } catch {
      // not found, try next
    }
  }

  // Strategy 2: parse the homepage and look for a ToS link
  try {
    const html = await axios.get(homeUrl, {
      timeout: FETCH_TIMEOUT_MS,
      headers: { 'User-Agent': USER_AGENT },
    });
    const $ = load(html.data as string);
    let found = '';
    $('a').each((_i, el) => {
      if (found) return;
      const text = $(el).text().toLowerCase().trim();
      const href = $(el).attr('href') || '';
      const isKeyword = TOS_LINK_KEYWORDS.some((kw) => text.includes(kw));
      const looksLikeTos = /terms|tos|user.?agreement/i.test(href);
      if (isKeyword || looksLikeTos) {
        // Resolve relative URLs
        try {
          found = href.startsWith('http') ? href : new URL(href, origin).href;
        } catch {}
      }
    });
    if (found) return found;
  } catch {
    // homepage fetch failed
  }

  // Fallback: return the original URL unchanged
  return homeUrl;
}

/**
 * Extract meaningful legal text from HTML — strips scripts, nav, footer, cookie banners.
 * Tries a ranked list of content selectors before falling back to <body>.
 */
function extractText(html: string): string {
  const $ = load(html);

  // Remove noise
  $(
    'script, style, noscript, nav, header, footer, iframe, ' +
    '.nav, .header, .footer, .menu, .sidebar, .cookie, .banner, ' +
    '[class*="cookie"], [class*="banner"], [class*="popup"], ' +
    '[id*="cookie"], [id*="banner"], [aria-hidden="true"]'
  ).remove();

  // Try content-specific selectors first (most precise → least precise)
  const SELECTORS = [
    'main article',
    'article',
    'main',
    '[class*="terms"]',
    '[class*="legal"]',
    '[class*="content"]',
    '#content',
    '#main',
    '.container',
    'body',
  ];

  for (const sel of SELECTORS) {
    const text = $(sel).first().text();
    if (text.length > 800) {
      return cleanText(text);
    }
  }

  return cleanText($('body').text());
}

function cleanText(raw: string): string {
  return raw
    .replace(/\t/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/ {2,}/g, ' ')
    .trim();
}

export interface FetchResult {
  text: string;
  resolvedUrl: string;
  charCount: number;
  wasTruncated: boolean;
}

export async function fetchTosContent(rawUrl: string): Promise<FetchResult> {
  const url = normalizeUrl(rawUrl);

  // Validate
  const parsed = new URL(url); // throws if malformed
  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error('Only HTTP/HTTPS URLs are supported.');
  }

  // Auto-discover ToS page if given a homepage
  const targetUrl = isHomepage(url) ? await discoverTosUrl(url) : url;

  // Fetch the page
  let html: string;
  try {
    const res = await axios.get<string>(targetUrl, {
      timeout: FETCH_TIMEOUT_MS,
      headers: {
        'User-Agent': USER_AGENT,
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      maxRedirects: 5,
      responseType: 'text',
    });
    html = res.data;
  } catch (err: any) {
    const status = err.response?.status;
    if (status === 403 || status === 401) {
      throw new Error(
        `${parsed.hostname} blocks automated access (${status}). Try pasting the direct ToS URL instead of the homepage.`
      );
    }
    if (status === 404) {
      throw new Error(`Terms of Service page not found at ${targetUrl}. Paste the direct ToS URL.`);
    }
    throw new Error(`Could not reach ${parsed.hostname}. Check the URL and try again.`);
  }

  let text = extractText(html);

  if (text.length < 300) {
    throw new Error(
      `The page at ${targetUrl} doesn't appear to contain Terms of Service text. Paste the direct ToS URL.`
    );
  }

  const wasTruncated = text.length > MAX_CHARS;
  if (wasTruncated) {
    // Truncate at a sentence boundary near MAX_CHARS
    const truncated = text.slice(0, MAX_CHARS);
    const lastPeriod = truncated.lastIndexOf('.');
    text = (lastPeriod > MAX_CHARS * 0.8 ? truncated.slice(0, lastPeriod + 1) : truncated) +
      '\n\n[Note: Document truncated — the above covers the most important sections.]';
  }

  return {
    text,
    resolvedUrl: targetUrl,
    charCount: text.length,
    wasTruncated,
  };
}
