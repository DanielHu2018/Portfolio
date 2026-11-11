import { createHash } from 'node:crypto';
import { sendJson, supabaseConfig, supabaseHeaders } from '../../lib/supabase.js';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// DELETE /api/stickers/:id with either the admin token (any sticker) or the
// x-sticker-token the placer got back from POST /api/stickers (that sticker only).
export default async function handler(req, res) {
  if (req.method !== 'DELETE') return sendJson(res, 405, { error: 'Method not allowed' });
  const id = String(req.query.id || '');
  if (!UUID.test(id)) return sendJson(res, 400, { error: 'Invalid sticker id' });
  const admin = !!process.env.STICKER_ADMIN_TOKEN && req.headers['x-admin-token'] === process.env.STICKER_ADMIN_TOKEN;
  const token = req.headers['x-sticker-token'];
  if (!admin && (typeof token !== 'string' || !token)) return sendJson(res, 401, { error: 'Unauthorized' });
  try {
    const { url, key } = supabaseConfig();
    const owner = admin ? '' : `&owner_hash=eq.${createHash('sha256').update(token).digest('hex')}`;
    const response = await fetch(`${url}/rest/v1/stickers?id=eq.${id}${owner}&select=id`, { method: 'DELETE', headers: { ...supabaseHeaders(key), Prefer: 'return=representation' } });
    if (!response.ok) return sendJson(res, response.status, { error: 'Unable to delete sticker' });
    const rows = await response.json();
    if (Array.isArray(rows) && rows.length > 0) return res.status(204).end();
    // Nothing matched: either the sticker is already gone, or the token isn't the one it was placed with.
    const check = await fetch(`${url}/rest/v1/stickers?id=eq.${id}&select=id`, { headers: supabaseHeaders(key) });
    const found = check.ok ? await check.json() : [];
    if (!Array.isArray(found) || found.length === 0) return sendJson(res, 404, { error: 'Sticker not found' });
    return sendJson(res, 403, { error: 'You can only remove stickers you placed' });
  } catch {
    return sendJson(res, 500, { error: 'Sticker service unavailable' });
  }
}
