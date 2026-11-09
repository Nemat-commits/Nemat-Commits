# Nemat-Commits — Nemat Ullah

> Craft over noise.

Personal landing page of **Nemat Ullah** — independent developer in Abbottabad, Pakistan.
Web products, offline-first Android apps, and small worlds to play in.

**Type:** hand-built static site (HTML · CSS · vanilla JS) — no build step, no framework, no backend.

## Run locally

```bash
python3 -m http.server 4173 --bind 0.0.0.0
```

Open <http://localhost:4173>.

## Structure

| Path | Purpose |
| --- | --- |
| `index.html` | The page — semantic, accessible, SEO/OG meta included |
| `assets/css/styles.css` | Design system: warm-ivory paper, ink, one terracotta accent; light + dark themes |
| `assets/js/main.js` | Theme persistence, live PKT clock, scroll reveals, counters, cursor-follow project preview, copy-email, form → prefilled mailto |
| `assets/fonts/` | Self-hosted WOFF2 (Fraunces, Inter, IBM Plex Mono) — no font CDN dependency |
| `assets/img/work/` | Editorial ink-illustration project artwork, generated fresh for this page |

## Features

- Light / dark theme with `prefers-color-scheme` default + persisted toggle
- Live Pakistan (PKT) clock, in hero and footer
- Cursor-following project previews on the work list (fine pointers only)
- Animated stat counters, seamless capability ticker, scroll progress bar
- Contact form opens a pre-filled email draft (`khannmat12@gmail.com`) — no data stored
- Graceful `prefers-reduced-motion` support; self-hosted assets; zero network dependencies at runtime except a single cached GitHub API call with a static fallback

## Deploy

Any static host works. For **GitHub Pages**: repo → *Settings → Pages → Deploy from a branch → this branch, `/ (root)`*.
For **Vercel/Netlify**: import the repo, framework preset "Other", no build command, output dir = repo root.

## Contact

Nemat Ullah · [khannmat12@gmail.com](mailto:khannmat12@gmail.com) · [github.com/Nemat-commits](https://github.com/Nemat-commits) · WhatsApp +92 316 0545076
