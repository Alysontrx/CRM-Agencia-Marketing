import fetch from 'node-fetch';

/**
 * Send an email via Brevo (Sendinblue) SMTP API.
 * @param payload Object containing sender, recipient, subject and html content.
 */
export async function sendEmail(payload: {
  sender: { name: string; email: string };
  to: { email: string }[];
  subject: string;
  htmlContent: string;
  attachment?: { name: string; content: string }[];
}) {
  const BREVO_API_KEY = process.env.BREVO_API_KEY;
  if (!BREVO_API_KEY) {
    throw new Error('Missing BREVO_API_KEY environment variable');
  }
  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'api-key': BREVO_API_KEY,
    },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Error sending email via Brevo');
  }
  console.log('E‑mail enviado via Brevo:', data);
  return data;
}
