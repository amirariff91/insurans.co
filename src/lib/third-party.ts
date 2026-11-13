/**
 * How the site loads Google Tag Manager (which sends GA4) and AdSense (with its
 * consent message). This file is the ONE place to change that.
 *
 * Modes:
 *  - 'eager'        The pre-2026-11 behaviour: script requested from <head> as the
 *                   page parses. Competes with first paint and blocks the main thread
 *                   during load.
 *  - 'idle'         Requested after DOMContentLoaded, once the browser is idle
 *                   (requestIdleCallback, capped by `idleTimeoutMs`; setTimeout where
 *                   requestIdleCallback is missing). Not tied to `load`, so a slow ad
 *                   script cannot hold it back. Visits that end before that moment are
 *                   not counted.
 *  - 'interaction'  Requested on the visitor's first interaction (pointer, key, touch,
 *                   scroll), or `fallbackDelayMs` after DOMContentLoaded if they never interact,
 *                   whichever is first.
 *
 * In 'idle' and 'interaction', the script is also requested at once if the tab is hidden
 * before its time (best effort for short visits; it cannot help once the page unloads).
 * A prerendered page waits until it is actually shown, and a page restored from the
 * back/forward cache re-requests a script whose earlier request never completed.
 * Detailed measurements and trade-offs: docs/perf-2026-11.md.
 *
 * In every mode except 'eager', events pushed with `track()` before the script loads
 * stay queued in `window.dataLayer` and GTM processes them in order when it starts,
 * because the `gtm.js` start event is still pushed inline in <head>.
 *
 * To return to the old behaviour, set both modes to 'eager'.
 */
export type ThirdPartyLoadMode = 'eager' | 'idle' | 'interaction';

export const THIRD_PARTY_LOADING = {
  /** Google Tag Manager (GTM-T3LMP78G), which loads GA4 G-PZ741T6RWK. */
  analytics: 'idle' as ThirdPartyLoadMode,
  /**
   * AdSense adsbygoogle.js (and the Funding Choices consent message it pulls in).
   * Kept 'eager' while the AdSense account is under review (status "needs attention",
   * Nov 2026), so the ad code stays in the HTML exactly as the reviewer expects.
   * Switch to 'interaction' once the account is approved and serving.
   */
  ads: 'eager' as ThirdPartyLoadMode,
  /** 'interaction' mode: load this long after DOMContentLoaded if the visitor has not interacted. */
  fallbackDelayMs: 3000,
  /** 'idle' mode: upper bound on waiting for an idle period after DOMContentLoaded. */
  idleTimeoutMs: 1500,
};

export const GTM_ID = 'GTM-T3LMP78G';
export const ADSENSE_CLIENT = 'ca-pub-6126092270142355';
