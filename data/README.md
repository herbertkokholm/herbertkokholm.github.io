# data/

Content for the site, as JSON. `index.html` only renders it.

| File                | Origin                        | Notes |
|---------------------|--------------------------------|-------|
| `site.json`         | Hand-written                  | Identity, about, research lines, taxonomy, contact. Points to the three files below via `source` fields. |
| `projects.json`     | Hand-written                  | Array of project entries. |
| `funding.json`      | Generated from ORCID          | Array of funding entries, from ORCID's public API (`/fundings`, `/funding/{put-code}`) for [0009-0009-3027-2043](https://orcid.org/0009-0009-3027-2043), plus a hand-added `tracks` field. Regenerate, don't hand-edit. |
| `books.json`        | Hand-written                  | Array of book entries. |
| `publications.json` | Generated from Zotero         | CSL JSON plus `tracks` and `featured`. Regenerate, don't hand-edit. |

Strings are either `"text"` or `{ "en": "...", "da": "..." }` — both forms are valid anywhere.

Not covered by the repo's MIT licence; see the root [README](../README.md#licence).
