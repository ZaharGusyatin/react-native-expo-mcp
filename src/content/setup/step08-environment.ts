export function getStep08(): string {
  return `# Крок 8 — Environment Variables (Script-based підхід)

## 8.1 Чому не .env?

React Native / Expo не має вбудованої підтримки \`.env\` як Next.js. Існуючі рішення (\`react-native-dotenv\`, \`expo-constants\`) мають обмеження.

**Script-based підхід** — простий і надійний:
- JSON файли для кожного середовища
- Скрипт копіює потрібний файл
- TypeScript типізація "з коробки"

## 8.2 Структура

\`\`\`
env/
├── env.dev.json        # Development
├── env.staging.json    # Staging
├── env.prod.json       # Production
└── env.example.json    # Шаблон (в git)

src/constants/
└── config.ts           # Зчитування + типізація
\`\`\`

## 8.3 Файли середовищ

\`\`\`json
// env/env.example.json
{
  "API_URL": "https://api.example.com",
  "APP_ENV": "development",
  "SENTRY_DSN": "",
  "ANALYTICS_KEY": ""
}
\`\`\`

\`\`\`json
// env/env.dev.json
{
  "API_URL": "http://localhost:3000/api",
  "APP_ENV": "development",
  "SENTRY_DSN": "",
  "ANALYTICS_KEY": ""
}
\`\`\`

\`\`\`json
// env/env.staging.json
{
  "API_URL": "https://staging-api.myapp.com",
  "APP_ENV": "staging",
  "SENTRY_DSN": "https://xxx@sentry.io/123",
  "ANALYTICS_KEY": "staging-key"
}
\`\`\`

\`\`\`json
// env/env.prod.json
{
  "API_URL": "https://api.myapp.com",
  "APP_ENV": "production",
  "SENTRY_DSN": "https://xxx@sentry.io/456",
  "ANALYTICS_KEY": "prod-key"
}
\`\`\`

## 8.4 Скрипт перемикання

\`\`\`json
// package.json — scripts
{
  "scripts": {
    "env:dev": "node -e \\"require('fs').copyFileSync('env/env.dev.json','env/env.json')\\"",
    "env:staging": "node -e \\"require('fs').copyFileSync('env/env.staging.json','env/env.json')\\"",
    "env:prod": "node -e \\"require('fs').copyFileSync('env/env.prod.json','env/env.json')\\"",
    "prestart": "npm run env:dev",
    "start": "expo start"
  }
}
\`\`\`

> Використовуємо \`node -e\` замість \`cp\` для кросплатформенності (macOS, Linux, Windows).

## 8.5 Config з типізацією

> **Важливо**: Для імпорту JSON файлів додайте \`"resolveJsonModule": true\` в \`compilerOptions\` вашого \`tsconfig.json\`.

\`\`\`tsx
// src/constants/config.ts
import envConfig from '../../env/env.json';

interface EnvConfig {
  API_URL: string;
  APP_ENV: 'development' | 'staging' | 'production';
  SENTRY_DSN: string;
  ANALYTICS_KEY: string;
}

export function getEnvConfig(): EnvConfig {
  return envConfig as EnvConfig;
}

export const config = {
  get apiUrl() { return getEnvConfig().API_URL; },
  get isDev() { return getEnvConfig().APP_ENV === 'development'; },
  get isStaging() { return getEnvConfig().APP_ENV === 'staging'; },
  get isProd() { return getEnvConfig().APP_ENV === 'production'; },
};
\`\`\`

## 8.6 .gitignore

Додайте до \`.gitignore\`:

\`\`\`
# Environment
env/env.json
env/env.dev.json
env/env.staging.json
env/env.prod.json
\`\`\`

**НЕ ігноруйте** \`env/env.example.json\` — він є шаблоном для інших розробників.

## 8.7 Використання

\`\`\`tsx
import { config, getEnvConfig } from '@constants/config';

// Через helper
console.log(config.apiUrl);
console.log(config.isDev);

// Прямий доступ
const { API_URL, SENTRY_DSN } = getEnvConfig();
\`\`\`

✅ **Checkpoint**: Environment variables працюють, перемикання між dev/staging/prod через npm scripts
`;
}
