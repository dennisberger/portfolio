# Contact Form Playbook (Cloudflare Pages + Resend + Turnstile)

This playbook is a complete, reusable recipe for adding a bot-protected contact form to any static site deployed on **Cloudflare Pages**. It was forged on `ignyte.me`; every gotcha we hit is called out so you don't hit them again.

## Starter prompt for a new Claude Code session

Paste this as the first message to a Claude Code session running inside the target site's repo. It tells the assistant to act on this playbook.

```
I want to add a contact form to this site. Use the playbook at
docs/contact-form-playbook.md in ignyte.me for the full recipe — ask
me to paste the relevant sections as you need them, or ask me to
re-paste the whole file.

Before writing any code, walk me through the Decision Points section
and confirm each answer. Before creating accounts, confirm the
Prerequisites are met. Treat the Gotchas section as things you must
not do wrong — each one cost us time before.

Stack of this site: <tell it: Astro static / Next.js static / Eleventy / plain HTML / etc.>
Domain: <e.g. example.com>
Existing email provider for the domain (inbound MX): <e.g. Fastmail / Gmail / None>
```

---

## Prerequisites

Before starting:

- [ ] Site is deployed on **Cloudflare Pages** (the stack assumes this — other hosts need their own function runtime).
- [ ] You control the **DNS** for the site's domain (can add TXT/MX records). Ideally at Cloudflare DNS, but any provider works.
- [ ] You have a **Resend account**. Free tier covers 3,000 emails/month and multiple domains per account.
- [ ] You have a real **inbox** that will receive form submissions (e.g. `support@yourdomain.com` routed via Fastmail/Gmail/Cloudflare Email Routing).
- [ ] You have **terminal access** to the repo locally and can run `npm run build`, `git push`, and — for full local testing — `npx wrangler pages dev`.

## Decision points

Ask the user each of these *before* writing code. Confirm before proceeding.

1. **Recipient address.** Where do form submissions land? (e.g. `support@yourdomain.com`.) This inbox must already exist and route to a real person. Prefer a role address (`support@`, `hello@`, `studio@`) over a personal one so it can be reassigned later.
2. **From address.** What address does the site send from? Must be on a verified Resend domain. Convention: `Site Name <role@domain.com>` — e.g. `"Acme Support <support@acme.com>"`. **Not** `noreply@` — see #4.
3. **Sender-friendly Reply-To on the notification email.** Standard wiring: the notification email (to you) has `Reply-To` set to the submitter, so hitting Reply in your inbox responds to them directly. Confirm yes.
4. **Auto-confirmation email to submitter.** Send a "we got your message" email back to the person who submitted? Confirm yes (recommended). If yes, set that email's `Reply-To` to your recipient address so replies land in your inbox, not a no-reply black hole.
5. **Success UX.** After submit: (a) swap the form inline with a success message, (b) redirect to a `/contact/thanks/` page, or (c) toast/banner. Inline swap is recommended (simplest, no extra page to maintain).
6. **Bot protection.** Cloudflare Turnstile (Managed mode = invisible for humans, only challenges suspicious traffic). Plus a honeypot field as a belt-and-suspenders fallback. Confirm yes.
7. **Fields collected.** Minimum: name, email, message. Anything else (company, phone, subject dropdown)? Keep it short — every extra field drops conversion ~10%.
8. **Min/max lengths.** Defaults: name 1–200 chars, email valid format + max 254, message 10–5000. Adjust if useful.
9. **Rate limiting.** The stack below has no rate limiter. Turnstile + honeypot handles 99% of abuse. If this site is high-value target, add Cloudflare Workers KV-backed rate limit (not covered here).
10. **Spec Resend key scope.** Create a dedicated **per-domain** Resend API key if possible, not a "Full access" key. Limits blast radius if leaked.

## Phase 1 — Accounts & keys

### Resend

1. Log into Resend → **Domains** → **Add Domain** → enter the site's domain (e.g. `acme.com`).
2. Resend shows a DKIM record, an SPF include, and usually an MX record for `send.acme.com`. **Keep this tab open** — you'll paste these into DNS next.
3. Do **not** verify yet. Add the DNS records first (Phase 2).
4. Once DNS propagates, come back → click **Verify**. Status goes green.
5. Create a **Resend API key**: **API Keys** → **Create API Key** → name `<site> contact form` → scope: **Sending access**, domain-scoped to the site's domain. Copy the `re_…` value. This is a **secret** — don't commit it.

### Cloudflare Turnstile

1. Cloudflare dashboard → **Turnstile** (left sidebar, under "Account Home" options).
2. **Add site** → name: `<site> contact form` → Hostnames: add the production domain AND `localhost` (for local testing).
3. Widget mode: **Managed** (invisible for humans, challenges suspicious).
4. Pre-Clearance: **No** (keeps the token scoped to the form; no spillover to other parts of the site).
5. Copy both:
   - **Site Key** (public, prefixed `0x…`) — safe to embed in HTML.
   - **Secret Key** (secret, prefixed `0x…`) — server-side only.

### Inbox alias

Make sure the recipient address exists in your mail provider:
- **Fastmail**: Settings → Aliases → add `role@domain.com` routed to your main inbox.
- **Gmail/Google Workspace**: group alias or a new user.
- **Cloudflare Email Routing** (free): `dash.cloudflare.com → Email → Email Routing` → create a custom address for the domain → destination = your real inbox. Requires Cloudflare proxying DNS.

## Phase 2 — DNS records (coexisting with existing email provider)

**Critical:** if the domain already sends/receives email via another provider (Fastmail, Google Workspace, etc.), **do not replace their DNS records**. Resend lives *alongside* them. Specifically:

- **MX records (inbound):** keep pointing at your existing provider. Resend's MX record, if any, is for a **subdomain** like `send.yourdomain.com` — it does not conflict with the root domain's MX.
- **SPF (TXT on root):** a domain can only have ONE SPF record. If you already have one, **merge** Resend's include into it. Example:
  ```
  v=spf1 include:spf.messagingengine.com include:_spf.resend.com ~all
  ```
  (Fastmail = `spf.messagingengine.com`. Google Workspace = `_spf.google.com`. Check your current record, add `include:_spf.resend.com` before `~all`.)
- **DKIM (TXT):** Resend's DKIM lives at its own selector (e.g. `resend._domainkey.send.yourdomain.com`). Fastmail's DKIM selectors (`fm1._domainkey`, `fm2._domainkey`, `fm3._domainkey`) coexist freely.
- **DMARC (TXT on `_dmarc`):** if you already have one, it'll apply to Resend too (since From address is on your verified domain).

Add records exactly as Resend shows them in the dashboard. Propagation is usually under 10 min; up to 24h. Click **Verify** in Resend once they're live.

## Phase 3 — Code

### 3a. Pages Function (server-side handler)

Create `functions/api/contact.ts` at the repo root. Cloudflare Pages auto-deploys any file under `functions/` as a serverless endpoint matching the URL path.

```ts
/**
 * Cloudflare Pages Function — contact form handler.
 *
 * Flow:
 *   1. Parse + validate submission.
 *   2. Verify Turnstile token.
 *   3. Send notification email to studio (Reply-To = submitter).
 *   4. Send auto-confirmation email to submitter (Reply-To = studio).
 *   5. Return JSON { ok: true } or { ok: false, error: "..." }.
 */

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
  /** Honeypot — must be empty. Bots typically fill every field. */
  website?: string;
  'cf-turnstile-response'?: string;
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

async function verifyTurnstile(token: string, secret: string, ip: string | null): Promise<boolean> {
  if (!token) return false;
  const body = new URLSearchParams();
  body.set('secret', secret);
  body.set('response', token);
  if (ip) body.set('remoteip', ip);
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST', body,
    });
    const data = (await res.json()) as { success?: boolean };
    return Boolean(data.success);
  } catch {
    return false;
  }
}

async function sendResendEmail(
  apiKey: string,
  payload: { from: string; to: string; subject: string; html: string; text: string; replyTo?: string }
): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        from: payload.from, to: payload.to, subject: payload.subject,
        html: payload.html, text: payload.text, reply_to: payload.replyTo,
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      return { ok: false, error: `resend ${res.status}: ${body.slice(0, 200)}` };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'fetch failed' };
  }
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.RESEND_API_KEY || !env.TURNSTILE_SECRET_KEY || !env.CONTACT_TO_EMAIL || !env.CONTACT_FROM_EMAIL) {
    return json({ ok: false, error: 'Server not configured' }, 500);
  }

  let data: ContactPayload;
  try {
    const contentType = request.headers.get('content-type') ?? '';
    if (contentType.includes('application/json')) {
      data = await request.json();
    } else {
      const form = await request.formData();
      data = Object.fromEntries(form.entries()) as ContactPayload;
    }
  } catch {
    return json({ ok: false, error: 'Invalid request body' }, 400);
  }

  // Honeypot: silently succeed so bots don't retry.
  if (data.website && data.website.trim().length > 0) {
    return json({ ok: true });
  }

  const name = (data.name ?? '').trim();
  const email = (data.email ?? '').trim();
  const message = (data.message ?? '').trim();

  if (!name || name.length > 200) return json({ ok: false, error: 'Name is required.' }, 400);
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return json({ ok: false, error: 'A valid email is required.' }, 400);
  }
  if (!message || message.length < 10 || message.length > 5000) {
    return json({ ok: false, error: 'Please write a message between 10 and 5000 characters.' }, 400);
  }

  const ip = request.headers.get('cf-connecting-ip');
  const turnstileOk = await verifyTurnstile(data['cf-turnstile-response'] ?? '', env.TURNSTILE_SECRET_KEY, ip);
  if (!turnstileOk) {
    return json({ ok: false, error: 'Bot check failed. Reload the page and try again.' }, 400);
  }

  // Notification → studio. Reply-To = submitter.
  const notify = await sendResendEmail(env.RESEND_API_KEY, {
    from: env.CONTACT_FROM_EMAIL,
    to: env.CONTACT_TO_EMAIL,
    subject: `New contact form: ${name}`,
    html: `
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
      <p><strong>Message:</strong></p>
      <p style="white-space:pre-wrap;">${escapeHtml(message)}</p>`,
    text: `New contact form submission\n\nName: ${name}\nEmail: ${email}\n\n${message}`,
    replyTo: email,
  });

  if (!notify.ok) {
    return json({ ok: false, error: 'Could not send your message. Email us directly instead.' }, 502);
  }

  // Auto-confirm → submitter. Reply-To = studio. Customize copy per site.
  await sendResendEmail(env.RESEND_API_KEY, {
    from: env.CONTACT_FROM_EMAIL,
    to: email,
    subject: 'We got your message',
    html: `
      <p>Hi ${escapeHtml(name.split(' ')[0] || name)},</p>
      <p>Thanks for reaching out. We've got your message and will reply within one business day.</p>
      <p>For reference, here's what you sent:</p>
      <blockquote style="border-left:3px solid #888;padding-left:1rem;color:#555;white-space:pre-wrap;">${escapeHtml(message)}</blockquote>
      <p>— The team</p>`,
    text: `Hi ${name.split(' ')[0] || name},\n\nThanks for reaching out. We've got your message and will reply within one business day.\n\nFor reference, here's what you sent:\n\n${message}\n\n— The team`,
    replyTo: env.CONTACT_TO_EMAIL,
  });

  return json({ ok: true });
};
```

### 3b. Form markup

**Astro** example — use as the starting point, adapt styles to the site's design system:

```astro
---
const TURNSTILE_SITE_KEY =
  import.meta.env.TURNSTILE_SITE_KEY ?? process.env.TURNSTILE_SITE_KEY ?? '';
---

<div class="contact-form-wrap" data-contact-wrap>
  <form class="contact-form" action="/api/contact" method="POST" data-contact-form>
    <div class="form-field">
      <label for="name">Name</label>
      <input type="text" id="name" name="name" required maxlength="200" autocomplete="name" />
    </div>
    <div class="form-field">
      <label for="email">Email</label>
      <input type="email" id="email" name="email" required maxlength="254" autocomplete="email" />
    </div>
    <div class="form-field">
      <label for="message">Message</label>
      <textarea id="message" name="message" required minlength="10" maxlength="5000" rows="5"></textarea>
    </div>

    {/* Honeypot — hidden from humans, catches dumb bots. */}
    <div class="form-honeypot" aria-hidden="true">
      <label for="website">Website (leave blank)</label>
      <input type="text" id="website" name="website" tabindex="-1" autocomplete="off" />
    </div>

    {/* Invisible Turnstile — only shows UI for suspicious visitors. */}
    {TURNSTILE_SITE_KEY && (
      <div class="cf-turnstile" data-sitekey={TURNSTILE_SITE_KEY} data-size="flexible"></div>
    )}

    <p class="form-error" data-contact-error hidden role="alert"></p>
    <button type="submit" data-contact-submit>Send message</button>
  </form>

  <div class="contact-success" data-contact-success hidden role="status">
    <h2>Message received.</h2>
    <p>We've got your note and a confirmation is on its way to your inbox.</p>
  </div>
</div>

{TURNSTILE_SITE_KEY && (
  <script is:inline src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
)}

<script>
  const form = document.querySelector<HTMLFormElement>('[data-contact-form]');
  const wrap = document.querySelector<HTMLElement>('[data-contact-wrap]');
  const submit = document.querySelector<HTMLButtonElement>('[data-contact-submit]');
  const errorEl = document.querySelector<HTMLElement>('[data-contact-error]');
  const successEl = document.querySelector<HTMLElement>('[data-contact-success]');

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!submit) return;
    if (errorEl) { errorEl.textContent = ''; errorEl.hidden = true; }
    submit.disabled = true;
    submit.textContent = 'Sending…';
    try {
      const res = await fetch('/api/contact', { method: 'POST', body: new FormData(form) });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (res.ok && data.ok) {
        if (form) form.hidden = true;
        if (successEl) successEl.hidden = false;
        wrap?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
      if (errorEl) {
        errorEl.textContent = data.error ?? 'Something went wrong. Please try again, or use the email link above.';
        errorEl.hidden = false;
      }
    } catch {
      if (errorEl) {
        errorEl.textContent = 'Network error. Please try again, or use the email link above.';
        errorEl.hidden = false;
      }
    } finally {
      submit.disabled = false;
      submit.textContent = 'Send message';
    }
  });
</script>
```

**For non-Astro frameworks**, the only change is how you pass `TURNSTILE_SITE_KEY` to the template:
- **Next.js:** `process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY` (requires `NEXT_PUBLIC_` prefix for client-side).
- **Eleventy / plain HTML:** inject at build time via env variable + template engine (e.g. Nunjucks, `{{ env.TURNSTILE_SITE_KEY }}`).
- **React/Vue component libraries:** there are npm packages like `@marsidev/react-turnstile` that wrap the widget; or just drop the `<div class="cf-turnstile">` in directly.

### 3c. CSS gotcha — fix this or the success swap breaks

If the form has `display: flex` (or any non-block display), the HTML `hidden` attribute will NOT hide it, because the CSS rule wins the specificity battle with the UA stylesheet's `[hidden] { display: none }`. Add this explicitly:

```css
.contact-form[hidden],
.contact-success[hidden] {
  display: none;
}
```

Without this, users will see the form AND the success message stacked together after submit.

## Phase 4 — Environment variables

### Locally — `.env` (gitignored)

```
RESEND_API_KEY="re_<from-resend>"
CONTACT_TO_EMAIL="support@yourdomain.com"
CONTACT_FROM_EMAIL="Your Site <support@yourdomain.com>"
TURNSTILE_SITE_KEY="0x<site-key>"
TURNSTILE_SECRET_KEY="0x<secret-key>"
```

Make sure `.env` is in `.gitignore`.

### Locally — `.dev.vars` (for `wrangler pages dev`)

Cloudflare Pages Functions do NOT read `.env`. For local function testing via `wrangler pages dev`, create a `.dev.vars` at repo root with the same values. Add `.dev.vars` to `.gitignore`.

```
RESEND_API_KEY="re_<from-resend>"
CONTACT_TO_EMAIL="support@yourdomain.com"
CONTACT_FROM_EMAIL="Your Site <support@yourdomain.com>"
TURNSTILE_SECRET_KEY="0x<secret-key>"
```

(Site key is public and read by the framework build, not the function — so it stays in `.env`, not `.dev.vars`.)

### Production — Cloudflare Pages dashboard

Cloudflare Pages → your project → **Settings → Environment variables** (production AND preview if you want preview deployments to work):

| Variable | Value | Encrypt? |
|---|---|---|
| `RESEND_API_KEY` | `re_…` | **Yes** |
| `CONTACT_TO_EMAIL` | `support@yourdomain.com` | No |
| `CONTACT_FROM_EMAIL` | `Your Site <support@yourdomain.com>` | No |
| `TURNSTILE_SITE_KEY` | `0x…` (public) | No |
| `TURNSTILE_SECRET_KEY` | `0x…` (secret) | **Yes** |

Trigger a rebuild after saving (env vars only apply to new builds).

## Phase 5 — Local testing

Build and run under Wrangler to exercise the Pages Function locally. Astro's own `npm run dev` does **not** run Pages Functions — it only serves the Astro pages. So for end-to-end local testing:

```bash
npm run build
npx wrangler pages dev dist
```

This serves the built site on `http://localhost:8788` (or similar) and runs functions against your `.dev.vars`. Submit the form; you should receive both emails.

## Phase 6 — Deploy + verify

1. Commit + push. Cloudflare Pages auto-deploys.
2. Visit `https://yourdomain.com/contact/`.
3. Submit the form with a real email you can check.
4. Verify:
   - Inline success message appears, form disappears.
   - Your recipient inbox receives the notification email with `Reply-To` = submitter.
   - The submitter inbox receives the auto-confirmation with `Reply-To` = recipient.
5. Test failure cases:
   - Short message (< 10 chars) → see inline error.
   - Invalid email → see inline error.
   - Turnstile widget visible? Submit; widget should silently pass in Managed mode. If it ever challenges, your visitor clicks to solve, then continues.
6. Check the browser Network tab — the `POST /api/contact` request should return `200 {"ok": true}`.

## Gotchas we've already hit — don't repeat

1. **`functions/` in `.gitignore` silently breaks deploys.** Some starter templates add this. Remove it or the handler never deploys. Verify with `git check-ignore functions/api/contact.ts` — should output nothing.
2. **`[hidden]` attribute loses to `display: flex`.** Add explicit `.contact-form[hidden] { display: none }` rules. See Phase 3c.
3. **Email literal leaks beyond `mailto:` links.**
   - **JSON-LD schemas** with an `email` field: Cloudflare Email Obfuscation cannot rewrite strings inside `<script type="application/ld+json">`. Either omit the email from the schema (use `contactPoint` with a `url` instead), or use a dedicated address that's expendable.
   - **Inline `<script>` JS string literals** (e.g. error messages like `"Email us at support@..."`): same problem — obfuscation doesn't touch `<script>`. Phrase errors generically ("use the email link above") instead of embedding the address.
4. **Fastmail + Resend SPF**: one TXT record, merge the includes. Two separate SPF records on the same hostname breaks SPF entirely.
5. **Resend MX on `send.` subdomain** does NOT interfere with the root domain's MX. They're per-hostname.
6. **Don't use `noreply@`.** Use a role address that routes to a real inbox so replies don't vanish.
7. **`wrangler pages dev` reads `.dev.vars`, not `.env`.** Mirror the secrets both places for local dev.
8. **Turnstile "Pre-Clearance" = No** for contact forms. Keeps the token scoped to the form only.
9. **Rotate API keys if they pass through chat or any transient channel.** Resend, Turnstile, etc. — regenerate in their dashboards before going live.
10. **Test the deploy hook after env vars are added.** Env vars only take effect on *new* builds. `curl -X POST <deploy-hook-url>` to trigger one.

## Appendix — copy-pasteable checklist

```
[ ] Resend: add domain, capture DKIM/SPF/MX records.
[ ] DNS: add records. Merge SPF include if existing provider. Wait + verify in Resend.
[ ] Resend: create domain-scoped API key (Sending access).
[ ] Turnstile: create site (Managed, no Pre-Clearance). Capture site + secret keys.
[ ] Inbox: role alias (e.g. support@) exists and routes to real inbox.
[ ] Code: functions/api/contact.ts — drop in the handler.
[ ] Code: contact page — form markup, Turnstile widget, client-side submit JS.
[ ] Code: CSS — `.contact-form[hidden] { display: none }` rule added.
[ ] .gitignore: ensure `.env`, `.dev.vars` ignored; `functions/` NOT ignored.
[ ] .env (local): 5 vars set.
[ ] .dev.vars (local): 4 server-side vars set.
[ ] Cloudflare Pages env vars: 5 vars set (production; preview optional).
[ ] Rebuild Cloudflare Pages after env vars change.
[ ] Local test: `npm run build && npx wrangler pages dev dist` → submit works, both emails arrive.
[ ] Production test: submit on live domain, verify both emails + Reply-To headers.
[ ] Audit: grep site source for any email literal that's NOT a `mailto:` link. Remove or obfuscate.
[ ] Rotate any keys that passed through chat.
```
