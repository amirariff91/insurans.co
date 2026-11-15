/** RSS 2.0 feed for Terkini, written by hand (no feed package in this project). */
import type { APIRoute } from 'astro';
import { terkini, TERKINI_URL } from '../../lib/terkini';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// Items carry a date only; publish them at 00:00 Malaysia time (UTC+8).
const rfc822 = (date: string) => new Date(`${date}T00:00:00+08:00`).toUTCString();

export const GET: APIRoute = () => {
  const items = terkini.map((item) => {
    const link = `${TERKINI_URL}${item.slug}/`;
    return `    <item>
      <title>${esc(item.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${rfc822(item.date)}</pubDate>
      <category>${esc(item.kind)}</category>
      <description>${esc(item.summary)}</description>
    </item>`;
  }).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Insurans.co Terkini</title>
    <link>${TERKINI_URL}</link>
    <atom:link href="${TERKINI_URL}rss.xml" rel="self" type="application/rss+xml" />
    <description>Perubahan bertarikh yang menjejaskan harga atau perlindungan insurans di Malaysia, dengan sumber rasmi.</description>
    <language>ms</language>
    <lastBuildDate>${rfc822(terkini[0].date)}</lastBuildDate>
${items}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
};
