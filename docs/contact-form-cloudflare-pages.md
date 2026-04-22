# Contact Form Setup

This site now posts the contact form to `/api/contact` through a Cloudflare Pages Function and keeps success/error feedback inline on `/contact/`.

## Variables

Set these locally in `.env`:

```bash
RESEND_API_KEY="re_..."
CONTACT_TO_EMAIL="hello@dennisberger.me"
CONTACT_FROM_EMAIL="Dennis Berger <hello@dennisberger.me>"
TURNSTILE_SITE_KEY="0x..."
TURNSTILE_SECRET_KEY="0x..."
```

Set these locally in `.dev.vars` for `wrangler pages dev`:

```bash
RESEND_API_KEY="re_..."
CONTACT_TO_EMAIL="hello@dennisberger.me"
CONTACT_FROM_EMAIL="Dennis Berger <hello@dennisberger.me>"
TURNSTILE_SECRET_KEY="0x..."
```

Set these in Cloudflare Pages under `Workers & Pages -> this project -> Settings -> Variables and Secrets`:

- `RESEND_API_KEY` as a secret
- `CONTACT_TO_EMAIL`
- `CONTACT_FROM_EMAIL`
- `TURNSTILE_SITE_KEY`
- `TURNSTILE_SECRET_KEY` as a secret

After updating dashboard variables, trigger a new deployment so the build and function pick them up.

## Local test

```bash
npm run build
npx wrangler pages dev dist
```

Then open `/contact/`, submit the form, and confirm:

- the request to `/api/contact` returns `200`
- the inline success state appears on the contact page
- the inbox at `CONTACT_TO_EMAIL` receives the notification email
- the sender receives the confirmation email
