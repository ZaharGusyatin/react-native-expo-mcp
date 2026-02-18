# Changelog

## [2.0.2] - 2026-02-18

### Added
- `docs/` folder with source reference documents: `best-practices.md`, `setup-tutorial.md`, `callstack-optimization.md`
- README: full rewrite in English — two usage options (MCP server vs read docs directly), tools table, how automatic tool calling works

### Changed
- `.gitignore`: added `.idea/`, `.vscode/`, `.claude/`, `thoughts/`, original source filenames

---

## [2.0.1] - 2026-02-18

### Changed
- All `export function` → `export const` arrow functions in all pattern files and `setup-project.ts`
- `get-performance-patterns`: LegendList promoted to primary recommendation; FlashList as battle-tested alternative; FlatList as fallback
- `get-component-patterns`: replaced dot-notation composable pattern (`ProductCard.Image`) with named components (`ProductCardImage`, `ProductCardTitle`)
- `get-api-patterns`: added TanStack Query v4 vs v5 diff table (`isPending`, `gcTime`, `onSuccess` location); added `gcTime` to QueryClient config with version note

---

## [2.0.0] - 2026-02-18

### Breaking Changes
- Removed all React Navigation support — Expo Router only
- Removed Ukrainian-language tools and content — English only
- Removed `get-setup-guide` (13-step wizard) — replaced by `setup-new-project`
- Removed `get-best-practices` (monolithic) — split into 10 granular pattern tools
- Removed `get-troubleshooting` and `get-cheat-sheet`

### Added
- **10 pattern tools** (called automatically by Claude during development):
  - `get-component-patterns` — Pressable, expo-image, React.memo, React Compiler, composable pattern, uncontrolled TextInput
  - `get-screen-architecture` — Logic/UI separation (Route file + ScreenUI), naming conventions
  - `get-navigation-patterns` — Expo Router file structure, AuthGuard, typed params, deep linking
  - `get-state-patterns` — Zustand + MMKV, selectors, useShallow, getState() outside React
  - `get-api-patterns` — Axios with interceptors, domain services, TanStack Query hooks
  - `get-styling-patterns` — NativeWind v4, cssInterop, Tailwind config, JS constants
  - `get-performance-patterns` — FlashList, expo-image, tree-shaking, Concurrent React, Reanimated
  - `get-project-structure` — Full folder tree, file placement guide, naming conventions, import aliases
  - `get-typescript-patterns` — Strict mode, path aliases, model types, generics, discriminated unions
  - `get-memory-optimization` — useEffect cleanup, closure leaks, DevTools profiler, R8 shrinking
- **`setup-new-project`** — unified step-by-step setup guide (prerequisites → build & deploy)
- **`generate-project-files`** — simplified scaffold (Expo Router only, English)
- **`generate-claude-md`** — generates CLAUDE.md with MCP tool usage matrix
- **`init-mobile-project`** prompt — interactive project setup wizard

### Removed
- `src/content/setup/step01-step13` — 13 separate step files
- `src/content/practices/00-09` — monolithic best-practices files
- `src/content/extras/` — troubleshooting and cheat-sheet files
- `src/generators/env-setup.ts` — merged into project-files generator
- `src/utils/format.ts` — no longer needed

### Changed
- `src/index.ts` — complete rewrite: 6 old tools → 13 new tools + 1 prompt
- `src/generators/claude-md.ts` — Expo Router only, English, added MCP tool usage matrix
- `src/generators/project-files.ts` — Expo Router only, English, removed React Navigation variant

---

## [1.0.0] - 2026-02-10

Initial release. Ukrainian-language MCP server with dual-router support (Expo Router + React Navigation), 13-step setup guide, monolithic best-practices tool, troubleshooting, and cheat-sheet.
