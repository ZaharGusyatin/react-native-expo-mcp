import { Router } from "../../utils/format.js";
import { getStep01 } from "./step01-install-tools.js";
import { getStep02 } from "./step02-create-project.js";
import { getStep03 } from "./step03-typescript.js";
import { getStep04 } from "./step04-nativewind.js";
import { getStep05 } from "./step05-project-structure.js";
import { getStep06 } from "./step06-state-management.js";
import { getStep07 } from "./step07-api-client.js";
import { getStep08 } from "./step08-environment.js";
import { getStep09 } from "./step09-eas-build.js";
import { getStep10 } from "./step10-ota-updates.js";
import { getStep11 } from "./step11-ci-cd.js";
import { getStep12 } from "./step12-build-deploy.js";
import { getStep13 } from "./step13-testing-devices.js";

const STEP_TITLES = [
  "Install Required Tools",
  "Create New Expo Project",
  "Configure TypeScript",
  "Install NativeWind v4",
  "Setup Project Structure",
  "State Management (Zustand + MMKV)",
  "API Client (Axios + TanStack Query)",
  "Environment Variables",
  "EAS Build",
  "OTA Updates",
  "CI/CD (GitHub Actions)",
  "Build and Deploy",
  "Testing on Devices",
];

export function getSetupOverview(): string {
  const steps = STEP_TITLES.map((title, i) => `${i + 1}. ${title}`).join("\n");
  return `# Setup Tutorial — Огляд

Повний гайд з налаштування React Native + Expo проекту (13 кроків):

${steps}

Використовуйте \`get-setup-guide\` з параметром \`step\` для отримання конкретного кроку.
Кроки 2, 5, 7 адаптуються під ваш вибір роутера (\`expo-router\` або \`react-navigation\`).
`;
}

export function getSetupStep(step: number, router: Router): string {
  switch (step) {
    case 1: return getStep01();
    case 2: return getStep02(router);
    case 3: return getStep03();
    case 4: return getStep04();
    case 5: return getStep05(router);
    case 6: return getStep06();
    case 7: return getStep07(router);
    case 8: return getStep08();
    case 9: return getStep09();
    case 10: return getStep10();
    case 11: return getStep11();
    case 12: return getStep12();
    case 13: return getStep13();
    default: return `Крок ${step} не знайдено. Доступні кроки: 1-13.`;
  }
}

export function getAllSetupSteps(router: Router): string {
  const parts: string[] = [];
  for (let i = 1; i <= 13; i++) {
    parts.push(getSetupStep(i, router));
  }
  return parts.join("\n\n---\n\n");
}
