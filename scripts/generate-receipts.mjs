import fs from 'node:fs';
import path from 'node:path';

const required = ['SPOTIFY_CLIENT_ID', 'SPOTIFY_CLIENT_SECRET', 'SPOTIFY_REFRESH_TOKEN'];
const missing = required.filter((name) => !process.env[name]);
if (missing.length) throw new Error(`Missing GitHub Actions secrets: ${missing.join(', ')}`);
const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;
const outputDir = path.resolve('public/assets/receipts');
const history = JSON.parse(fs.readFileSync(path.resolve('data/spotify-history.json'), 'utf8'));
fs.mkdirSync(outputDir, { recursive: true });

const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
const tokenResponse = await fetch('https://accounts.spotify.com/api/token', { method: 'POST', headers: { Authorization: `Basic ${basic}`, 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: refreshToken }) });
if (!tokenResponse.ok) throw new Error(`Spotify token refresh failed: ${tokenResponse.status} ${await tokenResponse.text()}`);
const { access_token: accessToken } = await tokenResponse.json();

function escapeXml(value) { return String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;'); }
function textLine(text, x, y, size, weight = 400, anchor = 'start') { return `<text x="${x}" y="${y}" font-family="monospace" font-size="${size}px" font-weight="${weight}" text-anchor="${anchor}" fill="#111">${escapeXml(text)}</text>`; }
function renderReceipt(items, type, range) {
  const width = 720;
  const height = 190 + items.length * 58 + 120;
  const title = type === 'artists' ? 'TOP ARTISTS' : type === 'genres' ? 'TOP GENRES' : 'TOP TRACKS';
  const rangeLabel = range === 'medium_term' ? 'LAST 6 MONTHS' : 'LAST 4 WEEKS';
  const month = new Date().toLocaleString('en-US', { month: 'long', year: 'numeric', timeZone: 'America/New_York' });
  const rows = items.map((item, index) => { const name = item.name.length > 30 ? `${item.name.slice(0, 29)}…` : item.name; const secondary = item.secondary.length > 34 ? `${item.secondary.slice(0, 33)}…` : item.secondary; const y = 190 + index * 58; return [textLine(String(index + 1).padStart(2, '0'), 52, y, 22, 700), textLine(name, 100, y, 22, 700), textLine(secondary, 100, y + 25, 16), textLine('PLAYS', width - 52, y, 13, 700, 'end')].join(''); }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="100%" height="100%" fill="#fffdf5"/><rect x="16" y="16" width="${width - 32}" height="${height - 32}" rx="4" fill="none" stroke="#111" stroke-width="4"/>${textLine('DANIEL HU', 52, 58, 34, 800)}${textLine(`${title} RECEIPT`, 52, 92, 18, 700)}${textLine(month.toUpperCase(), width - 52, 58, 18, 700, 'end')}${textLine(rangeLabel, width - 52, 92, 14, 400, 'end')}<path d="M52 120 H${width - 52}" stroke="#111" stroke-width="3" stroke-dasharray="10 8"/>${rows}<path d="M52 ${height - 88} H${width - 52}" stroke="#111" stroke-width="3" stroke-dasharray="10 8"/>${textLine(`${items.length} ${type.toUpperCase()}`, 52, height - 48, 18, 700)}${textLine('THANKS FOR LISTENING', width - 52, height - 48, 18, 700, 'end')}</svg>`;
}
async function getArtistGenres(ids) {
  const genres = {};
  for (let i = 0; i < ids.length; i += 50) {
    const response = await fetch(`https://api.spotify.com/v1/artists?ids=${ids.slice(i, i + 50).join(',')}`, { headers: { Authorization: `Bearer ${accessToken}` } });
    if (!response.ok) continue;
    for (const artist of (await response.json()).artists || []) genres[artist.id] = artist.genres || [];
  }
  return genres;
}
function countItems(plays, field) {
  const counts = new Map();
  for (const play of plays) {
    const names = field === 'artists' ? play.artists : [play.track_name];
    for (const name of names || []) counts.set(name, (counts.get(name) || 0) + 1);
  }
  return [...counts].sort((a, b) => b[1] - a[1]).slice(0, 10).map(([name, count]) => ({ name, secondary: `${count} ${field === 'artists' ? 'listens' : 'plays'}` }));
}

const allArtistIds = [...new Set(history.plays.flatMap((play) => play.artist_ids || []))];
const artistGenres = await getArtistGenres(allArtistIds);
for (const range of ['short_term', 'medium_term']) {
  const days = range === 'short_term' ? 30 : 180;
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  const plays = history.plays.filter((play) => Date.parse(play.played_at) >= cutoff);
  fs.writeFileSync(path.join(outputDir, `tracks-${range === 'short_term' ? '1m' : '6m'}.svg`), renderReceipt(countItems(plays, 'tracks'), 'tracks', range));
  fs.writeFileSync(path.join(outputDir, `artists-${range === 'short_term' ? '1m' : '6m'}.svg`), renderReceipt(countItems(plays, 'artists'), 'artists', range));
  const genreCounts = new Map();
  for (const play of plays) for (const id of play.artist_ids || []) for (const genre of artistGenres[id] || []) genreCounts.set(genre, (genreCounts.get(genre) || 0) + 1);
  const genres = [...genreCounts].sort((a, b) => b[1] - a[1]).slice(0, 10).map(([name, count]) => ({ name, secondary: `${count} listens` }));
  if (!genres.length) genres.push({ name: 'Genre data unavailable', secondary: 'Keep collecting listens' });
  fs.writeFileSync(path.join(outputDir, `genres-${range === 'short_term' ? '1m' : '6m'}.svg`), renderReceipt(genres, 'genres', range));
}
