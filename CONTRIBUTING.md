# Contributing to Vault Ledger

## PR-flow discipline

- All changes land through a **draft PR** — no direct pushes to `main`.
- Draft PR → CI green → owner merges.
- Every PR adds a `CHANGELOG.md` entry under `## [Unreleased]`.
- Version bumps follow semver and the App Versioning Standard
  (`docs/VERSIONING.md`): patch = fix, minor = feature. The `package.json`
  `"version"` is the single source of truth; the release tag must equal it.
- Merge commits reference the PR number. Releases are cut by tagging
  `vX.Y.Z`.
- GitHub Actions minutes are spend-adjacent: batch heavy workflow runs and
  stay lean near month-end.

## Development

All scripts come from `package.json`:

```bash
npm install     # install dependencies
npm run dev     # Vite dev server
npm run build   # typecheck + production build (tsc -b && vite build)
npm test        # unit tests (vitest run)
npm run lint    # eslint .
```

## Deploy

- Web/PWA deploys go through the GitHub Pages workflow
  (`.github/workflows/deploy-pages.yml`) on push to `main`, or locally via
  `npm run deploy` (the `gh-pages` package publishes `dist/`).
- Android: `npm run build` → `npx cap sync android` → open in Android Studio
  (see `Deploy.md`).
- Signed-deploy delegation for Pages/gh-pages targets is a pending program
  decision (the signed wrapper currently covers Cloudflare Workers); nothing
  was rewired in this PR.
