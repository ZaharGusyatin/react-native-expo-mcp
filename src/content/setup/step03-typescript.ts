export function getStep03(): string {
  return `# Крок 3 — Налаштування TypeScript

## 3.1 Увімкнення Strict Mode

Відкрийте \`tsconfig.json\` і налаштуйте strict mode:

\`\`\`json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@screens/*": ["./src/screens/*"],
      "@store/*": ["./src/store/*"],
      "@services/*": ["./src/services/*"],
      "@hooks/*": ["./src/hooks/*"],
      "@constants/*": ["./src/constants/*"],
      "@app-types/*": ["./src/types/*"],
      "@utils/*": ["./src/utils/*"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx", ".expo/types/**/*.ts", "expo-env.d.ts"]
}
\`\`\`

**Чому strict?**
- \`strict: true\` — ловить помилки на етапі компіляції (null checks, implicit any, etc.)
- \`noUncheckedIndexedAccess\` — додає \`undefined\` до index signatures (безпечніший доступ до масивів/об'єктів)

## 3.2 Path Aliases — Runtime Resolution

TypeScript \`paths\` працюють тільки для type-checking. Для runtime потрібен додатковий крок:

### Expo Router (SDK 50+)

Expo Router автоматично підтримує \`tsconfig.json\` paths через Metro resolver — **додатковий плагін не потрібен**. Просто налаштуйте paths у \`tsconfig.json\` (крок 3.1) і все працює.

### React Navigation (або без Expo Router)

Для проектів без Expo Router потрібен \`babel-plugin-module-resolver\`:

\`\`\`bash
npx expo install babel-plugin-module-resolver
\`\`\`

Оновіть \`babel.config.js\`:

\`\`\`js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './src',
            '@components': './src/components',
            '@screens': './src/screens',
            '@store': './src/store',
            '@services': './src/services',
            '@hooks': './src/hooks',
            '@constants': './src/constants',
            '@app-types': './src/types',
            '@utils': './src/utils',
          },
        },
      ],
    ],
  };
};
\`\`\`

## 3.3 Приклад використання аліасів

Замість:
\`\`\`tsx
import { Button } from '../../../components/ui/Button';
import { useAuth } from '../../../hooks/useAuth';
import { colors } from '../../../constants/colors';
\`\`\`

Тепер:
\`\`\`tsx
import { Button } from '@components/ui/Button';
import { useAuth } from '@hooks/useAuth';
import { colors } from '@constants/colors';
\`\`\`

## 3.4 Перезапуск Metro

Після зміни \`babel.config.js\` потрібно очистити кеш:

\`\`\`bash
npx expo start --clear
\`\`\`

✅ **Checkpoint**: TypeScript strict mode увімкнено, path aliases працюють у IDE та runtime
`;
}
