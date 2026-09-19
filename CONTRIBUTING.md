# Contributing

## Add a category
1. Copy the template in `SKILL.md` section 11.
2. Add the preset under section 5 and an entry in `registry.ts` (section 6).
3. Add the category id to the `category` comment in CONFIG and to `scripts/configure.mjs`.
4. Add a line to `CHANGELOG.md`.

## Add a look
Add a row to the section 3 table and an entry in `looks` (section 6). Keep every value overridable.

## Rules
- Keep `SKILL.md` self-contained: agents read only this file.
- Keep CONFIG keys unique and one per line (`scripts/configure.mjs` rewrites them by regex).
- Nothing on the anti-slop list (section 9) may appear in examples.
- Run `node scripts/configure.mjs SKILL.md` on a copy before opening a PR.
