export function getStep09(): string {
  return `# Крок 9 — EAS Build

## 9.1 Що таке EAS Build?

**EAS (Expo Application Services)** — хмарний сервіс для:
- Збірки iOS/Android бінарників в хмарі
- Підпису додатків (certificates, provisioning profiles)
- Розповсюдження (App Store, Google Play, internal testing)

## 9.2 Початкова настройка

\`\`\`bash
# Авторизація (якщо ще не)
eas login

# Ініціалізація EAS
eas build:configure
\`\`\`

Це створить \`eas.json\` з базовими профілями.

## 9.3 Конфігурація eas.json

\`\`\`json
{
  "cli": {
    "version": ">= 12.0.0",
    "appVersionSource": "remote"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "resourceClass": "m1-medium"
      },
      "env": {
        "APP_ENV": "development"
      }
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "resourceClass": "m1-medium"
      },
      "env": {
        "APP_ENV": "staging"
      }
    },
    "production": {
      "ios": {
        "resourceClass": "m1-medium"
      },
      "env": {
        "APP_ENV": "production"
      },
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your@apple.id",
        "ascAppId": "123456789"
      },
      "android": {
        "serviceAccountKeyPath": "./google-service-account.json",
        "track": "production"
      }
    }
  }
}
\`\`\`

## 9.4 Build профілі

| Профіль | Для чого | Distribution |
|---|---|---|
| \`development\` | Dev client з hot reload | Internal (команда) |
| \`preview\` | Тестування staging | Internal (QA/клієнт) |
| \`production\` | Релізна збірка | App Store / Google Play |

## 9.5 Запуск збірки

\`\`\`bash
# Development build (dev client)
eas build --profile development --platform ios
eas build --profile development --platform android

# Preview (staging)
eas build --profile preview --platform all

# Production
eas build --profile production --platform all
\`\`\`

## 9.6 Pre-build скрипт для env

Інтеграція environment з EAS Build. Додайте до \`eas.json\`:

\`\`\`json
{
  "build": {
    "production": {
      "env": {
        "APP_ENV": "production"
      }
    }
  }
}
\`\`\`

І в \`package.json\`:

\`\`\`json
{
  "scripts": {
    "eas-build-pre-install": "node scripts/set-env.js"
  }
}
\`\`\`

\`\`\`js
// scripts/set-env.js
const fs = require('fs');
const env = process.env.APP_ENV || 'development';
const source = \`env/env.\${env}.json\`;
const dest = 'env/env.json';

if (fs.existsSync(source)) {
  fs.copyFileSync(source, dest);
  console.log(\`Environment set to: \${env}\`);
} else {
  console.warn(\`Warning: \${source} not found, using example\`);
  fs.copyFileSync('env/env.example.json', dest);
}
\`\`\`

## 9.7 iOS специфіка

Для iOS потрібен Apple Developer Account ($99/рік):

\`\`\`bash
# EAS автоматично керує сертифікатами:
eas credentials
\`\`\`

## 9.8 Android специфіка

Для Google Play потрібен service account:

\`\`\`bash
# Створіть keystore (EAS зробить автоматично при першій збірці)
# Або завантажте свій:
eas credentials --platform android
\`\`\`

✅ **Checkpoint**: eas.json налаштовано з 3 профілями, збірка в хмарі працює
`;
}
