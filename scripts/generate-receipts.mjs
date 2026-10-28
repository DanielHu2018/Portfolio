import fs from 'node:fs';
import path from 'node:path';

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;
if (!clientId || !clientSecret || !refreshToken) throw new Error('Missing Spotify environment variables');

const outputDir = path.resolve('public/assets/receipts');
fs.mkdirSync(outputDir, { recursive: true });

const refresh = (headers, body) => fetch('https://accounts.spotify.com/api/token', { method: 'POST', headers, body });
let tokenResponse = await refresh({ 'Content-Type': 'application/x-www-form-urlencoded' }, new URLSearchParams({ client_id: clientId, grant_type: 'refresh_token', refresh_token: refreshToken }));
if (!tokenResponse.ok && clientSecret) {
  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  tokenResponse = await refresh({ Authorization: `Basic ${basic}`, 'Content-Type': 'application/x-www-form-urlencoded' }, new URLSearchParams({ grant_type: 'refresh_token', refresh_token: refreshToken }));
}
if (!tokenResponse.ok) throw new Error(`Spotify token refresh failed: ${tokenResponse.status} ${await tokenResponse.text()}`);
const { access_token: accessToken } = await tokenResponse.json();

function escapeXml(value) {
  return String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}
function textLine(text, x, y, size, weight = 400, anchor = 'start') {
  return `<text x="${x}" y="${y}" font-family="monospace" font-size="${size}px" font-weight="${weight}" text-anchor="${anchor}" fill="#111">${escapeXml(text)}</text>`;
}
function renderReceipt(items, type, range) {
  const width = 720;
  const height = 190 + items.length * 58 + 120;
  const title = type === 'artists' ? 'TOP ARTISTS' : type === 'genres' ? 'TOP GENRES' : 'TOP TRACKS';
  const rangeLabel = range === 'medium_term' ? 'LAST 6 MONTHS' : 'LAST 4 WEEKS';
  const month = new Date().toLocaleString('en-US', { month: 'long', year: 'numeric', timeZone: 'America/New_York' });
  const rows = items.map((item, index) => {
    const name = item.name.length > 30 ? `${item.name.slice(0, 29)}…` : item.name;
    const secondary = item.secondary.length > 34 ? `${item.secondary.slice(0, 33)}…` : item.secondary;
    const y = 190 + index * 58;
    return [textLine(String(index + 1).padStart(2, '0'), 52, y, 22, 700), textLine(name, 100, y, 22, 700), textLine(secondary, 100, y + 25, 16), textLine('SPOTIFY', width - 52, y, 13, 700, 'end')].join('');
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="100%" height="100%" fill="#fffdf5"/><rect x="16" y="16" width="${width - 32}" height="${height - 32}" rx="4" fill="none" stroke="#111" stroke-width="4"/>${textLine('DANIEL HU', 52, 58, 34, 800)}${textLine(`${title} RECEIPT`, 52, 92, 18, 700)}${textLine(month.toUpperCase(), width - 52, 58, 18, 700, 'end')}${textLine(rangeLabel, width - 52, 92, 14, 400, 'end')}<path d="M52 120 H${width - 52}" stroke="#111" stroke-width="3" stroke-dasharray="10 8"/>${rows}<path d="M52 ${height - 88} H${width - 52}" stroke="#111" stroke-width="3" stroke-dasharray="10 8"/>${textLine(`${items.length} ${type.toUpperCase()}`, 52, height - 48, 18, 700)}${textLine('THANKS FOR LISTENING', width - 52, height - 48, 18, 700, 'end')}</svg>`;
}

async function getTop(type, range, limit) {
  const response = await fetch(`https://api.spotify.com/v1/me/top/${type}?time_range=${range}&limit=${limit}`, { headers: { Authorization: `Bearer ${accessToken}` } });
  if (!response.ok) throw new Error(`Spotify ${type}/${range} failed: ${response.status} ${await response.text()}`);
  return response.json();
}

for (const range of ['short_term', 'medium_term']) {
  const tracks = await getTop('tracks', range, 10);
  fs.writeFileSync(path.join(outputDir, `tracks-${range === 'short_term' ? '1m' : '6m'}.svg`), renderReceipt(tracks.items.map((item) => ({ name: item.name, secondary: item.artists.map((artist) => artist.name).join(', ') })), 'tracks', range));
  const artists = await getTop('artists', range, 10);
  fs.writeFileSync(path.join(outputDir, `artists-${range === 'short_term' ? '1m' : '6m'}.svg`), renderReceipt(artists.items.map((item) => ({ name: item.name, secondary: `${item.followers?.total?.toLocaleString() || '—'} followers` })), 'artists', range));
  const counts = {};
  for (const artist of artists.items) for (const genre of artist.genres || []) counts[genre] = (counts[genre] || 0) + 1;
  const genres = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([name, count]) => ({ name, secondary: `${count} top artist${count === 1 ? '' : 's'}` }));
  fs.writeFileSync(path.join(outputDir, `genres-${range === 'short_term' ? '1m' : '6m'}.svg`), renderReceipt(genres, 'genres', range));
}
