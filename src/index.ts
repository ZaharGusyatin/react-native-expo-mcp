#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import { getSetupOverview, getSetupStep, getAllSetupSteps } from "./content/setup/index.js";
import { getBestPractice, type PracticeCategory } from "./content/practices/index.js";
import { getTroubleshooting, getCheatSheet } from "./content/extras/index.js";
import { generateProjectFiles } from "./generators/project-files.js";
import { generateClaudeMd } from "./generators/claude-md.js";
import { generateEnvSetup } from "./generators/env-setup.js";
import type { Router } from "./utils/format.js";

const server = new McpServer({
  name: "react-native-expo-mcp",
  version: "1.0.0",
});

// ─── Tool 1: get-setup-guide ─────────────────────────────────────────

server.tool(
  "get-setup-guide",
  "Покроковий гайд з налаштування React Native + Expo проекту (13 кроків). " +
    "Кроки 2, 5, 7 адаптуються під вибір роутера.",
  {
    step: z
      .union([
        z.literal("overview"),
        z.literal("all"),
        z.coerce.number().int().min(1).max(13),
      ])
      .describe('Номер кроку (1-13), "overview" для огляду, або "all" для всіх кроків'),
    router: z
      .enum(["expo-router", "react-navigation"])
      .default("expo-router")
      .describe("Тип роутера (впливає на кроки 2, 5, 7)"),
  },
  async ({ step, router }) => {
    let content: string;

    if (step === "overview") {
      content = getSetupOverview();
    } else if (step === "all") {
      content = getAllSetupSteps(router as Router);
    } else {
      content = getSetupStep(step as number, router as Router);
    }

    return {
      content: [{ type: "text", text: content }],
    };
  }
);

// ─── Tool 2: get-best-practices ──────────────────────────────────────

server.tool(
  "get-best-practices",
  "Best practices для React Native + Expo розробки по категоріях. " +
    "Включає SOLID, архітектуру, стилі, компоненти, state management, навігацію, performance.",
  {
    category: z
      .enum([
        "stack-choice",
        "architecture",
        "styling",
        "components",
        "state-management",
        "navigation",
        "performance",
        "recommendations",
        "all",
      ])
      .describe("Категорія best practice"),
    router: z
      .enum(["expo-router", "react-navigation"])
      .optional()
      .describe("Тип роутера (впливає на приклади в architecture та navigation)"),
  },
  async ({ category, router }) => {
    const content = getBestPractice(
      category as PracticeCategory,
      router as Router | undefined
    );
    return {
      content: [{ type: "text", text: content }],
    };
  }
);

// ─── Tool 3: generate-project-files ──────────────────────────────────

server.tool(
  "generate-project-files",
  "Генерує starter файли для НОВОГО React Native + Expo проекту. " +
    "Включає навігацію, store, API client, стилі, env config. " +
    "Генерує різні файли залежно від обраного роутера.",
  {
    appName: z.string().describe("Назва додатку"),
    router: z
      .enum(["expo-router", "react-navigation"])
      .describe("Тип роутера"),
    features: z
      .array(z.string())
      .optional()
      .describe('Список фічей (наприклад: ["auth", "catalog", "cart"])'),
    includeCI: z
      .boolean()
      .default(false)
      .describe("Додати GitHub Actions CI/CD"),
    includeEnvSetup: z
      .boolean()
      .default(true)
      .describe("Додати env конфігурацію"),
  },
  async ({ appName, router, features, includeCI, includeEnvSetup }) => {
    const content = generateProjectFiles({
      appName,
      router: router as Router,
      features,
      includeCI,
      includeEnvSetup,
    });
    return {
      content: [{ type: "text", text: content }],
    };
  }
);

// ─── Tool 4: generate-claude-md ──────────────────────────────────────

server.tool(
  "generate-claude-md",
  "Генерує CLAUDE.md з правилами проекту для Claude Code. " +
    "Адаптований під обраний роутер та стек технологій.",
  {
    appName: z.string().describe("Назва додатку"),
    router: z
      .enum(["expo-router", "react-navigation"])
      .describe("Тип роутера"),
    appDescription: z
      .string()
      .optional()
      .describe("Короткий опис додатку"),
    features: z
      .array(z.string())
      .optional()
      .describe("Список основних фічей"),
  },
  async ({ appName, router, appDescription, features }) => {
    const content = generateClaudeMd({
      appName,
      router: router as Router,
      appDescription,
      features,
    });
    return {
      content: [{ type: "text", text: content }],
    };
  }
);

// ─── Tool 5: get-troubleshooting ─────────────────────────────────────

server.tool(
  "get-troubleshooting",
  "Типові проблеми та рішення для React Native + Expo розробки. " +
    "Metro, NativeWind, iOS, Android, EAS Build, Zustand/MMKV, TypeScript.",
  {},
  async () => {
    const content = getTroubleshooting();
    return {
      content: [{ type: "text", text: content }],
    };
  }
);

// ─── Tool 6: get-cheat-sheet ─────────────────────────────────────────

server.tool(
  "get-cheat-sheet",
  "Шпаргалка команд для Expo CLI, EAS CLI, debugging, очищення кешу та інших операцій.",
  {},
  async () => {
    const content = getCheatSheet();
    return {
      content: [{ type: "text", text: content }],
    };
  }
);

// ─── Prompt: init-mobile-project ─────────────────────────────────────

server.prompt(
  "init-mobile-project",
  "Інтерактивний помічник для створення нового мобільного додатку",
  {},
  async () => {
    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Я хочу створити новий мобільний додаток з React Native + Expo.

Допоможи мені налаштувати проект. Спитай мене:

1. **Це новий проект чи існуючий?**
2. **Expo Router або React Navigation?**
   - Expo Router — file-based routing (як Next.js), автоматичний deep linking
   - React Navigation — component-based, більше контролю
3. **Які фічі потрібні?** (auth, catalog, cart, chat, payments, etc.)
4. **Чи потрібен CI/CD (GitHub Actions)?**

На основі відповідей:
- Для НОВОГО проекту: використай \`generate-project-files\` та \`generate-claude-md\`
- Для ІСНУЮЧОГО: використай \`get-best-practices\` та \`get-setup-guide\` для консультацій
- Якщо потрібен troubleshooting: \`get-troubleshooting\`
- Для шпаргалки команд: \`get-cheat-sheet\``,
          },
        },
      ],
    };
  }
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
