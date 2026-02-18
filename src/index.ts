#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import {
  getComponentPatterns,
  getScreenArchitecture,
  getNavigationPatterns,
  getStatePatterns,
  getApiPatterns,
  getStylingPatterns,
  getPerformancePatterns,
  getProjectStructure,
  getTypescriptPatterns,
  getMemoryOptimization,
} from "./content/patterns/index.js";
import { getSetupNewProject } from "./content/setup/setup-project.js";
import { generateProjectFiles } from "./generators/project-files.js";
import { generateClaudeMd } from "./generators/claude-md.js";

const server = new McpServer({
  name: "react-native-expo-mcp",
  version: "2.0.0",
});

// ─── Pattern Tool 1: get-component-patterns ──────────────────────────
// Call when: creating a component, button, card, list item

server.tool(
  "get-component-patterns",
  "Get React Native component patterns. Call this when creating any component: button, card, list item, image, form input. Covers Pressable, expo-image, React.memo, React Compiler, composable pattern, and uncontrolled TextInput.",
  {},
  async () => ({
    content: [{ type: "text", text: getComponentPatterns() }],
  })
);

// ─── Pattern Tool 2: get-screen-architecture ─────────────────────────
// Call when: creating a new screen or route

server.tool(
  "get-screen-architecture",
  "Get screen architecture patterns (Logic/UI separation). Call this when creating a new screen or route. Covers the Route file + ScreenUI file split, naming conventions, and why it matters for testability and SOLID principles.",
  {},
  async () => ({
    content: [{ type: "text", text: getScreenArchitecture() }],
  })
);

// ─── Pattern Tool 3: get-navigation-patterns ─────────────────────────
// Call when: working with routes, deep links, auth guard, navigation

server.tool(
  "get-navigation-patterns",
  "Get Expo Router navigation patterns. Call this when working with routes, navigation, deep links, or auth guards. Covers file structure, layouts, AuthGuard, typed params, navigation API, deep linking, and layout groups.",
  {},
  async () => ({
    content: [{ type: "text", text: getNavigationPatterns() }],
  })
);

// ─── Pattern Tool 4: get-state-patterns ──────────────────────────────
// Call when: creating a store, working with global state

server.tool(
  "get-state-patterns",
  "Get state management patterns (Zustand + MMKV). Call this when creating a store or working with global state. Covers Zustand store setup, MMKV persistence adapter, selectors, useShallow, getState() for outside React, and store organization rules.",
  {},
  async () => ({
    content: [{ type: "text", text: getStatePatterns() }],
  })
);

// ─── Pattern Tool 5: get-api-patterns ────────────────────────────────
// Call when: creating API services, data fetching hooks

server.tool(
  "get-api-patterns",
  "Get API and data fetching patterns (Axios + TanStack Query). Call this when creating API services or data fetching hooks. Covers Axios client with interceptors, domain-grouped services, custom query/mutation hooks, query key conventions, and QueryClient config.",
  {},
  async () => ({
    content: [{ type: "text", text: getApiPatterns() }],
  })
);

// ─── Pattern Tool 6: get-styling-patterns ────────────────────────────
// Call when: styling components

server.tool(
  "get-styling-patterns",
  "Get styling patterns (NativeWind / Tailwind CSS). Call this when styling components. Covers NativeWind v4 className approach, arbitrary values, cssInterop for third-party components, Tailwind config, JS constants, conditional styles, and setup checklist.",
  {},
  async () => ({
    content: [{ type: "text", text: getStylingPatterns() }],
  })
);

// ─── Pattern Tool 7: get-performance-patterns ────────────────────────
// Call when: optimizing lists, images, bundle, animations

server.tool(
  "get-performance-patterns",
  "Get performance optimization patterns. Call this when optimizing lists, images, bundle size, or animations. Covers FlashList/FlatList, image optimization, tree-shaking, barrel exports, React Compiler, Concurrent React (useDeferredValue, useTransition), InteractionManager, and Reanimated worklets.",
  {},
  async () => ({
    content: [{ type: "text", text: getPerformancePatterns() }],
  })
);

// ─── Pattern Tool 8: get-project-structure ───────────────────────────
// Call when: deciding where to place a new file

server.tool(
  "get-project-structure",
  "Get project folder structure and file placement guide. Call this when deciding where to place a new file. Covers the full folder tree, where to put screens/components/hooks/services/stores/types/constants, naming conventions, and import aliases.",
  {},
  async () => ({
    content: [{ type: "text", text: getProjectStructure() }],
  })
);

// ─── Pattern Tool 9: get-typescript-patterns ─────────────────────────
// Call when: writing types, interfaces, generics

server.tool(
  "get-typescript-patterns",
  "Get TypeScript patterns for React Native. Call this when writing types or interfaces. Covers strict mode config, path aliases, model types, API response types, route param typing, props interface naming, store types, generics for reusable hooks, as const, and discriminated unions.",
  {},
  async () => ({
    content: [{ type: "text", text: getTypescriptPatterns() }],
  })
);

// ─── Pattern Tool 10: get-memory-optimization ────────────────────────
// Call when: debugging memory leaks, performance issues

server.tool(
  "get-memory-optimization",
  "Get memory optimization patterns. Call this when debugging memory leaks or performance issues. Covers useEffect cleanup (listeners, timers, InteractionManager), closure memory leaks, React Native DevTools memory profiler, view flattening, R8 shrinking for Android, and a common memory leak sources checklist.",
  {},
  async () => ({
    content: [{ type: "text", text: getMemoryOptimization() }],
  })
);

// ─── Setup Tool 11: setup-new-project ────────────────────────────────

server.tool(
  "setup-new-project",
  "Get a step-by-step guide for creating a new Expo Router project from scratch. Covers: project creation, TypeScript strict mode + path aliases, NativeWind v4, folder structure, Zustand + MMKV, Axios + TanStack Query, environment variables, EAS Build, OTA Updates, CI/CD, and build/deploy commands.",
  {},
  async () => ({
    content: [{ type: "text", text: getSetupNewProject() }],
  })
);

// ─── Generator Tool 12: generate-project-files ───────────────────────

server.tool(
  "generate-project-files",
  "Generate starter files for a NEW React Native + Expo Router project. Produces actual file contents: navigation layouts, Zustand store, API client, NativeWind config, TypeScript config, and sample screens.",
  {
    appName: z.string().describe("App name"),
    features: z
      .array(z.string())
      .optional()
      .describe('List of features (e.g. ["auth", "catalog", "cart"])'),
    includeCI: z
      .boolean()
      .default(false)
      .describe("Include GitHub Actions CI/CD"),
  },
  async ({ appName, features, includeCI }) => {
    const content = generateProjectFiles({
      appName,
      router: "expo-router",
      features,
      includeCI,
      includeEnvSetup: true,
    });
    return {
      content: [{ type: "text", text: content }],
    };
  }
);

// ─── Generator Tool 13: generate-claude-md ───────────────────────────

server.tool(
  "generate-claude-md",
  "Generate a CLAUDE.md file with project rules for Claude Code. Includes tech stack overview, architecture rules, code conventions, and MCP tool usage instructions so Claude automatically calls the right pattern tools during development.",
  {
    appName: z.string().describe("App name"),
    appDescription: z
      .string()
      .optional()
      .describe("Short description of the app"),
    features: z
      .array(z.string())
      .optional()
      .describe("List of main features"),
  },
  async ({ appName, appDescription, features }) => {
    const content = generateClaudeMd({
      appName,
      router: "expo-router",
      appDescription,
      features,
    });
    return {
      content: [{ type: "text", text: content }],
    };
  }
);

// ─── Prompt: init-mobile-project ─────────────────────────────────────

server.prompt(
  "init-mobile-project",
  "Interactive wizard for setting up a new Expo Router mobile app",
  {},
  async () => ({
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: `I want to create a new mobile app with React Native + Expo Router.

Help me set it up. Please ask me:

1. **Is this a new project or an existing one?**
2. **What features do you need?** (auth, catalog, cart, chat, payments, etc.)
3. **Do you need CI/CD (GitHub Actions)?**

Based on the answers:
- For a NEW project: use \`generate-project-files\` to scaffold files and \`generate-claude-md\` to create project rules
- For setup guidance: use \`setup-new-project\` for a step-by-step walkthrough
- For patterns during development: use the appropriate pattern tool:
  - Creating a component → \`get-component-patterns\`
  - Creating a screen → \`get-screen-architecture\`
  - Working with navigation → \`get-navigation-patterns\`
  - Working with state → \`get-state-patterns\`
  - Creating API hooks → \`get-api-patterns\`
  - Styling → \`get-styling-patterns\`
  - Performance issues → \`get-performance-patterns\`
  - Memory leaks → \`get-memory-optimization\`
  - File placement → \`get-project-structure\`
  - TypeScript types → \`get-typescript-patterns\``,
        },
      },
    ],
  })
);

// ─── Start Server ────────────────────────────────────────────────────

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
