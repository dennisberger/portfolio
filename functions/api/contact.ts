interface Env {
  RESEND_API_KEY: string;
  CONTACT_TO_EMAIL: string;
  CONTACT_FROM_EMAIL: string;
  TURNSTILE_SECRET_KEY: string;
}

interface ContactPayload {
  name?: string;
  email?: string;
  message?: string;
  website?: string;
  'cf-turnstile-response'?: string;
}

interface TurnstileResponse {
  success?: boolean;
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

async function verifyTurnstile(token: string, secret: string, ip: string | null): Promise<boolean> {
  if (!token) return false;

  const body = new URLSearchParams();
  body.set('secret', secret);
  body.set('response', token);
  if (ip) body.set('remoteip', ip);

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body,
    });
    const data = (await response.json()) as TurnstileResponse;
    return Boolean(data.success);
  } catch {
    return false;
  }
}

async function sendResendEmail(
  apiKey: string,
  payload: {
    from: string;
    to: string;
    subject: string;
    html: string;
    text: string;
    replyTo?: string;
  },
): Promise<{ ok: boolean; error?: string }> {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${apiKey}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        from: payload.from,
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
        text: payload.text,
        reply_to: payload.replyTo,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      return { ok: false, error: `resend ${response.status}: ${body.slice(0, 240)}` };
    }

    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Unknown Resend error',
    };
  }
}

function notificationEmailHtml(name: string, email: string, message: string): string {
  return `
    <div style="background:#fdfcf9;padding:32px;font-family:Switzer,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#1f1913;">
      <div style="max-width:680px;margin:0 auto;border:1px solid #d7d1c7;background:#fffdfa;padding:32px;">
        <p style="margin:0 0 10px;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#655f59;">Dennis Berger</p>
        <h1 style="margin:0 0 20px;font-family:Zodiak,Georgia,'Times New Roman',serif;font-size:34px;line-height:1.05;font-weight:400;">New contact form submission.</h1>
        <p style="margin:0 0 10px;font-size:16px;line-height:1.7;"><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p style="margin:0 0 10px;font-size:16px;line-height:1.7;"><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}" style="color:#8f0d6f;">${escapeHtml(email)}</a></p>
        <div style="margin-top:24px;padding-top:24px;border-top:1px solid #e5dfd5;">
          <p style="margin:0 0 12px;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#655f59;">Message</p>
          <p style="margin:0;font-size:16px;line-height:1.8;white-space:pre-wrap;">${escapeHtml(message)}</p>
        </div>
      </div>
    </div>
  `;
}

function notificationEmailText(name: string, email: string, message: string): string {
  return `New contact form submission

Name: ${name}
Email: ${email}

${message}`;
}

function confirmationEmailHtml(name: string, message: string): string {
  const firstName = escapeHtml(name.split(/\s+/)[0] || name);

  return `
    <div style="background:#fdfcf9;padding:32px;font-family:Switzer,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#1f1913;">
      <div style="max-width:680px;margin:0 auto;border:1px solid #d7d1c7;background:#fffdfa;padding:32px;">
        <p style="margin:0 0 10px;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#655f59;">Dennis Berger</p>
        <h1 style="margin:0 0 20px;font-family:Zodiak,Georgia,'Times New Roman',serif;font-size:34px;line-height:1.05;font-weight:400;">Message received.</h1>
        <p style="margin:0 0 16px;font-size:16px;line-height:1.8;">Hi ${firstName},</p>
        <p style="margin:0 0 16px;font-size:16px;line-height:1.8;">Thanks for reaching out. Your note came through and I’ll reply as soon as I can.</p>
        <p style="margin:0 0 16px;font-size:16px;line-height:1.8;">For reference, here’s the message you sent:</p>
        <blockquote style="margin:0;padding:18px 20px;border-left:3px solid #1867b7;background:#eef5ff;color:#1f1913;white-space:pre-wrap;">${escapeHtml(message)}</blockquote>
      </div>
    </div>
  `;
}

function confirmationEmailText(name: string, message: string): string {
  const firstName = name.split(/\s+/)[0] || name;

  return `Hi ${firstName},

Thanks for reaching out. Your note came through and I'll reply as soon as I can.

For reference, here's the message you sent:

${message}`;
}

export const onRequestPost: PagesFunction<Env> = async ({ env, request }) => {
  if (
    !env.RESEND_API_KEY ||
    !env.CONTACT_TO_EMAIL ||
    !env.CONTACT_FROM_EMAIL ||
    !env.TURNSTILE_SECRET_KEY
  ) {
    return json({ ok: false, error: 'Server configuration is incomplete.' }, 500);
  }

  let payload: ContactPayload;

  try {
    const contentType = request.headers.get('content-type') ?? '';
    if (contentType.includes('application/json')) {
      payload = (await request.json()) as ContactPayload;
    } else {
      const formData = await request.formData();
      payload = Object.fromEntries(formData.entries()) as ContactPayload;
    }
  } catch {
    return json({ ok: false, error: 'Invalid request body.' }, 400);
  }

  if ((payload.website ?? '').trim().length > 0) {
    return json({ ok: true });
  }

  const name = (payload.name ?? '').trim();
  const email = (payload.email ?? '').trim();
  const message = (payload.message ?? '').trim();

  if (!name || name.length > 200) {
    return json({ ok: false, error: 'Please enter your name.' }, 400);
  }

  if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ ok: false, error: 'Please enter a valid email address.' }, 400);
  }

  if (!message || message.length < 10 || message.length > 5000) {
    return json({ ok: false, error: 'Please write a message between 10 and 5000 characters.' }, 400);
  }

  const ip = request.headers.get('cf-connecting-ip');
  const turnstileOk = await verifyTurnstile(
    payload['cf-turnstile-response'] ?? '',
    env.TURNSTILE_SECRET_KEY,
    ip,
  );

  if (!turnstileOk) {
    return json({ ok: false, error: 'Bot check failed. Reload the page and try again.' }, 400);
  }

  const notification = await sendResendEmail(env.RESEND_API_KEY, {
    from: env.CONTACT_FROM_EMAIL,
    to: env.CONTACT_TO_EMAIL,
    subject: `New contact form message from ${name}`,
    html: notificationEmailHtml(name, email, message),
    text: notificationEmailText(name, email, message),
    replyTo: email,
  });

  if (!notification.ok) {
    return json(
      {
        ok: false,
        error: 'Your message could not be sent right now. Please try again in a moment.',
      },
      502,
    );
  }

  await sendResendEmail(env.RESEND_API_KEY, {
    from: env.CONTACT_FROM_EMAIL,
    to: email,
    subject: 'I received your message',
    html: confirmationEmailHtml(name, message),
    text: confirmationEmailText(name, message),
    replyTo: env.CONTACT_TO_EMAIL,
  });

  return json({ ok: true });
};
