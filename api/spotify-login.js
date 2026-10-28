import { createHash, randomBytes } from 'node:crypto';

const clientId = process.env.SPOTIFY_CLIENT_ID || '74b02a5bae4d4fe68eb5f7e05262985c';
const redirectUri = 'https://dwho.vercel.app/api/spotify-callback';

export default function handler(req, res) {
  const verifier = randomBytes(64).toString('base64url');
  const state = randomBytes(24).toString('base64url');
  const challenge = createHash('sha256').update(verifier).digest('base64url');
  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirectUri,
    code_challenge_method: 'S256',
    code_challenge: challenge,
    state,
    scope: 'user-top-read',
  });
  res.setHeader('Set-Cookie', [
    `spotify_oauth_state=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
    `spotify_oauth_verifier=${verifier}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
  ]);
  res.writeHead(302, { Location: `https://accounts.spotify.com/authorize?${params}` });
  res.end();
}
