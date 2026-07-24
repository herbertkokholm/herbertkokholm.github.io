# assets/js/

Renderer for the site.

| File | Notes |
|------|-------|
| `app.js` | Fetches `data/site.json` and the files it points to, then renders every section. Also drives the theme toggle, publication filters/pagination, and the Chart.js charts. Loaded with `defer` from `index.html`; boots on `DOMContentLoaded`. |

No content strings live here — everything user-facing comes from `data/`. Code, MIT-licensed
like `index.html`; see the root [README](../../README.md#licence).
