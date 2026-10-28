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
    const response = await fetch(`${url}/rest/v1/stickers`, { method: 'POST', headers: { ...headers, Prefer: 'return=representation' }, body: JSON.stringify({ x, y, k, r, n }) });
    const data = await response.json();
    return sendJson(res, response.ok ? 201 : response.status, response.ok ? data[0] : { error: 'Unable to save sticker' });
  } catch (error) {
    return sendJson(res, 500, { error: error instanceof Error ? error.message : 'Sticker service unavailable' });
  }
}
