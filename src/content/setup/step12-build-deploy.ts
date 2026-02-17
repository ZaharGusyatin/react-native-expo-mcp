export function getStep12(): string {
  return `# Крок 12 — Build and Deploy

## 12.1 Development Build (Dev Client)

Dev Client — це ваш власний "Expo Go" з кастомними нативними модулями:

\`\`\`bash
# Збірка dev client
eas build --profile development --platform ios
eas build --profile development --platform android
\`\`\`

Після збірки:
1. Встановіть на пристрій/емулятор
2. Запустіть dev server: \`npx expo start --dev-client\`
3. Відкрийте dev client → він підключиться до вашого dev server

## 12.2 Preview Build (Internal Distribution)

Для тестування QA-командою або клієнтом:

\`\`\`bash
eas build --profile preview --platform all
\`\`\`

Після збірки:
- **iOS**: Встановлення через link (Ad Hoc) — потрібна реєстрація UDID
- **Android**: Завантаження APK через link

\`\`\`bash
# Зареєструвати пристрої для iOS Ad Hoc
eas device:create
\`\`\`

## 12.3 Production Build

\`\`\`bash
eas build --profile production --platform all
\`\`\`

## 12.4 Submit до App Store / Google Play

\`\`\`bash
# iOS — App Store Connect
eas submit --platform ios

# Android — Google Play Console
eas submit --platform android

# Або збірка + submit одночасно:
eas build --profile production --platform all --auto-submit
\`\`\`

## 12.5 Версіонування

В \`app.json\`:

\`\`\`json
{
  "expo": {
    "version": "1.0.0",
    "ios": {
      "buildNumber": "1"
    },
    "android": {
      "versionCode": 1
    }
  }
}
\`\`\`

EAS може автоматично інкрементувати:

\`\`\`json
// eas.json
{
  "build": {
    "production": {
      "autoIncrement": true
    }
  }
}
\`\`\`

Або через CLI:

\`\`\`bash
# Remote version source (рекомендовано)
eas build:version:set --platform ios
eas build:version:set --platform android
\`\`\`

## 12.6 Чек-лист перед першим релізом

### iOS (App Store)
- [ ] Apple Developer Account ($99/рік)
- [ ] App Store Connect — створити додаток
- [ ] Іконка 1024×1024
- [ ] Скріншоти для iPhone та iPad
- [ ] Privacy Policy URL
- [ ] Опис додатку

### Android (Google Play)
- [ ] Google Play Developer Account ($25 одноразово)
- [ ] Google Play Console — створити додаток
- [ ] Іконка 512×512
- [ ] Feature graphic 1024×500
- [ ] Скріншоти
- [ ] Privacy Policy URL
- [ ] Content rating

## 12.7 Корисні команди

\`\`\`bash
# Статус збірок
eas build:list

# Деталі конкретної збірки
eas build:view <build-id>

# Скасувати збірку
eas build:cancel <build-id>

# Подивитись credentials
eas credentials
\`\`\`

✅ **Checkpoint**: Dev/Preview/Production builds працюють, submit до stores налаштований
`;
}
