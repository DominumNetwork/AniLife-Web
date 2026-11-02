# Anilili Web

A static web port of the Anilili Android app (Home, Browse, Details, Schedule, Library, Settings, Player).
No build step, no dependencies: plain HTML + ES modules. Serve the folder with any static host
(`python3 -m http.server`, Netlify, GitHub Pages, Cloudflare Pages, Vercel, …).

**Client already configured** with AniList app **Anilili-Web** (ID `55798`).

## Quick start

```bash
cd Anilili-Web
python3 -m http.server 8080
# open http://localhost:8080
```

Or drop the folder on any static host.

## AniList sign-in (required step)

1. Go to https://anilist.co/settings/developer
2. Edit the **Anilili-Web** client (ID 55798).
3. Set the **Redirect URL** to the exact origin (and path if needed) where you host the site, e.g.:
   - `https://anilili.example.com/`
   - `https://yourusername.github.io/anilili-web/`
   - For local testing you can temporarily use `http://localhost:8080/` (AniList allows http only for localhost).
4. Save.

Until the redirect is set, the “Sign in with AniList” button will fail after authorization. Users can always paste a personal access token via **Settings → Enter token**.

The client secret is **not** used (implicit grant / public client). Do not put the secret in any client-side code.

## What's ported
- Home: hero carousel, genre chips, Continue Watching (long-press to remove), Newest / Popular / Movies / Top Rated, Upcoming
- Browse: search, search history, category chips, filter sheet (genre, format, status, year, season, score, sort)
- Details: banner, stats, next-episode card, overview, trailer, Episodes (watched toggles), Related, Add to list
- Schedule (14-day airing calendar), Library (status tabs), AniList notifications
- AniList sign-in (token or OAuth), list / progress sync, local fallback when signed out
- Settings: adult filter, title language, autoplay, skip intro, default sub/dub, speed, accent colour, backup export/import
- Player page (HLS.js + MP4, subtitles, resume, skip intro/outro, autoplay next), installable PWA shell

## Not included
- **Streaming providers.** The original Android providers are intentionally omitted. Register your own licensed source(s) in `js/sources.js` (API documented at the top of that file). Uncomment / add an import in `js/app.js` if you keep sources in a separate module.
- Android-only features: downloads, Cast, PiP, Discord presence, TV/D-pad UI, pairing, push notifications, in-app updater.
- Not yet ported: recommendations/taste engine, custom lists, MAL/Simkl sync, dub index, profiles.

## Continuing development

This is a pure static site. Edit the JS/CSS/HTML directly. Key files:

| File | Purpose |
|------|---------|
| `js/config.js` | AniList client ID + version |
| `js/api.js` | GraphQL queries (mirrors the Android AniListClient) |
| `js/store.js` | localStorage persistence (settings, token, list, progress, watched) |
| `js/sources.js` | Pluggable video sources |
| `js/views/*.js` | One module per screen |
| `css/app.css` | All styles (mobile-first, dark theme) |

The UI deliberately stays as close as possible to the Android app: bottom tab bar, sheet modals, accent colour, etc.

## Notes for staff

- Keep the visual language and navigation identical unless there is a clear web-specific reason to change it.
- Prefer progressive enhancement and offline shell via the service worker.
- Never ship the client secret or any private API keys in the front-end bundle.
