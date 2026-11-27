# Lutic UI

Next.js App Router implementation of the supplied Lutic AI studio website. Includes six server-rendered routes, reusable header and footer, React platform demos, motion choreography and an isolated animated reel.

## Run locally

Requires Node.js 20.9+ (22 LTS recommended).

```sh
npm install
npm run dev
```

Open http://localhost:3000.

```sh
npm run build
npm start
```

Routes: `/`, `/solutions`, `/platform`, `/agents`, `/consulting`, `/contact`.

## Contact delivery

Copy `.env.example` to `.env.local`, configure an HTTPS `CONTACT_WEBHOOK_URL` and optionally a bearer token. The endpoint receives JSON with name, email, interest and message. Without configuration, the form returns an explicit unavailable error, not a false success. Before public rollout, add rate limiting/anti-spam at the deployment edge and document the privacy/retention policy.

## Design and implementation

- App Router pages contain JSX converted from the supplied source, with actual path-based Next.js links and route-level SEO metadata.
- `components/platform-explorer.jsx` uses React state for feature tabs, a clickable Kanban and simulated monitoring, with keyboard support.
- `components/motion.jsx` preserves the original scroll, pointer, reveal, counter, canvas and gallery behavior. Browser listeners, observers, timers and animation frames are cleaned up on route change.
- `public/motion-loop.html` is the preserved standalone 14-second motion reel, sandboxed in an iframe.
- `app/globals.css` retains Lutic's visual styling, responsive layout and reduced-motion preferences.

The source's product descriptions, connector counts, operational metrics and other claims have not been independently validated. Verify them before publishing. Platform demos are frontend illustrations, not connected plant telemetry or an operational agent backend. External Google Fonts may use system fallbacks if blocked.

No dependency lockfile was generated in the offline migration environment. Run npm install and commit the resulting lockfile after validating the production build.

## Search engine optimization

The shared registry in `lib/seo.mjs` generates unique titles, descriptions, canonical URLs, Open Graph and Twitter tags, branded 1200×630 PNG previews, Organization/WebSite/WebPage/Service/BreadcrumbList JSON-LD, visible breadcrumbs, robots and the XML sitemap. All eleven platform capability summaries are visible in server-rendered HTML.

### Before going live

1. Set `SITE_URL` to the verified public HTTPS origin (no path, port, query or fragment) in the production hosting environment at build time, then redeploy. Missing/invalid domains, non-production Vercel/Netlify deployments, development and `SEO_NOINDEX=1` are noindex. Robots deliberately permits crawling public pages so crawlers can read noindex. Preview noindex is not access control.
2. Configure the hosting provider to redirect alternate domains to the canonical host. Ensure no deployment-level robots header blocks production. The sitemap lists the six canonical pages; no fabricated last-modified dates or priorities.
3. Verify the domain in Google Search Console using DNS verification or the HTML-tag token in `GOOGLE_SITE_VERIFICATION`. Submit `/sitemap.xml` in Search Console and optionally Bing Webmaster Tools.
4. Verify the existing marketing claims before publishing. Illustrative statistics and simulated platform data are marked data-nosnippet; schema does not contain unverified customer names, ratings, business addresses, certifications or performance claims.
5. Use the live URL inspection, Rich Results Test and PageSpeed Insights to validate crawlability, structured data and Core Web Vitals. Search rankings and indexing are not guaranteed.

```sh
npm run test:seo
npm run build
npm start
# Live production checks:
SITE_URL=https://example.com npm run check:seo -- https://example.com
# Local/preview checks:
EXPECT_NOINDEX=1 npm run check:seo -- http://localhost:3000
```

Social preview routes: `/og/home`, `/og/solutions`, `/og/platform`, `/og/agents`, `/og/consulting`, `/og/contact`.

## Homepage welcome animation

The homepage opens with a custom 9-row pixel-grid Lutic wordmark rendered as crisp SVG cells, independent of font loading. At 3.42 seconds, two shōji-inspired full-height panels slide apart. A single requestAnimationFrame clock drives both gates and the mascot, measuring the actual hero SVG each frame and ending at its current position and scale. The stable scrollbar gutter prevents layout shift when the dialog closes. The hero mascot is revealed at a neutral pose. Total nominal duration is 4.5 seconds; if the target is offscreen the intro mascot fades. No network graphics, extra labels, video or animation dependencies.

The intro plays on the first homepage visit in a tab and again on each full homepage reload, including after scrolling. Ordinary in-app navigation back to the homepage does not replay it once seen. The visible timeline and skip control are removed for a clean presentation; Escape still dismisses it for keyboard accessibility. The mascot gently follows mouse or pen movement with both its body and eyes, then recenters for the homepage handoff. Reduced-motion preferences, deep links, unsupported dialogs and JavaScript-disabled browsing bypass the intro. The underlying homepage remains server-rendered with the same metadata and route. No media download, external animation library or new dependency is required.

```sh
npm run test:intro
npm run test:seo
npm run build
```

Browser acceptance checks: fresh tab, full 4.5-second kinetic wordmark-to-mascot-to-gate playback, mouse/pen tracking, Escape dismissal, no bottom timeline or skip button, homepage reload at top and after scrolling, no orange heading focus box, repeat in-app navigation, mobile portrait and landscape, dark mode, reduced motion, and direct access to interior routes. Visual handoff and actual build should be checked in a browser/deployment.

The six services use a three-column responsive grid (two on tablet, one on mobile), with every title and description visible and hover/focus highlighting rather than width-changing cards.

## Branded search and content SEO

Production has 13 canonical routes, including dedicated agentic automation, AI integration and AI support pages, About Lutic and an Insights hub with two practical engineering guides. Existing routes and the intro are preserved. Keep SITE_URL=https://lutic.app and SEO_NOINDEX=0 in Vercel production. Preview deployments remain noindex. Submit the updated sitemap and inspect the homepage/new URLs in Search Console after deploying. Use verified official profile URLs only when adding sameAs; do not invent customer testimonials, office addresses or regional pages. Google chooses indexing and ranking; no code guarantees first position.

## Studio reel

The homepage includes a native React/SVG service showcase: six four-second scenes using the original SVG workflow diagrams and homepage copy from ce75768, with one inner demonstration frame and no outer card, counter, chapter list, or visible player controls. A display-synchronized requestAnimationFrame clock drives the diagrams without a timer throttle; static copy, step labels and service links are memoized. Autoplay pauses offscreen, in hidden tabs, on mouse hover or keyboard focus. Space or Enter on the focused reel toggles persistent pause; reduced-motion users see a static completed diagram. Scenes are illustrative workflows, not live client data. Frame rate depends on the device. The previous industrial motion asset remains at /motion-loop.html, unchanged. Run `npm run test:reel` for chapter and timeline checks.

Homepage reloads without a hash now disable browser history scroll restoration in the document head before hydration. The landing intro maintains scroll position zero until the gate reveal and resets it after dialog/focus cleanup. Native restoration is released after pageshow and the intro. Ordinary route navigation, back/forward and hash links retain normal browser behavior. Check reloads from the footer and middle of the homepage, including Safari and reduced motion.

## Search result branding

The original Lutic mascot is available as a 192×192 PNG at `/favicon.png` (stable favicon and organization logo) and as SVG at `/icon.svg`. The root metadata explicitly declares the PNG and the WebSite schema names Lutic as the preferred site name. After deployment, verify the favicon link and PNG response with `npm run check:seo -- https://lutic.app`, then request a homepage recrawl in Search Console. Google determines actual favicon, site name, title and snippet display; updates can take days to weeks.
