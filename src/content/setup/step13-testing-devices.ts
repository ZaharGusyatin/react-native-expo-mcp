export function getStep13(): string {
  return `# Крок 13 — Тестування на пристроях

## 13.1 Варіанти тестування

| Метод | Платформа | Швидкість | Нативний код |
|---|---|---|---|
| Expo Go | iOS + Android | Найшвидший | Обмежено |
| Dev Client | iOS + Android | Швидкий | Повна підтримка |
| iOS Simulator | macOS only | Середній | Повна підтримка |
| Android Emulator | All platforms | Середній | Повна підтримка |
| Фізичний пристрій | iOS + Android | Залежить | Повна підтримка |

## 13.2 Expo Go (швидкий старт)

\`\`\`bash
npx expo start
\`\`\`

- Скануйте QR-код камерою (iOS) або через Expo Go app (Android)
- **Обмеження**: не підтримує кастомні нативні модулі

## 13.3 Dev Client (рекомендовано)

\`\`\`bash
# Збірка dev client
eas build --profile development --platform ios
eas build --profile development --platform android

# Запуск з dev client
npx expo start --dev-client
\`\`\`

Переваги:
- Підтримка ВСІХ нативних модулів
- Hot reload як в Expo Go
- Кастомний splash screen

## 13.4 iOS Simulator (macOS)

\`\`\`bash
# Запуск на симуляторі
npx expo run:ios

# Або через Xcode
npx expo prebuild --platform ios
open ios/*.xcworkspace
\`\`\`

## 13.5 Android Emulator

\`\`\`bash
# Запуск на емуляторі
npx expo run:android

# Список пристроїв
adb devices

# Логи
adb logcat *:E
\`\`\`

## 13.6 Тестування на фізичних пристроях

### iOS (фізичний пристрій)

**Через EAS:**
\`\`\`bash
# Зареєструвати пристрій
eas device:create

# Збірка з internal distribution
eas build --profile development --platform ios
\`\`\`

**Через Xcode:**
1. Підключіть iPhone через USB
2. \`npx expo run:ios --device\`

### Android (фізичний пристрій)

1. Увімкніть Developer Options → USB Debugging
2. Підключіть через USB
3. \`npx expo run:android --device\`

## 13.7 Debugging

### React Native DevTools

\`\`\`bash
# В Metro bundler натисніть j — відкриє React Native DevTools
# Або натисніть shift+m для меню інструментів
\`\`\`

### Корисні інструменти

- **React Native DevTools**: Вбудований debugger (SDK 52+), замінює Flipper
- **React DevTools**: \`npx react-devtools\` — інспекція компонентів та props
- **Reactotron**: Логування, state inspection, API monitoring

> **Примітка**: Flipper deprecated починаючи з React Native 0.73+ та Expo SDK 51+. Використовуйте React Native DevTools замість нього.

### Console.log

\`\`\`bash
# iOS Simulator logs
npx expo start

# Android logs
adb logcat *:S ReactNative:V ReactNativeJS:V
\`\`\`

## 13.8 Типові проблеми

| Проблема | Рішення |
|---|---|
| "Unable to resolve module" | \`npx expo start --clear\` |
| iOS build fails | \`cd ios && pod install && cd ..\` |
| Android build fails | \`cd android && ./gradlew clean && cd ..\` |
| Hot reload не працює | Перевірте Watchman: \`watchman watch-del-all\` |
| Metro stuck | \`rm -rf node_modules/.cache\` |

## 13.9 Performance Testing

\`\`\`bash
# Release build для performance тестів (без dev mode overhead)
npx expo run:ios --configuration Release
npx expo run:android --variant release
\`\`\`

> Dev mode додає значний overhead — завжди тестуйте performance на release builds.

✅ **Checkpoint**: Тестування на емуляторах та фізичних пристроях працює, debugging налаштований
`;
}
