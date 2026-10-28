import fs from 'node:fs';
import path from 'node:path';

const required = ['SPOTIFY_CLIENT_ID', 'SPOTIFY_CLIENT_SECRET', 'SPOTIFY_REFRESH_TOKEN'];
const missing = required.filter((name) => !process.env[name]);
if (missing.length) throw new Error(`Missing GitHub Actions secrets: ${missing.join(', ')}`);
const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;
const historyPath = path.resolve('data/spotify-history.json');
fs.mkdirSync(path.dirname(historyPath), { recursive: true });
const history = fs.existsSync(historyPath) ? JSON.parse(fs.readFileSync(historyPath, 'utf8')) : { plays: [] };

const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
const tokenResponse = await fetch('https://accounts.spotify.com/api/token', { method: 'POST', headers: { Authorization: `Basic ${basic}`, 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: refreshToken }) });
if (!tokenResponse.ok) throw new Error(`Spotify token refresh failed: ${tokenResponse.status} ${await tokenResponse.text()}`);
const { access_token: accessToken } = await tokenResponse.json();
const latest = history.plays.reduce((max, play) => Math.max(max, Date.parse(play.played_at) || 0), 0);
const after = latest ? `&after=${latest}` : '';
const response = await fetch(`https://api.spotify.com/v1/me/player/recently-played?limit=50${after}`, { headers: { Authorization: `Bearer ${accessToken}` } });
if (!response.ok) throw new Error(`Spotify recently played failed: ${response.status} ${await response.text()}`);
const data = await response.json();
const seen = new Set(history.plays.map((play) => `${play.played_at}|${play.track_id}`));
const additions = (data.items || []).filter((item) => item.track?.id && item.played_at).map((item) => ({ played_at: item.played_at, track_id: item.track.id, track_name: item.track.name, artist_ids: (item.track.artists || []).map((artist) => artist.id).filter(Boolean), artists: (item.track.artists || []).map((artist) => artist.name) })).filter((play) => { const key = `${play.played_at}|${play.track_id}`; if (seen.has(key)) return false; seen.add(key); return true; });
history.plays = [...history.plays, ...additions].sort((a, b) => Date.parse(a.played_at) - Date.parse(b.played_at)).slice(-10000);
fs.writeFileSync(historyPath, JSON.stringify(history, null, 2) + '\n');
console.log(`Collected ${additions.length} new plays; archive contains ${history.plays.length}.`);
