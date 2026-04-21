import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

const SITE = 'https://dennisberger.me';
const TITLE = 'Dennis Berger — Case studies';
const DESCRIPTION = 'Design operations and UX strategy case studies from Dennis Berger.';

const escape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

export const GET: APIRoute = async () => {
  const studies = (await getCollection('caseStudies')).sort((a, b) => a.data.order - b.data.order);
  const items = studies
    .map(s => {
      const url = `${SITE}/work/${s.data.slug}/`;
      const pub = s.data.publishedAt ?? s.data.updatedAt ?? new Date();
      return `    <item>
      <title>${escape(s.data.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escape(s.data.excerpt)}</description>
      <pubDate>${pub.toUTCString()}</pubDate>
      ${s.data.tags.map(t => `<category>${escape(t)}</category>`).join('\n      ')}
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(TITLE)}</title>
    <link>${SITE}/</link>
    <atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml" />
    <description>${escape(DESCRIPTION)}</description>
    <language>en-us</language>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
