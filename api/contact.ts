import { VercelRequest, VercelResponse } from '@vercel/node';

const ALLOWED_ORIGIN = 'https://santoshkuidev.github.io';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin;

  if (origin === ALLOWED_ORIGIN) {
    res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  } else {
    // For preflight, respond with 403 if not allowed
    if (req.method === 'OPTIONS') {
      return res.status(403).end();
    }
    return res.status(403).json({ error: 'CORS: This domain is not allowed.' });
  }

  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { name, email, subject, message } = req.body;

  const apiRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'onboarding@resend.dev',
      to: 'santoshkuidev@gmail.com',
      subject: `${name} - From Portfolio 2.0`,
      html: `<h1>Someone's trying to reach you !!</h1><p><b>Name:</b> ${name}</p><p><b>Email:</b> ${email}</p><p><b>Message:</b> ${message}</p>`,
    }),
  });

  if (apiRes.ok) {
    return res.status(200).json({ ok: true });
  } else {
    const error = await apiRes.json();
    return res.status(500).json({ ok: false, error });
  }
}
