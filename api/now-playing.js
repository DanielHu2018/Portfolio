import { sendJson } from '../lib/supabase.js';

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID || '74b02a5bae4d4fe68eb5f7e05262985c';

// Reused across requests while the function instance stays warm.
let cachedToken = null;

async function accessToken() {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60000) return cachedToken.value;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refresh = (headers, body) => fetch('https://accounts.spotify.com/api/token', { method: 'POST', headers, body });
  let response = await refresh({ 'Content-Type': 'application/x-www-form-urlencoded' }, new URLSearchParams({ client_id: CLIENT_ID, grant_type: 'refresh_token', refresh_token: refreshToken }));
  if (!response.ok && clientSecret) {
    const basic = Buffer.from(`${CLIENT_ID}:${clientSecret}`).toString('base64');
    response = await refresh({ Authorization: `Basic ${basic}`, 'Content-Type': 'application/x-www-form-urlencoded' }, new URLSearchParams({ grant_type: 'refresh_token', refresh_token: refreshToken }));
  }
  if (!response.ok) throw new Error(`Spotify token refresh failed (${response.status})`);
  const token = await response.json();
  cachedToken = { value: token.access_token, expiresAt: Date.now() + token.expires_in * 1000 };
  return cachedToken.value;
}

// Smallest cover that is still at least 128px, so the widget stays sharp without a large download.
function cover(images) {
  const list = (images || []).slice().sort((a, b) => (a.width || 0) - (b.width || 0));
  return (list.find((image) => (image.width || 0) >= 128) || list[list.length - 1] || {}).url || '';
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return sendJson(res, 405, { error: 'Method not allowed' });
  if (!process.env.SPOTIFY_REFRESH_TOKEN) return sendJson(res, 503, { error: 'Spotify is not configured' });
  try {
    const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing?additional_types=episode', { headers: { Authorization: `Bearer ${await accessToken()}` } });
    // A short shared cache keeps Spotify calls to a few per minute no matter how many people are on the site.
    res.setHeader('Cache-Control', 'public, s-maxage=15, stale-while-revalidate=15');
    if (response.status === 204) return sendJson(res, 200, { playing: false });
    if (!response.ok) throw new Error(`Spotify currently-playing failed (${response.status})`);
    const data = await response.json();
    const item = data.item;
    if (!data.is_playing || !item) return sendJson(res, 200, { playing: false });
    const isEpisode = item.type === 'episode';
    return sendJson(res, 200, {
      playing: true,
      title: item.name,
      artist: isEpisode ? (item.show && item.show.name) || '' : (item.artists || []).map((artist) => artist.name).join(', '),
      art: cover(isEpisode ? item.images || (item.show && item.show.images) : item.album && item.album.images),
      url: (item.external_urls && item.external_urls.spotify) || '',
    });
  } catch (error) {
    console.error('Now playing failed:', error);
    res.setHeader('Cache-Control', 'no-store');
    return sendJson(res, 502, { playing: false, error: 'Unable to reach Spotify' });
  }
}
