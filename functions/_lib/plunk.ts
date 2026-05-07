/**
 * Minimal Plunk API client for Cloudflare Pages Functions.
 *
 * Portfolio currently only sends transactional email (contact form notify +
 * confirmation). If list management or campaigns are ever needed here, port
 * the relevant helpers from synoptro.com's full plunk.ts.
 *
 * Auth: `Authorization: Bearer <PLUNK_API_KEY>` (server secret key).
 */

export interface PlunkEnv {
  PLUNK_API_URL: string;
  PLUNK_API_KEY: string;
}

export type PlunkResult =
  | { ok: true }
  | { ok: false; status: number; error: string };

/**
 * Parse an RFC-5322-ish "Name <email@host>" string into Plunk's separate
 * name + email fields. Resend accepted the combined form; Plunk rejects it
 * (HTTP 400). Bare emails pass through unchanged.
 */
function parseAddress(input: string): { email: string; name?: string } {
  const trimmed = input.trim();
  const match = trimmed.match(/^\s*(?:"?([^"<]+?)"?\s+)?<([^>]+)>\s*$/);
  if (match) {
    const name = match[1]?.trim();
    return { email: match[2].trim(), ...(name ? { name } : {}) };
  }
  return { email: trimmed };
}

async function readPlunkError(response: Response): Promise<string> {
  // Plunk's error shapes vary by endpoint ({message}, {error}, {errors:[]},
  // plain text). Return the raw body so failures aren't hidden behind a stub.
  const text = await response.text().catch(() => '');
  if (!text) return `Plunk ${response.status}`;
  return `${response.status}: ${text.slice(0, 500)}`;
}

export interface PlunkSendPayload {
  to: string | string[];
  subject: string;
  body: string;       // HTML — Plunk derives plain text automatically. Sending a `text` field 400s.
  from?: string;      // accepts bare email or "Name <email>"
  name?: string;      // friendly name for `from` (overrides any name parsed from `from`)
  reply?: string;     // reply-to
  /**
   * If false, Plunk treats the send as a transactional system message: the
   * recipient's `subscribed` state is not changed and no unsubscribe footer
   * is appended. Default `true` (marketing-eligible). Pass `false` for
   * confirmation/notification emails.
   */
  subscribed?: boolean;
  headers?: Record<string, string>;
}

export async function plunkSendTransactional(
  env: PlunkEnv,
  payload: PlunkSendPayload,
): Promise<PlunkResult> {
  const fromParsed = payload.from ? parseAddress(payload.from) : null;
  const replyParsed = payload.reply ? parseAddress(payload.reply) : null;
  const name = payload.name ?? fromParsed?.name;

  try {
    const url = `${env.PLUNK_API_URL.replace(/\/+$/, '')}/send`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${env.PLUNK_API_KEY}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        to: payload.to,
        subject: payload.subject,
        body: payload.body,
        ...(fromParsed ? { from: fromParsed.email } : {}),
        ...(name ? { name } : {}),
        ...(replyParsed ? { reply: replyParsed.email } : {}),
        ...(payload.subscribed !== undefined ? { subscribed: payload.subscribed } : {}),
        ...(payload.headers ? { headers: payload.headers } : {}),
      }),
    });

    if (!response.ok) {
      return { ok: false, status: response.status, error: await readPlunkError(response) };
    }
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      error: error instanceof Error ? error.message : 'Plunk send request failed',
    };
  }
}
