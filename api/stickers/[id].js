import { sendJson, supabaseConfig, supabaseHeaders } from '../../lib/supabase.js';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') return sendJson(res, 405, { error: 'Method not allowed' });
  if (!process.env.STICKER_ADMIN_TOKEN || req.headers['x-admin-token'] !== process.env.STICKER_ADMIN_TOKEN) return sendJson(res, 401, { error: 'Unauthorized' });
  try {
    const { url, key } = supabaseConfig();
    const id = encodeURIComponent(req.query.id);
    const response = await fetch(`${url}/rest/v1/stickers?id=eq.${id}`, { method: 'DELETE', headers: supabaseHeaders(key) });
    if (!response.ok) return sendJson(res, response.status, { error: 'Unable to delete sticker' });
    return res.status(204).end();
  } catch {
    return sendJson(res, 500, { error: 'Sticker service unavailable' });
  }
}
