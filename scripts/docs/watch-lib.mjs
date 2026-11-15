// Pure helpers for watch.mjs, kept apart so they can be tested without any network access.
import { existsSync, realpathSync } from 'node:fs';
import { basename, dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';

/** Real path of `p`, resolving symlinks through its nearest existing ancestor. */
export function realish(p) {
  let cur = resolve(p);
  const rest = [];
  while (!existsSync(cur)) {
    rest.unshift(basename(cur));
    const up = dirname(cur);
    if (up === cur) break;
    cur = up;
  }
  return join(realpathSync(cur), ...rest);
}

/** True when `out` (once its existing parent is resolved to a real path) lies inside `root`. */
export function insideRepo(out, root) {
  const rel = relative(realpathSync(root), realish(out));
  if (rel === '') return true;
  return !isAbsolute(rel) && rel !== '..' && !rel.startsWith(`..${sep}`);
}

/** Comparison key for a URL: decoded, fragment dropped, query kept, known host aliases folded. */
export function norm(u) {
  try {
    const x = new URL(u);
    x.hash = '';
    return decodeURI(x.href).replace(/^http:/, 'https:').replace('://s3.ap-southeast-1.', '://s3-ap-southeast-1.');
  } catch {
    return u;
  }
}

/** PDF links in a page: Map of comparison key -> URL for display (still percent-encoded, no fragment). */
export function pdfLinks(html, base) {
  const found = new Map();
  const re = /(?:href|src|data-href)\s*=\s*["']([^"']+?\.pdf(?:\?[^"'#]*)?(?:#[^"']*)?)["']|["'](https?:\/\/[^"'\s]+?\.pdf(?:\?[^"'\s#]*)?(?:#[^"'\s]*)?)["']/gi;
  for (const m of html.matchAll(re)) {
    const raw = (m[1] ?? m[2]).replace(/&amp;/g, '&');
    try {
      const u = new URL(raw, base);
      u.hash = '';
      if (!found.has(norm(u.href))) found.set(norm(u.href), u.href);
    } catch {
      /* ignore */
    }
  }
  return found;
}
