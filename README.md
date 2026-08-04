# herbertkokholm.github.io

Personal academic one-pager. Static, JSON-driven, no build step, no framework.
`index.html` holds structure and renderers only; content lives in `data/`, styling and
the renderer app live in `assets/`.

## Structure

```
.
├── index.html            # skeleton + renderers. No content strings, no styling.
├── .nojekyll             # tells GitHub Pages to serve files as-is
├── CNAME                 # custom domain: herbertkokholm.dk
├── data/
│   ├── site.json         # hand-written. Never touched by tooling.
│   ├── publications.json # generated from Zotero. Never edited by hand.
│   ├── projects.json     # hand-written.
│   ├── funding.json      # generated from ORCID. Never edited by hand.
│   └── books.json        # hand-written.
└── assets/
    ├── css/style.css      # all styling.
    ├── js/app.js          # the renderer app.
    └── images/            # portrait.png, book covers and og.png (1200×630)
```

## Features

- Bilingual content (English/Danish), switched via `data/site.json` → `meta.languages`
  or a `?lang=` query parameter.
- Light/dark theme, toggled by the reader and persisted in `localStorage`.
- Publication filtering, search and pagination, plus two Chart.js charts (by year, by
  track).
- A live GitHub public-repo counter, fetched from the GitHub API at load time.

## External dependencies

Two resources are pulled from CDNs at runtime: Google Fonts (typefaces) and
[Chart.js](https://www.chartjs.org/) (publication charts). Everything else is
self-hosted; there is still no build step — both are plain `<link>`/`<script>` tags.

## Editing content

Everything a reader sees comes from `data/site.json`, plus four sibling files it points
to via a `source` field: `projects`, `funding`, `books` and `publications`. To add a
section, add it to `sections` and add a matching renderer in `assets/js/app.js`. To
remove one, delete it from `sections`; the data can stay in the file untouched.

Strings are either `"text"` or `{ "en": "...", "da": "..." }`. Both are valid anywhere.

Publications are CSL JSON plus two fields, `tracks` and `featured`. Regenerate the file
rather than editing it. Funding is pulled from ORCID's public API (`/fundings`,
`/funding/{put-code}`) plus a hand-added `tracks` field; regenerate rather than editing
it too. Projects and books are hand-written, edited directly in their own files. Charts,
counters and funding status (active/upcoming/completed) are derived at runtime, so there
is no statistics file to keep in sync.

The site currently has no separate data contract; `index.html` is the renderer and
`data/site.json` is the content source of truth.

## Running locally

`fetch` is blocked on `file://`, so serve over HTTP:

```bash
python3 -m http.server 8080
# http://localhost:8080
```

## Deploying

Push to `main`. Pages is configured to serve the repository root of that branch.
Settings → Pages → Source: Deploy from a branch → `main` / `/ (root)`.

## Licence

Code in `index.html`, `assets/css/` and `assets/js/` is MIT, see [LICENSE](LICENSE).
Text, images and publication metadata in `data/` and `assets/images/` are not covered by
that licence and remain all rights reserved.
