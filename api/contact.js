const recipient = 'aaronsamuel0205@gmail.com';
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value, maxLength) {
  return typeof value === 'string' ? value.trim().replace(/[\u0000-\u001f\u007f]/g, '').slice(0, maxLength) : '';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const body = req.body || {};
  const name = clean(body.name, 100);
  const email = clean(body.email, 254);
  const subject = clean(body.subject, 160) || 'General enquiry';
  const message = clean(body.message, 4000);

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }
  if (!emailPattern.test(email) || email.includes('\r') || email.includes('\n')) {
    return res.status(400).json({ error: 'Please provide a valid email address.' });
  }
  if (message.length < 20) {
    return res.status(400).json({ error: 'Please make your message at least 20 characters.' });
  }
  if (!process.env.RESEND_API_KEY) {
    return res.status(503).json({ error: 'The email service is not configured yet. Please use the email link instead.' });
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Portfolio Contact <onboarding@resend.dev>',
        to: [recipient],
        reply_to: email,
        subject: `Portfolio Contact — ${subject}`,
        text: [`Name: ${name}`, `Email: ${email}`, `Subject: ${subject}`, '', 'Message:', message].join('\n'),
      }),
    });

    if (!response.ok) {
      console.error('Resend error:', await response.text());
      return res.status(502).json({ error: 'The email service could not send your message. Please try again or use the email link.' });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({ error: 'Unable to send your message right now. Please try again.' });
  }
}
