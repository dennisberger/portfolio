# Design Brief — dennisberger.me Rebuild

Companion to `.impeccable.md`. `.impeccable.md` holds the voice, palette, and principles; this brief holds the structural decisions for the rebuild.

## Feature Summary

Full rebuild of the portfolio as an Astro static site. Editorial-systematic in structure, bold in color, wry in voice. Replaces a single-file React SPA that reads as AI-templated with a content-forward editorial site whose visual language earns the rate card attached to it.

## Primary User Action

A design VP spends 30 seconds and leaves thinking "this person is interesting and sounds fun to work with — I want to know more." Secondary: they either dig into the Taco Bell case study or download the resume.

## Layout Strategy

Magazine-rooted. Asymmetric where appropriate. Whitespace as a luxury good. One wide column for prose, a narrow right-side gutter for margin annotations on desktop. Annotations collapse to inline expandable footnotes on mobile.

### Home page vertical order

1. Hero — headline, strapline, primary CTA (case studies), secondary CTA (download resume).
2. **Taco Bell flagship callout** — full-width, hero treatment. Single block, not inside a grid. The lede.
3. Other three case studies — grid, visually differentiated.
4. Experience timeline — inline, collapsed. In-context download resume.
5. About preview — photo + one short paragraph → CTA to full About.
6. Contact band.
7. Footer + stamp.

### Case-study template

- Hero: tag, title, one-line excerpt, stat bar. No images.
- Main column: Switzer body, ~65-70ch. Zodiak headings. Margin annotations in right gutter.
- Case-specific visuals embedded inline at designed moments, not stacked at top.
- End-mark: stamp at bottom.
- "Next case study" block.

## Pages & States

- **/** — home (composition above)
- **/work/taco-bell-designops** — flagship. No screenshots. Editorial "by the numbers" spread. Large Zodiak numerals, Switzer context, dense margin annotations. The most text-forward of the four.
- **/work/gsk-analytics** — bespoke SUS-over-time chart (34 → 51 → 81, cobalt baseline, fuchsia redesigned) as hero visual. Device-framed desktop screenshots further down.
- **/work/effectv-ad-platform** — mobile + desktop screenshots in device frames. SUS progression chart (41 → 51 → 57 → 61 → 72) secondary. "Language is a UX lever" section gets pull-quote treatment.
- **/work/comcast-ux-coe** — no screenshots. Bespoke chart for "UX Drag −33%". Tiered service model rendered as editorial diagram (three tiers, left-aligned, type-driven, no icon-bubbles).
- **/about** — long narrative. One paragraph mentions Ignyte and Synoptro as quiet side projects, not sold. Margin annotations where earned.
- **/contact** — opinionated form with margin-note voice in helper/error/success copy.
- **/colophon** — fonts, stack, tools, homelab nod, license. Stamp is the hero.
- **/404** — your real thought process, lightly edited. Draft: *"404. But why? I did everything right. Okay — calm down. Did you commit your changes? Are you browsing the local copy? Try [home] or [case studies]. If this is my fault, [tell me] — it'll nag at me until I fix it."*
- **No /resume, no /writing, no /projects.**

## Signature Mechanics

### Margin annotations
- Desktop: visible right gutter, Switzer, smaller than body, cobalt or dimmed ink, anchored to the paragraph. Cadence: ~1 per 2-4 paragraphs. Selective, not decorative.
- Mobile: numbered inline superscript in body. Tap to reveal below paragraph. Not modal.
- Voice: first-person present-tense, dry, self-aware, problem-solving out loud. Canonical example: *"Ask boss. Don't panic. Eat tacos."*

### The stamp
One signature mark. CSS-rendered (evolved from the Ignyte rust-belt-industrial imprint — modern, editorial, cleaner). May contain a central figure: a weird animal (unicorn, lion, octopus, taco, cat — TBD, user-sourced). Designed to accommodate a figure without looking pasted-on.

**Placement**:
- End-mark at the bottom of each case study
- Hero of the colophon page
- Quiet presence on the 404
- Centerpiece of the OG image
- Possible favicon derivation

**Copy directions to explore**: "D.B. · HTML NATIVE · PHILADELPHIA · MMXXVI" or similar. Mocked in 3 variants at build time.

## Interaction Model

- Navigation: three items — Work / About / Contact. No page transitions. Scroll-to-top on nav change.
- Motion: kept but deliberate. Hero load-in stagger (label → headline → strapline → CTAs). Scroll-triggered reveals only on 3-4 key thresholds per page. Microanimations restrained (hover-lift on cards, stamp entrance). `prefers-reduced-motion` always honored.
- Contact form: name / email / message. Formspree endpoint unchanged. All helper/error/success copy in margin-note voice.
- Experience timeline: expand/collapse kept. Just well-set type. No timeline viz.

## Content Requirements

- Hero headline final wording: audition 3 candidates against the paper/ink/Zodiak render at build time.
- Taco Bell lede: *"Hired second into the agency-to-FTE transition. I built this. I outlasted my boss. I'm the institutional knowledge."* Softened fallback: *"I built this, and I'm the institutional knowledge behind it."*
- Margin annotations: user authors during build. Template and cadence provided.
- Side-hustles About sentence draft: *"Outside the day job, I'm quietly building Ignyte (self-hosted creator tools) and Synoptro (DesignOps for people going it alone). Both are experiments. Both may fail. Both are why I ship on weekends."*
- Colophon: drafted at build, user revises.
- 404: drafted above, user revises.

## Technical Decisions Locked

- Astro 5.x, zero React.
- MDX case studies via Content Collections, typed frontmatter schema.
- File-based routing, no client router.
- Vanilla JS for interactivity, lazy-loaded per page.
- Fontshare CDN for Zodiak + Switzer. `font-display: swap`. Preload critical weights. Gambarino held as audition fallback for display.
- Single CSS custom-property root — `--color-*`, `--space-*` (4pt scale), `--type-*` (fluid clamp), `--radius-*`. No hard-coded values.
- Astro `<Image>` with AVIF + WebP, lazy except hero.
- Hosting TBD (Cloudflare Pages or Netlify).
- Formspree endpoint unchanged.
- WCAG AA floor, AAA for text contrast. Real focus states, real skip link, real reduced-motion.
- Lighthouse 95+ target.

## Stamp figure — candidate audit (2026-04-21)

User sourced 9 unicorn candidates from Adobe Stock (PNG previews; final will be AI → SVG so color/stroke are fully under our control).

**Ranking after monochrome/scale/register filters:**

1. **Option 7** — clean horse-head silhouette, downward-gaze posture reads as literal *unimpressed*. Timeless, color-agnostic, belongs naturally inside the stamp rings. Lowest risk.
2. **Option 1** — faceted/polygonal unicorn. In flat monochrome this reads as heraldic (coat-of-arms beast) rather than crypto-mascot. Creates a wry tension: classical editorial stamp containing a digital-native creature. Higher ceiling, slightly higher floor.
3. **Option 2** — classical profile in its own circle. Solid, safe, but the self-contained framing means giving up the stamp's existing ring text or reconciling two circles.

**Rejected**: 3, 4 (generic logo-marketplace); 5, 8, 9 (fight monochrome / mascot register); 6 (sporty shield, wrong tone).

User is also sourcing lion options to compare — apply the same three filters.

## Open Questions (non-blocking)

1. Hero headline final wording (audition at build).
2. Taco Bell lede spice level.
3. Stamp final figure: Option 7 (safe), Option 1 (distinctive), or a sourced lion TBD.
4. Hosting platform.
5. Fontshare commercial-use confirmation at build.
6. Resume PDF location (rxr.nuovo.cx vs self-hosted).
7. About photo retake (punted, keep for launch).
8. Case-study URL slug tightening.

## Build Sequence (proposed)

1. Scaffold Astro project. Tokens, type, color, baseline layout. Homepage placeholder.
2. Taco Bell case study as pilot — hardest of the four (no images, margin annotations, editorial-by-numbers, stamp end-mark). If this works, the rest cascade.
3. Remaining three case studies with their differentiated treatments.
4. About, Contact, Colophon, 404.
5. Homepage final composition, hero copy audition.
6. `/audit` pass.
7. `/polish` pass.
8. `/critique` re-baseline.
