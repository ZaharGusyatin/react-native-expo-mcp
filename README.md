# react-native-expo-mcp

MCP server for React Native + Expo development with Claude Code.

Gives Claude deep knowledge about Expo Router, NativeWind, Zustand + MMKV, Axios, TanStack Query, EAS Build, performance optimization, and TypeScript patterns — so it automatically calls the right tool while you code.

## Two ways to use this

### Option A — MCP Server (recommended)

Claude calls the tools automatically during development. No copy-paste needed.

```bash
git clone https://github.com/zahargusyatin/react-native-expo-mcp.git
cd react-native-expo-mcp
npm install && npm run build
claude mcp add --global react-native-expo -- node /path/to/react-native-expo-mcp/dist/index.js
```

After connecting, Claude will automatically call the right tool when you ask it to create a component, screen, store, API hook, etc.

### Option B — Read the source docs directly

If you don't want to run an MCP server, the source material is in [`docs/`](./docs/). These are the original reference documents the MCP content is based on — you can paste them into any AI chat or read them yourself.

| File | Contents |
|---|---|
| [`docs/best-practices.md`](./docs/best-practices.md) | Architecture, Logic/UI separation, components, state, API, styling, navigation |
| [`docs/setup-tutorial.md`](./docs/setup-tutorial.md) | Step-by-step project setup (tools → EAS → CI/CD) |
| [`docs/callstack-optimization.md`](./docs/callstack-optimization.md) | Performance deep-dive: lists, memory, Concurrent React, Reanimated, bundle analysis |

---

## Tools (13 total)

### Pattern tools — Claude calls these automatically while coding

| Tool | Call when... |
|---|---|
| `get-component-patterns` | Creating a component, button, card, list item |
| `get-screen-architecture` | Creating a new screen or route |
| `get-navigation-patterns` | Working with routes, deep links, auth guard |
| `get-state-patterns` | Creating a Zustand store or working with global state |
| `get-api-patterns` | Creating API services or data fetching hooks |
| `get-styling-patterns` | Styling components with NativeWind |
| `get-performance-patterns` | Optimizing lists, images, bundle, animations |
| `get-project-structure` | Deciding where to place a new file |
| `get-typescript-patterns` | Writing types or interfaces |
| `get-memory-optimization` | Debugging memory leaks or performance issues |

### Setup tools — used once when creating a project

| Tool | Purpose |
|---|---|
| `setup-new-project` | Step-by-step guide for creating a new Expo project from scratch |
| `generate-project-files` | Generates starter files (layouts, store, API client, screens, config) |
| `generate-claude-md` | Generates `CLAUDE.md` with project rules and MCP tool usage instructions |

### Prompt

`init-mobile-project` — interactive wizard that asks about your project and calls the right tools.

---

## How automatic tool calling works

When you add `generate-claude-md` output to your project as `CLAUDE.md`, Claude knows to call tools automatically:

```
You: "Create a product card component"
Claude: calls get-component-patterns → reads Pressable, expo-image, React.memo patterns → writes correct code

You: "Add a catalog screen"
Claude: calls get-screen-architecture → reads Logic/UI separation rules → creates Route + ScreenUI files

You: "The list is laggy"
Claude: calls get-performance-patterns → reads LegendList, FlashList, getItemLayout → optimizes
```

---

## Tech stack covered

- **Expo** (Managed Workflow) + **Expo Router** (file-based routing)
- **TypeScript** strict mode + path aliases
- **NativeWind v4** (Tailwind CSS for React Native)
- **Zustand** + **MMKV** (state + persistence)
- **Axios** + **TanStack Query v5** (API + server state)
- **EAS Build** + **OTA Updates** + **GitHub Actions**
- **react-native-reanimated**, **expo-image**, **LegendList / FlashList**
- React Compiler (React 19+), Concurrent React, memory profiling

## License

MIT
