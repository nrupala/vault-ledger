# Codetopo Profile — Vault Ledger (nrupala/vault-ledger)

**What this is.** The agent-facing map of this repository, generated with
Codetopo 0.9.1 (local engine, `~/.cargo/bin/codetopo`) so an arriving agent
can see the machine — topology, trust boundaries, money surface — before it
submits or changes anything. Read this first; the graph snapshot beside it
(`snapshot.json`, `stats.json`) is the measured evidence.

- **Repo:** nrupala/vault-ledger
- **Commit profiled:** `21c5b7317f02d00b317eea59ea8cbbe2985b7c87` (main)
- **Engine:** codetopo 0.9.1 + full-language program (engine built from codetopo main `d71509d1` — all sixteen program extractors merged) · index run 2026-11-19
- **Graph:** 57 files walked · 0 failed · 782 nodes · 1,425 edges · audit chain valid (3 entries, head `4371b7d4…d3fe`)
- **Nodes by kind:** external 519 · variable 71 · file 57 · module 55 · function 29 · interface 20 · doc 14 · class 8 · method 8 · package 1
- **Edges by kind:** calls 703 · contains 262 · reads 219 · defines 142 · imports 96 · writes 2 · inherits 1

## Coverage honesty

**Re-profiled 2026-11-19** with the full-language engine (Codetopo extractor program, 2026-11-18 ruling): every language this repo is written in is now extracted at symbol level. First profile: 2026-11-18 (Codetopo 0.9.1).

Codetopo now extracts every language in the full-language program (Rust, TypeScript/JavaScript, Python, Kotlin, C, Java, Go, Shell, C++, Swift, Ruby, R, Julia, C#, PHP, Scala, Haskell, Elixir, Lua), plus Markdown as Doc nodes. The TypeScript/React app is extracted at symbol level as before, and the Capacitor native scaffolding named as the residual in the first profile is now in the graph: the Java `MainActivity` and test classes under `android/app/src/` and the Swift `AppDelegate` under `ios/App/App/`. Gradle/XML/plist/storyboard files are configuration, not code, and are not parsed; read them directly. Symbol coverage of the codebase is complete.
## Topology

Single-app repo (`@vault/ledger`): the focused ledger app — a zero-knowledge financial journal ("Needs vs Wants") — cut from the same vault core as the parent suite. Note the domain carefully: this app *records* the user's own finances locally; it does not move money (see Money surface).

- `src/App.tsx` + `src/components/AppShell.tsx` — React shell; `LedgerApp.tsx` is the product surface, with the shared suite components (`NotesApp.tsx`, `TasksApp.tsx`, `HabitsApp.tsx`, `CalendarApp.tsx`, `AnalyticsApp.tsx`) carried in the same tree.
- `src/lib/core/` — the vault engine: `crypto.ts` (AES-256-GCM), `db.ts` (local persistence), `useVault.ts` / `useItems.ts` / `useSettings.ts`, `useVoiceCommands.ts`, `intelligence.ts`. Tests: `src/tests/crypto.test.ts`, `stress.test.ts`.
- `src/main.tsx` — entry point; `android/` + `ios/` are Capacitor native shells; the Vite web build is the product.

## Trust boundaries

- **Local-only, zero-knowledge:** ledger entries — the most sensitive data class in the suite — are encrypted on-device (`src/lib/core/crypto.ts`) and never leave local storage; no account, auth server, session, token store, bank connection or aggregation API exists in this repo.
- **No network trust boundary in the shipped app:** credential-term greps hit only vault-crypto code and docs. Adding any financial-data egress would break the product's stated trust model outright.
- **Blast radius:** `crypto.ts` and `db.ts` — every read/write passes through them (675 call edges in the graph).

## Money surface

**No money surface found — and no money movement of any kind.** Greps for `stripe|paddle|checkout|billing` over all TypeScript/TSX/JS source returned no hits; there is no upgrade/license module, no payment SDK in `package.json`, no checkout, webhook, bank-link or transaction code. The app is a private journal *about* money; it neither charges the user nor touches their accounts at the profiled commit.

## How an agent should approach

1. Read `README.md`, then this profile, then the snapshot.
2. Use `codetopo` queries against the snapshot (descendants, blast-radius,
   symbol) before editing — especially around the hubs named above.
3. Do not add credentials, account identifiers or key material to any file
   here — names and paths only. Respect the trust boundaries above as
   design constraints, not suggestions.
4. Run the repo's own tests after any change; regenerate this profile
   (below) whenever the code changes.

## Regeneration

`docs/codetopo-profile/refresh.sh` (in this pack) re-downloads the repo
at a named ref, re-runs the index, and rewrites `snapshot.json`,
`stats.json` and the header block inputs of this profile. Regenerate at
every release / material change.

Release gate: NOT RUN — Guardian Mesh: NOT RUN (this profile pack is a
documentation artifact; it is not a release-gate or Guardian Mesh verdict).
