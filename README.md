# Spark Prepaid Card — campaign site

A mobile-first, scroll-driven landing page for **Spark**, the prepaid card from
Dhaka Bank PLC. Built to the pop-art campaign key visuals: electric blue ground,
acid yellow starbursts, hot pink call-outs, paint-marker lettering.

Every visual is drawn in code — SVG, CSS and container queries. There are no
image assets, so the card is sharp at any size and re-skinnable from one file.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build && npm start   # production build
npm run lint                 # eslint
npx tsc --noEmit             # typecheck
```

**To stop the dev server** (it keeps running in the background):

```bash
npx kill-port 3000
```

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) + React 19 + TypeScript |
| Styling | Tailwind CSS v4, CSS-first config in `src/app/globals.css` |
| Motion | GSAP 3.15 — ScrollTrigger, SplitText, Observer, CustomEase |
| Scrolling | Lenis on pointer devices; **native scroll on touch** |

## Page order

1. **Hero** — what Spark is, with a pointer/touch-parallax card
2. **Trust** — the one place the bank speaks: who issues the card, and that's it
3. **CardStudio** — the big floating card + six designs you can print onto it
4. **Perks** — six reasons to carry it
5. **HowTo** — four steps, scrub-filled progress rail
6. **Everywhere** — where it works, with a velocity-reactive marquee
7. **FinalCta** — store badges

## Routes

| Route | What it is |
|---|---|
| `/` | The landing page |
| `/apply` | Two-step application — six details, then five document slots |
| `/pay` | **Mock** payment gateway (bKash, Nagad, Rocket, card) |

### The application form

Files chosen in `/apply` are held in component state and **never uploaded** —
nothing leaves the browser and nothing is stored. Object URLs behind the
thumbnails are revoked on replace and clear, so picking several large photos
doesn't leak memory for the life of the tab. Only the applicant's first name
and chosen card design are handed to `/pay`, via `sessionStorage`, so the
payment screen can address them by name.

### The payment page is a mock

`/pay` imitates a gateway for design purposes. No network request is made,
nothing is validated against any provider, and nothing is persisted — the
"payment" is a timed animation. `/pay`, `/signin` and `/account` are all
`robots: noindex, nofollow`, which is also what you'd want for these routes on
a real site.

### Sign-in and the dashboard

`/signin` takes a mobile number and a 6-digit code; **any 6 digits are
accepted**. There is no length or operator-prefix rule on phone numbers
anywhere in the flow. The "session" is a phone number in `localStorage` — it
gates `/account` so the flow can be demonstrated, and is not a security
boundary.

`/account` renders fixture data from `src/lib/account-data.ts`. The figures are
internally consistent: the category rows sum to the month's spend, and each
row's saving is its spend × its rate. Keep those identities true if you edit
them — a dashboard whose totals don't reconcile reads as broken.

## Mobile-first decisions

These are deliberate, and reversing them will make the phone experience worse.

**Native touch scrolling.** `syncTouch: false` in
[SmoothScroll.tsx](src/components/core/SmoothScroll.tsx). iOS and Android
already scroll at high refresh rates with correct rubber-banding; intercepting
that to re-implement it in JS is the most common cause of a site feeling laggy
on a phone. Lenis still smooths the mouse wheel on desktop, and ScrollTrigger
reads native scroll perfectly well.

**No full-screen blur.** [Atmosphere.tsx](src/components/core/Atmosphere.tsx)
uses transform and opacity only. A blurred full-viewport layer is the single
most expensive thing a mobile GPU can paint.

**`touch-action: pan-y` on the card.** Drag it sideways and it spins; drag up or
down and the page scrolls. `touch-action: none` would trap the finger and make
it impossible to scroll past the card.

**Pointer events throughout.** One code path covers mouse and touch, so every
parallax and press effect behaves the same under a finger.

## The card

[CardStudio.tsx](src/components/sections/CardStudio.tsx) runs a small physics
loop on GSAP's ticker rather than tweening to fixed positions:

- It idles at a slow yaw — roughly one turn every 21 seconds.
- **Touching it anywhere applies an impulse from that point.** Tap a corner and
  that corner swings; the grab offset is normalised to −1..1 from the centre.
- Dragging adds yaw and pitch, and off-centre grabs convert drag into **roll** —
  the cross product of grab offset and drag delta. That's the "sway".
- Let go and angular velocity decays back to the idle spin.

The loop is frame-rate independent (scaled by `deltaTime`), so it behaves the
same on a 60Hz and a 120Hz screen.

### Adding a seventh design

Add one object to [designs.tsx](src/components/visuals/designs.tsx) — face art,
ink colours and a two-colour swatch. The picker, the card and the flash
transition all pick it up with no other edits.
[SparkCard.tsx](src/components/visuals/SparkCard.tsx) sizes all its type in
`cqw` against its own container, so the same component renders correctly as a
40px thumbnail and as a 560px hero card without breakpoints.

## Design tokens

All at the top of [globals.css](src/app/globals.css). Change `--blue`,
`--yellow` and `--pink` and the whole site re-skins, including the scroll colour
journey in `Atmosphere`.

## Accessibility

- `prefers-reduced-motion` is honoured everywhere — the preloader is bypassed,
  the card sits still, and scrubbed transitions are skipped.
- Pinch-zoom is **not** disabled.
- The design picker is a real `radiogroup`; every control clears a 44px+ touch
  target.

## Deploying to Vercel

Import the repo and **change nothing**. The defaults are correct:

| Setting | Value |
|---|---|
| Framework Preset | **Next.js** (auto-detected — do not pick "Other") |
| Root Directory | `./` |
| Build Command | *leave empty* (`next build`) |
| **Output Directory** | **leave empty** |
| Install Command | *leave empty* (`npm install`) |
| Node.js Version | 22.x |
| Environment Variables | none required |

### If the deployed site renders as unstyled text

That means `/_next/static/…` is 404ing. Open DevTools → Network on the
deployed URL and reload; if the `.css` request is red, it is one of these, in
order of likelihood:

1. **Output Directory is set** to `.next` or `out`. This is the usual cause.
   Setting it makes Vercel serve the folder as a plain static site, so the HTML
   is returned but the Next.js asset routes never get wired up. Clear the field
   and redeploy.
2. **Framework Preset is "Other"** instead of Next.js — same result, same fix.
3. **The build failed.** Vercel keeps serving the last *successful* deployment,
   so a broken build looks like a stale or half-working site. Check the build
   log on the deployment.
4. `output: "export"` added to `next.config.ts`. This project doesn't need it.

Note that a `192.168.x.x` address is your local dev server and is reachable
only from your own network — it is never the deployed site. If people on your
LAN see a working page and people outside don't, they are looking at two
different things.

### Custom domain

Set `NEXT_PUBLIC_SITE_URL=https://yourdomain.com` in Vercel's environment
variables so Open Graph tags use it. Without it the site falls back to Vercel's
`VERCEL_PROJECT_PRODUCTION_URL`, which is already correct for `*.vercel.app`.

## Before this goes live

The site uses **placeholder brand assets and illustrative content**:

- The Spark bolt mark and the Dhaka Bank wordmark in
  [Logo.tsx](src/components/core/Logo.tsx) are drawn approximations — swap in
  the official vectors.
- Colours are sampled from the supplied key visuals by eye, not from a brand
  guide. Check them against the real spec.
- The six card designs are invented. The benefit copy (4× Balaka Express Lounge
  access, USD 12,000 limit, 0% markup, dual currency, 9,500+ Mastercard partner
  outlets, IELTS/TOEFL/SAT/GMAT discounts, annual charge waived at 12 uses) came
  from the campaign brief — these are regulated claims, so confirm each one is
  approved before launch.
- The **৳575 issuance fee on `/pay` is a placeholder.** Replace it with the real
  figure.
- bKash, Nagad and Rocket are represented by approximated brand colours and
  generic icons, not their real marks. Get permission and proper assets before
  using them publicly.
- Store links are inert `#` hrefs.

The footer carries a disclaimer noting this is a concept site. Remove it once
the above is real and the project is officially sanctioned.
