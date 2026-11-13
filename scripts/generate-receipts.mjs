import fs from 'node:fs';
import path from 'node:path';
import { fetchRetry } from './fetch-retry.mjs';

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
const tokenResponse = await fetchRetry('https://accounts.spotify.com/api/token', { method: 'POST', headers: { Authorization: `Basic ${basic}`, 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: refreshToken }) });
if (!tokenResponse.ok) throw new Error(`Spotify token refresh failed: ${tokenResponse.status} ${await tokenResponse.text()}`);
const { access_token: accessToken } = await tokenResponse.json();

function escapeXml(value) { return String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;'); }
function textLine(text, x, y, size, weight = 400, anchor = 'start') { return `<text x="${x}" y="${y}" font-family="monospace" font-size="${size}px" font-weight="${weight}" text-anchor="${anchor}" fill="#111">${escapeXml(text)}</text>`; }
function renderReceipt(items, type, range) {
  const width = 720;
  const height = 190 + items.length * 58 + 120;
  const title = type === 'artists' ? 'TOP ARTISTS' : 'TOP TRACKS';
  const rangeLabel = range === 'medium_term' ? 'LAST 6 MONTHS' : 'LAST 4 WEEKS';
  const month = new Date().toLocaleString('en-US', { month: 'long', year: 'numeric', timeZone: 'America/New_York' });
  const rows = items.map((item, index) => { const name = item.name.length > 30 ? `${item.name.slice(0, 29)}…` : item.name; const secondary = item.secondary.length > 34 ? `${item.secondary.slice(0, 33)}…` : item.secondary; const y = 190 + index * 58; return [textLine(String(index + 1).padStart(2, '0'), 52, y, 22, 700), textLine(name, 100, y, 22, 700), textLine(secondary, 100, y + 25, 16), textLine('PLAYS', width - 52, y, 13, 700, 'end')].join(''); }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="100%" height="100%" fill="#fffdf5"/><rect x="16" y="16" width="${width - 32}" height="${height - 32}" rx="4" fill="none" stroke="#111" stroke-width="4"/>${textLine('DANIEL HU', 52, 58, 34, 800)}${textLine(`${title} RECEIPT`, 52, 92, 18, 700)}${textLine(month.toUpperCase(), width - 52, 58, 18, 700, 'end')}${textLine(rangeLabel, width - 52, 92, 14, 400, 'end')}<path d="M52 120 H${width - 52}" stroke="#111" stroke-width="3" stroke-dasharray="10 8"/>${rows}<path d="M52 ${height - 88} H${width - 52}" stroke="#111" stroke-width="3" stroke-dasharray="10 8"/>${textLine(`${items.length} ${type.toUpperCase()}`, 52, height - 48, 18, 700)}${textLine('THANKS FOR LISTENING', width - 52, height - 48, 18, 700, 'end')}</svg>`;
}
function countItems(plays, field) {
  const counts = new Map();
  for (const play of plays) {
    const names = field === 'artists' ? play.artists : [play.track_name];
    for (const name of names || []) counts.set(name, (counts.get(name) || 0) + 1);
  }
  return [...counts].sort((a, b) => b[1] - a[1]).slice(0, 10).map(([name, count]) => ({ name, secondary: `${count} ${field === 'artists' ? 'listens' : 'plays'}` }));
}

// Details for the iPod's track and artist pages, looked up one id at a time (cached across both ranges). A failed
// lookup just leaves that item without details; the page then shows what the history has.
const lookups = new Map();
let queue = Promise.resolve(); // one request at a time, to stay clear of rate limits
async function spotify(kind, id) {
  const key = `${kind}/${id}`;
  if (!lookups.has(key)) {
    lookups.set(key, queue = queue.then(async () => {
      try {
        const response = await fetchRetry(`https://api.spotify.com/v1/${kind}/${id}`, { headers: { Authorization: `Bearer ${accessToken}` } });
        if (response.ok) return await response.json();
        console.warn(`Spotify ${key}: ${response.status}`);
      } catch (error) {
        console.warn(`Spotify ${key}: ${error.message}`);
      }
      return null;
    }));
  }
  return lookups.get(key);
}
// The ~300px image (Spotify lists them largest first), else the smallest there is.
function image(images) {
  const list = (images || []).filter((im) => im && im.url);
  return (list.find((im) => (im.width || 0) <= 320) || list[list.length - 1] || {}).url || '';
}
// The id seen most often under a name (tracks are counted by name, so a single and its album cut merge).
function mostCommonId(plays, nameOf, idOf) {
  const ids = new Map();
  for (const play of plays) { const id = idOf(play); if (id && nameOf(play)) ids.set(id, (ids.get(id) || 0) + 1); }
  return [...ids].sort((a, b) => b[1] - a[1])[0]?.[0] || '';
}
const lastPlayed = (plays) => plays.reduce((last, play) => (play.played_at > last ? play.played_at : last), '');

async function trackDetails(item, plays) {
  const mine = plays.filter((play) => play.track_name === item.name);
  const id = mostCommonId(mine, () => true, (play) => play.track_id);
  const t = id ? await spotify('tracks', id) : null;
  return {
    ...item,
    id,
    artist: (t?.artists?.map((a) => a.name) || mine[0]?.artists || []).join(', '),
    album: t?.album?.name || '',
    year: (t?.album?.release_date || '').slice(0, 4),
    ms: t?.duration_ms || 0,
    pic: image(t?.album?.images),
    url: t?.external_urls?.spotify || (id ? `https://open.spotify.com/track/${id}` : ''),
    last: lastPlayed(mine)
  };
}

async function artistDetails(item, plays) {
  const mine = plays.filter((play) => (play.artists || []).includes(item.name));
  const id = mostCommonId(mine, () => true, (play) => play.artist_ids?.[(play.artists || []).indexOf(item.name)]);
  const a = id ? await spotify('artists', id) : null;
  // Their tracks Daniel played most in this range, with covers.
  const counts = new Map();
  for (const play of mine) counts.set(play.track_name, (counts.get(play.track_name) || 0) + 1);
  const tracks = await Promise.all([...counts].sort((x, y) => y[1] - x[1]).slice(0, 8).map(async ([name, count]) => {
    const trackId = mostCommonId(mine.filter((play) => play.track_name === name), () => true, (play) => play.track_id);
    const t = trackId ? await spotify('tracks', trackId) : null;
    return { name, plays: count, pic: image(t?.album?.images) };
  }));
  return {
    ...item,
    id,
    pic: image(a?.images),
    genres: (a?.genres || []).slice(0, 3),
    url: a?.external_urls?.spotify || (id ? `https://open.spotify.com/artist/${id}` : ''),
    last: lastPlayed(mine),
    tracks
  };
}

const menuViews = {};
for (const range of ['short_term', 'medium_term']) {
  const days = range === 'short_term' ? 30 : 180;
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  const plays = history.plays.filter((play) => Date.parse(play.played_at) >= cutoff);
  const suffix = range === 'short_term' ? '1m' : '6m';
  const tracks = countItems(plays, 'tracks');
  const artists = countItems(plays, 'artists');
  fs.writeFileSync(path.join(outputDir, `tracks-${suffix}.svg`), renderReceipt(tracks, 'tracks', range));
  fs.writeFileSync(path.join(outputDir, `artists-${suffix}.svg`), renderReceipt(artists, 'artists', range));
  menuViews[`tracks-${suffix}`] = await Promise.all(tracks.map((item) => trackDetails(item, plays)));
  menuViews[`artists-${suffix}`] = await Promise.all(artists.map((item) => artistDetails(item, plays)));
}
// The site's iPod menu reads this; the SVGs above are kept as standalone receipts.
const updated = new Date().toLocaleString('en-US', { month: 'long', year: 'numeric', timeZone: 'America/New_York' });
fs.writeFileSync(path.join(outputDir, 'receipts.json'), JSON.stringify({ updated, views: menuViews }, null, 2) + '\n');
