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

The homepage opens with the Lutic mascot storyboard, implemented as a native React/SVG/CSS animation rather than a video. The phases are Awaken (0–2s), Connect (2–4.5s), Execute (4.5–7.5s), and Return (7.5–10s). During the final 1.2 seconds the logo moves and scales to the actual homepage hero mascot while the overlay fades, without navigating away from the canonical homepage.

The intro plays on the first homepage visit in a tab and again on each full homepage reload, including after scrolling. Ordinary in-app navigation back to the homepage does not replay it once seen. Skip intro or Escape dismisses it. Reduced-motion preferences, deep links, unsupported dialogs and JavaScript-disabled browsing bypass the intro. The underlying homepage remains server-rendered with the same metadata and route. No media download, external animation library or new dependency is required.

```sh
npm run test:intro
npm run test:seo
npm run build
```

Browser acceptance checks: fresh tab, full ten-second playback, skip with mouse/keyboard, homepage reload at top and after scrolling, no orange heading focus box, repeat in-app navigation, mobile portrait and landscape, dark mode, reduced motion, and direct access to interior routes. Visual handoff and actual build should be checked in a browser/deployment.
