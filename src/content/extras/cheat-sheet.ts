export function getCheatSheet(): string {
  return `# Cheat Sheet — Шпаргалка команд

## Expo CLI

\`\`\`bash
# Створити проект
npx create-expo-app@latest my-app

# Запустити dev server
npx expo start
npx expo start --clear          # З очищенням кешу
npx expo start --dev-client     # Для dev client

# Встановити Expo-сумісні пакети
npx expo install <package-name>

# Prebuild (генерація native projects)
npx expo prebuild
npx expo prebuild --clean       # Перегенерувати з нуля

# Run на пристрої/емуляторі
npx expo run:ios
npx expo run:android
npx expo run:ios --device        # На фізичному пристрої

# Lint
npx expo lint

# Export для production
npx expo export
\`\`\`

## EAS CLI

\`\`\`bash
# Авторизація
eas login
eas whoami

# Ініціалізація
eas build:configure

# Build
eas build --profile development --platform ios
eas build --profile development --platform android
eas build --profile preview --platform all
eas build --profile production --platform all

# Статус збірок
eas build:list
eas build:view <build-id>
eas build:cancel <build-id>

# Submit до stores
eas submit --platform ios
eas submit --platform android
eas build --profile production --auto-submit

# OTA Updates
eas update --branch production --message "Fix: ..."
eas update --branch preview --message "Feature: ..."
eas update:list --branch production
eas update:republish --group <group-id>

# Credentials
eas credentials
eas credentials --platform ios
eas credentials --platform android

# Devices (iOS Ad Hoc)
eas device:create
eas device:list

# Версіонування
eas build:version:set --platform ios
eas build:version:set --platform android
\`\`\`

## React Navigation (якщо використовуєте)

\`\`\`bash
npx expo install @react-navigation/native
npx expo install @react-navigation/native-stack
npx expo install @react-navigation/bottom-tabs
npx expo install react-native-screens react-native-safe-area-context
\`\`\`

## Основні пакети стеку

\`\`\`bash
# NativeWind v4
npx expo install nativewind tailwindcss react-native-reanimated react-native-css-interop

# State Management
npx expo install zustand react-native-mmkv

# API
npx expo install axios @tanstack/react-query

# Navigation (Expo Router вже вбудований)
# Або для React Navigation — див. вище

# Images
npx expo install expo-image

# Updates
npx expo install expo-updates

# Forms
npx expo install react-hook-form @hookform/resolvers zod

# Icons
npx expo install @expo/vector-icons

# Secure Storage
npx expo install expo-secure-store

# Fonts
npx expo install expo-font

# Splash Screen
npx expo install expo-splash-screen

# Status Bar
npx expo install expo-status-bar
\`\`\`

## Debugging

\`\`\`bash
# React DevTools
npx react-devtools

# Android logs
adb logcat *:S ReactNative:V ReactNativeJS:V

# Порт forwarding (Android emulator)
adb reverse tcp:8081 tcp:8081
adb reverse tcp:3000 tcp:3000   # Для локального API

# Список пристроїв
adb devices
xcrun simctl list devices
\`\`\`

## Очищення кешу

\`\`\`bash
# Metro
npx expo start --clear

# Watchman
watchman watch-del-all

# npm
rm -rf node_modules && npm install

# iOS
cd ios && pod deintegrate && pod install && cd ..

# Android
cd android && ./gradlew clean && cd ..

# Повне очищення
rm -rf node_modules .expo ios/Pods ios/build android/.gradle android/app/build
watchman watch-del-all
npm install
\`\`\`

## Корисні команди package.json

\`\`\`json
{
  "scripts": {
    "start": "expo start",
    "start:clear": "expo start --clear",
    "start:dev": "expo start --dev-client",
    "ios": "expo run:ios",
    "android": "expo run:android",
    "lint": "expo lint",
    "typecheck": "tsc --noEmit",
    "env:dev": "cp env/env.dev.json env/env.json",
    "env:staging": "cp env/env.staging.json env/env.json",
    "env:prod": "cp env/env.prod.json env/env.json",
    "build:dev": "eas build --profile development --platform all",
    "build:preview": "eas build --profile preview --platform all",
    "build:prod": "eas build --profile production --platform all",
    "update:prod": "eas update --branch production",
    "update:preview": "eas update --branch preview",
    "clean": "rm -rf node_modules .expo && npm install"
  }
}
\`\`\`
`;
}
