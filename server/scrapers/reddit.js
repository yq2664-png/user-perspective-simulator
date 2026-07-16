// Reddit — real user discussion across the web.
//
// Priority:
// 1. Official OAuth (when REDDIT_CLIENT_ID / REDDIT_CLIENT_SECRET are set)
// 2. PullPush archive API — no account, no API key (default fallback)
// 3. Legacy public search.json (usually blocked; kept as last resort)

const UA = process.env.REDDIT_USER_AGENT || 'UserResearchOS/1.0 (real user voice research)';

let tokenCache = { token: '', exp: 0 };

async function getToken() {
  const id = process.env.REDDIT_CLIENT_ID;
  const secret = process.env.REDDIT_CLIENT_SECRET;
  if (!id || !secret) return '';
  const now = Date.now();
  if (tokenCache.token && now < tokenCache.exp) return tokenCache.token;
  try {
    const res = await fetch('https://www.reddit.com/api/v1/access_token', {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + Buffer.from(`${id}:${secret}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': UA,
      },
      body: 'grant_type=client_credentials',
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return '';
    const data = await res.json().catch(() => null);
    if (!data?.access_token) return '';
    tokenCache = { token: data.access_token, exp: now + (data.expires_in ?? 3600) * 1000 - 60000 };
    return tokenCache.token;
  } catch {
    return '';
  }
}

function collectOfficial(data, productName, addItem) {
  const productLower = productName.toLowerCase();
  (data?.data?.children ?? [])
    .map(c => c.data)
    .filter(p => {
      const text = `${p.title ?? ''} ${p.selftext ?? ''}`.toLowerCase();
      return text.includes(productLower) && (p.selftext?.length > 60 || p.title?.length > 40);
    })
    .slice(0, 6)
    .forEach(p => {
      const url = `https://www.reddit.com${p.permalink}`;
      const body = (p.selftext || p.title || '').replace(/\s+/g, ' ').slice(0, 400);
      addItem('Reddit', url, `r/${p.subreddit}: ${body}`);
    });
}

function matchesProduct(text, productName) {
  const hay = (text ?? '').toLowerCase();
  const needle = productName.toLowerCase().trim();
  if (!needle) return false;
  return hay.includes(needle);
}

function collectPullPush(items, productName, addItem, seen) {
  let added = 0;
  for (const item of items ?? []) {
    const subreddit = item.subreddit ?? 'unknown';
    const title = item.title ?? '';
    const selftext = item.selftext ?? item.body ?? '';
    const text = `${title} ${selftext}`.replace(/\s+/g, ' ').trim();
    if (!matchesProduct(text, productName)) continue;
    if (text.length < 40) continue;

    const permalink = item.permalink ?? '';
    const url = permalink.startsWith('http')
      ? permalink
      : permalink
        ? `https://www.reddit.com${permalink}`
        : item.url ?? 'https://www.reddit.com';

    const key = url.split('?')[0];
    if (seen.has(key)) continue;
    seen.add(key);

    addItem('Reddit', url, `r/${subreddit}: ${text.slice(0, 400)}`);
    added++;
    if (seen.size >= 6) break;
  }
  return added;
}

async function searchPullPush(productName, addItem) {
  const seen = new Set();
  let total = 0;
  const q = encodeURIComponent(productName);
  const endpoints = [
    `https://api.pullpush.io/reddit/search/submission/?q=${q}&size=25&sort=desc&sort_type=score`,
    `https://api.pullpush.io/reddit/search/comment/?q=${q}&size=25&sort=desc&sort_type=score`,
  ];

  for (const endpoint of endpoints) {
    if (seen.size >= 6) break;
    try {
      const res = await fetch(endpoint, { signal: AbortSignal.timeout(10000) });
      if (!res.ok) continue;
      const data = await res.json().catch(() => null);
      total += collectPullPush(data?.data, productName, addItem, seen);
    } catch {
      /* PullPush unavailable — try next endpoint. */
    }
  }
  return total;
}

export function reddit({ productName, headers, addItem }) {
  return (async () => {
    try {
      const token = await getToken();
      if (token) {
        const res = await fetch(
          `https://oauth.reddit.com/search?q=${encodeURIComponent(productName)}&sort=relevance&limit=25&type=link`,
          { headers: { Authorization: `Bearer ${token}`, 'User-Agent': UA }, signal: AbortSignal.timeout(8000) }
        );
        if (res.ok) {
          const data = await res.json().catch(() => null);
          if (data) collectOfficial(data, productName, addItem);
        }
        return;
      }

      // No Reddit app credentials — use PullPush (no registration required).
      const found = await searchPullPush(productName, addItem);
      if (found > 0) return;

      // Last resort: public endpoint (often blocked).
      const res = await fetch(
        `https://www.reddit.com/search.json?q=${encodeURIComponent(productName)}&sort=relevance&limit=25`,
        { headers: { ...headers, Accept: 'application/json' }, signal: AbortSignal.timeout(8000) }
      );
      if (!res.ok) return;
      if (!(res.headers.get('content-type') || '').includes('json')) return;
      const data = await res.json().catch(() => null);
      if (data) collectOfficial(data, productName, addItem);
    } catch {
      /* Reddit unavailable — skip quietly. */
    }
  })();
}
