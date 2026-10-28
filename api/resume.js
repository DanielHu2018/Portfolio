import { readFile } from 'node:fs/promises';
import path from 'node:path';

const filename = 'DanielHu_Resume_08_06_2026.pdf';

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD');
    return res.status(405).send('Method not allowed');
  }

  try {
    const file = await readFile(path.join(process.cwd(), 'public', 'assets', filename));
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Cache-Control', 'public, max-age=3600');
    if (req.method === 'HEAD') return res.status(200).end();
    return res.status(200).send(file);
  } catch {
    return res.status(404).send('Resume not found');
  }
}
