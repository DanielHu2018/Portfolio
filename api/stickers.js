import { createHash, randomBytes } from 'node:crypto';
import { sendJson, supabaseConfig, supabaseHeaders } from '../lib/supabase.js';

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') return sendJson(res, 405, { error: 'Method not allowed' });
  try {
    const { url, key } = supabaseConfig();
    const headers = supabaseHeaders(key);
    if (req.method === 'GET') {
      const response = await fetch(`${url}/rest/v1/stickers?select=id,x,y,k,r,n&order=created_at.asc`, { headers });
      const data = await response.json();
      return sendJson(res, response.ok ? 200 : response.status, response.ok ? data : { error: 'Unable to load stickers' });
    }
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const x = Number(body.x); const y = Number(body.y); const k = Math.trunc(Number(body.k)); const r = Number(body.r); const n = String(body.n || '').replace(/\s+/g, ' ').trim().slice(0, 40);
    if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(k) || !Number.isFinite(r) || x < 12 || x > 88 || y < 10 || y > 90 || k < 0 || k > 7 || r < -15 || r > 15) return sendJson(res, 400, { error: 'Invalid sticker' });
    // The placer gets a secret token back once; only its hash is stored, and DELETE /api/stickers/:id checks it.
    const token = randomBytes(24).toString('base64url');
    const owner_hash = createHash('sha256').update(token).digest('hex');
    const insert = (row) => fetch(`${url}/rest/v1/stickers?select=id,x,y,k,r,n`, { method: 'POST', headers: { ...headers, Prefer: 'return=representation' }, body: JSON.stringify(row) });
    let response = await insert({ x, y, k, r, n, owner_hash });
    let owned = true;
    if (!response.ok && response.status === 400) {
      // Before the owner_hash migration runs, save the sticker without it (it just can't be deleted by its placer).
      const err = await response.clone().json().catch(() => ({}));
      if (String(err.message || '').includes('owner_hash')) { response = await insert({ x, y, k, r, n }); owned = false; }
    }
    const data = await response.json();
    if (!response.ok) return sendJson(res, response.status, { error: 'Unable to save sticker' });
    return sendJson(res, 201, owned ? { ...data[0], token } : data[0]);
  } catch (error) {
    return sendJson(res, 500, { error: error instanceof Error ? error.message : 'Sticker service unavailable' });
  }
}
