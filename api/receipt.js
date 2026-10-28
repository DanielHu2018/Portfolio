const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID || '74b02a5bae4d4fe68eb5f7e05262985c';

function escapeXml(value) {
  return String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

function textLine(text, x, y, size, weight = 400, anchor = 'start') {
  return `<text x="${x}" y="${y}" font-family="monospace" font-size="${size}px" font-weight="${weight}" text-anchor="${anchor}" fill="#111">${escapeXml(text)}</text>`;
}

function receiptSvg(items, type, range) {
  const width = 720;
  const rowHeight = 58;
  const height = 190 + items.length * rowHeight + 120;
  const now = new Date();
  const month = now.toLocaleString('en-US', { month: 'long', year: 'numeric', timeZone: 'America/New_York' });
  const title = type === 'artists' ? 'TOP ARTISTS' : type === 'genres' ? 'TOP GENRES' : 'TOP TRACKS';
  const rangeLabel = range === 'medium_term' ? 'LAST 6 MONTHS' : 'LAST 4 WEEKS';
  const rows = items.map((item, index) => {
    const name = item.name.length > 30 ? `${item.name.slice(0, 29)}…` : item.name;
    const secondary = item.secondary || '';
    const secondaryText = secondary.length > 34 ? `${secondary.slice(0, 33)}…` : secondary;
    const y = 190 + index * rowHeight;
    return [textLine(String(index + 1).padStart(2, '0'), 52, y, 22, 700), textLine(name, 100, y, 22, 700), textLine(secondaryText, 100, y + 25, 16), textLine('SPOTIFY', width - 52, y, 13, 700, 'end')].join('');
  }).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <rect width="100%" height="100%" fill="#fffdf5"/>
    <rect x="16" y="16" width="${width - 32}" height="${height - 32}" rx="4" fill="none" stroke="#111" stroke-width="4"/>
    ${textLine('DANIEL HU', 52, 58, 34, 800)}
    ${textLine(`${title} RECEIPT`, 52, 92, 18, 700)}
    ${textLine(month.toUpperCase(), width - 52, 58, 18, 700, 'end')}
    ${textLine(rangeLabel, width - 52, 92, 14, 400, 'end')}
    <path d="M52 120 H${width - 52}" stroke="#111" stroke-width="3" stroke-dasharray="10 8"/>
    ${rows}
    <path d="M52 ${height - 88} H${width - 52}" stroke="#111" stroke-width="3" stroke-dasharray="10 8"/>
    ${textLine(`${items.length} ${type.toUpperCase()}`, 52, height - 48, 18, 700)}
    ${textLine('THANKS FOR LISTENING', width - 52, height - 48, 18, 700, 'end')}
  </svg>`;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).setHeader('Allow', 'GET').send('Method Not Allowed');
    return;
  }
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!refreshToken) {
    res.status(503).setHeader('Content-Type', 'text/plain; charset=utf-8').send('Spotify receipt is not configured yet.');
    return;
  }
  try {
    const requestUrl = new URL(req.url, 'https://receipt.local');
    const type = ['tracks', 'artists', 'genres'].includes(requestUrl.searchParams.get('type')) ? requestUrl.searchParams.get('type') : 'tracks';
    const range = requestUrl.searchParams.get('range') === '6m' ? 'medium_term' : 'short_term';
    const refresh = (headers, body) => fetch('https://accounts.spotify.com/api/token', { method: 'POST', headers, body });
    const pkceBody = new URLSearchParams({ client_id: CLIENT_ID, grant_type: 'refresh_token', refresh_token: refreshToken });
    let tokenResponse = await refresh({ 'Content-Type': 'application/x-www-form-urlencoded' }, pkceBody);
    if (!tokenResponse.ok && clientSecret) {
      const basic = Buffer.from(`${CLIENT_ID}:${clientSecret}`).toString('base64');
      tokenResponse = await refresh({ Authorization: `Basic ${basic}`, 'Content-Type': 'application/x-www-form-urlencoded' }, new URLSearchParams({ grant_type: 'refresh_token', refresh_token: refreshToken }));
    }
    if (!tokenResponse.ok) throw new Error(`Spotify token refresh failed (${tokenResponse.status})`);
    const token = await tokenResponse.json();
    const spotifyType = type === 'genres' ? 'artists' : type;
    const response = await fetch(`https://api.spotify.com/v1/me/top/${spotifyType}?time_range=${range}&limit=${type === 'genres' ? 50 : 10}`, { headers: { Authorization: `Bearer ${token.access_token}` } });
    if (!response.ok) throw new Error(`Spotify top ${type} failed (${response.status})`);
    const data = await response.json();
    const rawItems = Array.isArray(data.items) ? data.items : [];
    const items = type === 'genres'
      ? Object.entries(rawItems.reduce((counts, artist) => { for (const genre of artist.genres || []) counts[genre] = (counts[genre] || 0) + 1; return counts; }, {})).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([name, count]) => ({ name, secondary: `${count} top artist${count === 1 ? '' : 's'}` })))
      : rawItems.map((item) => ({ name: item.name, secondary: type === 'artists' ? `${item.followers?.total?.toLocaleString() || '—'} followers` : (item.artists || []).map((artist) => artist.name).join(', ') }));
    if (!items.length) throw new Error(`Spotify returned no ${type}`);
    res.status(200);
    res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    res.send(receiptSvg(items, type, range));
  } catch (error) {
    console.error('Receipt generation failed:', error);
    res.status(502).setHeader('Content-Type', 'text/plain; charset=utf-8').send('Unable to generate the Spotify receipt right now.');
  }
}
