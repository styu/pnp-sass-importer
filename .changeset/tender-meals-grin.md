---
"pnp-sass-importer": break
---

- Drop named export `legacyImporter` from `./legacy` path, and only export a default export
- Support `pkg:` protocol, per https://sass-lang.com/documentation/at-rules/use/#pkg-ur-ls
- Only support Node >=22
