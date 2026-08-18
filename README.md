# Capsule booth slides

A self-running, glanceable 16:9 slide deck for introducing [Capsule](https://projectcapsule.dev/) at a conference booth.

The deck is built on [reveal.js](https://revealjs.com/) and served from `index.html`. reveal.js is vendored under `vendor/reveal/`, so the deck has no external runtime dependencies and works without venue Wi-Fi. `styles.css` holds the custom Capsule theme and per-slide layouts; `deck.js` configures the booth loop and injects the persistent chrome.

## Run

Open `index.html` directly, or serve the folder locally:

```bash
nix-shell -p python3 --run "python -m http.server 8080"
```

Then visit <http://localhost:8080> and press `F` for fullscreen.

The presentation advances every 12 seconds and loops automatically. Add `?seconds=15` to change the interval, or `?autoplay=0` to disable auto-advance.

The deck uses the dark theme by default. Add `?theme=light` to preview the light theme, or change `data-theme` on `<body>` in `index.html`. Shared semantic variables near the top of `styles.css` control both themes.

## Build

Create the production site in `_site`:

```bash
bash scripts/build.sh
```

The build gives `styles.css` and `deck.js` content-hashed filenames and rewrites the generated `index.html` to reference them. This ensures a new HTML release cannot reuse CSS or JavaScript cached from an older release. The vendored `reveal/` assets are copied as-is, since their version is already pinned.

## Deploy

Push the `main` branch to GitHub, then select **Settings → Pages → Source → GitHub Actions** in the repository. The `Deploy to GitHub Pages` workflow builds and publishes `_site` on every push to `main` and can also be run manually from the Actions tab.

## Controls

reveal.js provides the navigation:

- `←` / `→`, Page Up / Page Down: move between slides
- `Space`: next slide
- `A`: pause or resume auto-advance
- `F`: toggle fullscreen (`Esc` to exit)
- `Home` / `End`: first or last slide
- `Esc` / `O`: slide overview
- Swipe left or right on touch screens

## Booth setup

For an unattended display, open:

```text
http://localhost:8080/?seconds=12#/0
```

The deck uses no external runtime dependencies. reveal.js, the logo, and the QR code are all local assets, so it remains usable without venue Wi-Fi.
