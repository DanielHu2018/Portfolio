const clientId = process.env.SPOTIFY_CLIENT_ID || '74b02a5bae4d4fe68eb5f7e05262985c';
const redirectUri = 'https://dwho.vercel.app/api/spotify-callback';

function cookieValue(req, name) {
  const cookies = String(req.headers.cookie || '').split(';').map((part) => part.trim());
  const match = cookies.find((part) => part.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : '';
}

function page(message, token = '') {
  const safe = String(message).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const safeToken = String(token).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return `<!doctype html><meta charset="utf-8"><title>Spotify authorization</title><style>body{font:16px system-ui;max-width:720px;margin:48px auto;padding:0 20px}textarea{width:100%;height:100px}button{padding:10px 16px}</style><h1>Spotify authorization</h1><p>${safe}</p>${token ? `<textarea id="token" readonly>${safeToken}</textarea><p><button onclick="navigator.clipboard.writeText(document.getElementById('token').value)">Copy refresh token</button></p><p>Paste it into GitHub Actions as <code>SPOTIFY_REFRESH_TOKEN</code>. Do not share it.</p>` : ''}`;
}

export default async function handler(req, res) {
  try {
    const query = new URL(req.url, 'https://dwho.vercel.app').searchParams;
    if (query.get('error')) return res.status(400).send(page(`Spotify authorization failed: ${query.get('error')}`));
    if (query.get('state') !== cookieValue(req, 'spotify_oauth_state')) return res.status(400).send(page('Authorization state did not match. Start again.'));
    const verifier = cookieValue(req, 'spotify_oauth_verifier');
    const code = query.get('code');
    if (!code || !verifier) return res.status(400).send(page('Missing Spotify authorization code. Start again.'));
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ client_id: clientId, grant_type: 'authorization_code', code, redirect_uri: redirectUri, code_verifier: verifier }),
    });
    const data = await tokenResponse.json();
    if (!tokenResponse.ok || !data.refresh_token) return res.status(502).send(page(`Spotify token exchange failed: ${data.error || tokenResponse.status}`));
    res.setHeader('Set-Cookie', ['spotify_oauth_state=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0', 'spotify_oauth_verifier=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0']);
    return res.status(200).send(page('Authorization succeeded. Copy this refresh token into GitHub Actions.', data.refresh_token));
  } catch (error) {
    console.error('Spotify callback failed:', error);
    return res.status(500).send(page('Spotify authorization could not be completed.'));
  }
}
