/**
 * Copy for the per-case social cards rendered at /og/<slug> and
 * screenshotted to public/og/<slug>.png by `npm run og`.
 *
 * Rules the set is built on, so later edits don't drift:
 *   - Nothing on the card renders below 30px. A LinkedIn feed card is ~552px
 *     wide and a DM preview ~240px; anything smaller is texture, not text.
 *   - One accent hit above the band, never two. The band carries the colour.
 *   - `say` is the only thing that has to survive the 240px shrink, so it
 *     stays short enough to read on its own without the meta line.
 */

export type OgLogo = 'taco-bell' | 'comcast-h' | 'gsk';

export interface OgCard {
  /** Second masthead line. Carries the sub-brand where the logo can't. */
  discipline: string;
  /**
   * File in src/assets/og/logos. `comcast-h` is the peacock relocated beside
   * the wordmark at native scale — Comcast publishes only the stacked lockup
   * (kept as comcast.svg), which can't match cap heights on one line.
   */
  logo: OgLogo;
  /** Zodiak display line. Inline HTML; at most one accent span. */
  say: string;
  /** Switzer support line. Inline HTML; <br> controls the line breaks. */
  meta: string;
}

export const ogCards: Record<string, OgCard> = {
  'taco-bell-designops': {
    discipline: 'Design Operations',
    logo: 'taco-bell',
    say: '&ldquo;I built this.&rdquo;',
    meta:
      "Taco Bell's first design ops function.<br>$2.3M budget, agency layer retired.",
  },
  'gsk-analytics': {
    discipline: 'Product Design',
    logo: 'gsk',
    say: 'Eight months<br>to win the <span class="hot">argument</span>.',
    meta: 'Power BI capped at SUS 51.<br>The rebuild hit 81. 85% adoption.',
  },
  'effectv-ad-platform': {
    discipline: 'UX Engineering &middot; Effectv',
    logo: 'comcast-h',
    say: '&ldquo;Do you mean <span class="hot">commercials?&rdquo;</span>',
    meta:
      'First round of testing, on the word <em>spots</em>.<br>SUS 41 &rarr; 72, 40%+ fewer clicks.',
  },
  'comcast-ux-coe': {
    discipline: 'UX Leadership &middot; ULearn',
    logo: 'comcast-h',
    say: 'A full sprint, down to <span class="cool">two days</span>.',
    meta:
      'UX drag over six months.<br>SUS 40s&ndash;50s &rarr; 68+ on touched products.',
  },
};

/** Logo box heights, tuned so cap heights match across the set. */
export const logoHeight: Record<OgLogo, number> = {
  'taco-bell': 30,
  gsk: 30,
  // Wordmark is ~2/3 of this lockup's box, so it needs a taller box to land
  // its caps at the same 30px as the two all-caps marks.
  'comcast-h': 40,
};
