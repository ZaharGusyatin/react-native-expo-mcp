export function getStep04(): string {
  return `# Крок 4 — Встановлення NativeWind v4

NativeWind дозволяє використовувати Tailwind CSS синтаксис в React Native.

## 4.1 Встановлення залежностей

\`\`\`bash
npx expo install nativewind tailwindcss react-native-reanimated react-native-css-interop
\`\`\`

## 4.2 Створення tailwind.config.js

\`\`\`bash
npx tailwindcss init
\`\`\`

Оновіть \`tailwind.config.js\`:

\`\`\`js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#007AFF',
        secondary: '#5856D6',
        background: '#F2F2F7',
        surface: '#FFFFFF',
        error: '#FF3B30',
        success: '#34C759',
      },
    },
  },
  plugins: [],
};
\`\`\`

## 4.3 Створення global.css

Створіть файл \`global.css\` у корені проекту:

\`\`\`css
@tailwind base;
@tailwind components;
@tailwind utilities;
\`\`\`

## 4.4 Оновлення babel.config.js

\`\`\`js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      'babel-preset-expo',
      'nativewind/babel',
    ],
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
          },
        },
      ],
    ],
  };
};
\`\`\`

## 4.5 Налаштування metro.config.js

Створіть або оновіть \`metro.config.js\`:

\`\`\`js
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: "./global.css" });
\`\`\`

## 4.6 Імпорт global.css

У кореневому layout файлі (для Expo Router — \`app/_layout.tsx\`, для React Navigation — \`App.tsx\`):

\`\`\`tsx
import "../global.css";
// або
import "./global.css";
\`\`\`

## 4.7 Типізація

Створіть або оновіть \`nativewind-env.d.ts\`:

\`\`\`ts
/// <reference types="nativewind/types" />
\`\`\`

## 4.8 Приклад використання

\`\`\`tsx
import { View, Text, Pressable } from 'react-native';

export function WelcomeCard() {
  return (
    <View className="bg-white rounded-2xl p-4 shadow-sm mx-4">
      <Text className="text-lg font-bold text-gray-900">
        Ласкаво просимо!
      </Text>
      <Text className="text-sm text-gray-500 mt-1">
        Ваш проект готовий до роботи
      </Text>
      <Pressable className="bg-primary rounded-xl py-3 mt-4 active:opacity-70">
        <Text className="text-white text-center font-semibold">
          Почати
        </Text>
      </Pressable>
    </View>
  );
}
\`\`\`

## 4.9 Перезапуск

Після всіх змін обов'язково очистіть кеш:

\`\`\`bash
npx expo start --clear
\`\`\`

✅ **Checkpoint**: NativeWind v4 встановлено, Tailwind класи працюють у компонентах
`;
}
