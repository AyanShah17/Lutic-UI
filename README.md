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
