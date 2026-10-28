const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID || '74b02a5bae4d4fe68eb5f7e05262985c';

function escapeXml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function textLine(text, x, y, size, weight = 400, anchor = 'start') {
  return `<text x="${x}" y="${y}" font-family="monospace" font-size="${size}px" font-weight="${weight}" text-anchor="${anchor}" fill="#111">${escapeXml(text)}</text>`;
}

function receiptSvg(tracks) {
  const width = 720;
  const rowHeight = 58;
  const height = 190 + tracks.length * rowHeight + 120;
  const now = new Date();
  const month = now.toLocaleString('en-US', { month: 'long', year: 'numeric', timeZone: 'America/New_York' });
  const rows = tracks.map((track, index) => {
    const name = track.name.length > 30 ? `${track.name.slice(0, 29)}…` : track.name;
    const artist = track.artists.map((artist) => artist.name).join(', ');
    const artistText = artist.length > 34 ? `${artist.slice(0, 33)}…` : artist;
    const y = 190 + index * rowHeight;
    return [
      textLine(String(index + 1).padStart(2, '0'), 52, y, 22, 700),
      textLine(name, 100, y, 22, 700),
      textLine(artistText, 100, y + 25, 16),
      textLine('SPOTIFY', width - 52, y, 13, 700, 'end'),
    ].join('');
  }).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <rect width="100%" height="100%" fill="#fffdf5"/>
    ${textLine('DANIEL HU', 52, 58, 34, 800)}
    ${textLine('MONTHLY LISTENING RECEIPT', 52, 92, 18, 700)}
    ${textLine(month.toUpperCase(), width - 52, 58, 18, 700, 'end')}
    ${textLine('TOP TRACKS · LAST 4 WEEKS', width - 52, 92, 14, 400, 'end')}
    <path d="M52 120 H${width - 52}" stroke="#111" stroke-width="3" stroke-dasharray="10 8"/>
    ${rows}
    <path d="M52 ${height - 88} H${width - 52}" stroke="#111" stroke-width="3" stroke-dasharray="10 8"/>
    ${textLine(`${tracks.length} TRACKS`, 52, height - 48, 18, 700)}
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
    const refresh = (headers, body) => fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers,
      body,
    });
    const pkceBody = new URLSearchParams({ client_id: CLIENT_ID, grant_type: 'refresh_token', refresh_token: refreshToken });
    let tokenResponse = await refresh({ 'Content-Type': 'application/x-www-form-urlencoded' }, pkceBody);
    if (!tokenResponse.ok && clientSecret) {
      const basic = Buffer.from(`${CLIENT_ID}:${clientSecret}`).toString('base64');
      tokenResponse = await refresh({ Authorization: `Basic ${basic}`, 'Content-Type': 'application/x-www-form-urlencoded' }, new URLSearchParams({ grant_type: 'refresh_token', refresh_token: refreshToken }));
    }
    if (!tokenResponse.ok) throw new Error(`Spotify token refresh failed (${tokenResponse.status})`);
    const token = await tokenResponse.json();

    const tracksResponse = await fetch('https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=10', {
      headers: { Authorization: `Bearer ${token.access_token}` },
    });
    if (!tracksResponse.ok) throw new Error(`Spotify top tracks failed (${tracksResponse.status})`);
    const data = await tracksResponse.json();
    const tracks = Array.isArray(data.items) ? data.items : [];
    if (!tracks.length) throw new Error('Spotify returned no top tracks');

    res.status(200);
    res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    res.send(receiptSvg(tracks));
  } catch (error) {
    console.error('Receipt generation failed:', error);
    res.status(502).setHeader('Content-Type', 'text/plain; charset=utf-8').send('Unable to generate the Spotify receipt right now.');
  }
}
