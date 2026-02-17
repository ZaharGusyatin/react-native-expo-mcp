export function generateEnvSetup(appName: string): string {
  return `# Environment Setup для ${appName}

Створіть наступні файли:

## env/env.example.json
\`\`\`json
{
  "API_URL": "https://api.example.com",
  "APP_ENV": "development",
  "SENTRY_DSN": "",
  "ANALYTICS_KEY": ""
}
\`\`\`

## env/env.dev.json
\`\`\`json
{
  "API_URL": "http://localhost:3000/api",
  "APP_ENV": "development",
  "SENTRY_DSN": "",
  "ANALYTICS_KEY": ""
}
\`\`\`

## env/env.staging.json
\`\`\`json
{
  "API_URL": "https://staging-api.${appName.toLowerCase()}.com",
  "APP_ENV": "staging",
  "SENTRY_DSN": "",
  "ANALYTICS_KEY": ""
}
\`\`\`

## env/env.prod.json
\`\`\`json
{
  "API_URL": "https://api.${appName.toLowerCase()}.com",
  "APP_ENV": "production",
  "SENTRY_DSN": "",
  "ANALYTICS_KEY": ""
}
\`\`\`

## scripts/set-env.js
\`\`\`js
const fs = require('fs');
const env = process.env.APP_ENV || 'development';
const source = \\\`env/env.\\\${env}.json\\\`;
const dest = 'env/env.json';

if (fs.existsSync(source)) {
  fs.copyFileSync(source, dest);
  console.log(\\\`Environment set to: \\\${env}\\\`);
} else {
  console.warn(\\\`Warning: \\\${source} not found, using example\\\`);
  fs.copyFileSync('env/env.example.json', dest);
}
\`\`\`

## src/constants/config.ts
\`\`\`tsx
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
  get isProd() { return getEnvConfig().APP_ENV === 'production'; },
};
\`\`\`

## Додати до .gitignore
\`\`\`
env/env.json
env/env.dev.json
env/env.staging.json
env/env.prod.json
\`\`\`

## Додати до package.json scripts
\`\`\`json
{
  "env:dev": "node -e \\"require('fs').copyFileSync('env/env.dev.json','env/env.json')\\"",
  "env:staging": "node -e \\"require('fs').copyFileSync('env/env.staging.json','env/env.json')\\"",
  "env:prod": "node -e \\"require('fs').copyFileSync('env/env.prod.json','env/env.json')\\"",
  "prestart": "npm run env:dev"
}
\`\`\`
`;
}
