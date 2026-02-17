import { Router } from "../../utils/format.js";

export function getStep02(router: Router): string {
  if (router === "expo-router") {
    return `# Крок 2 — Створення нового Expo проекту (Expo Router)

## 2.1 Створення проекту

Expo Router — це file-based routing для React Native, натхненний Next.js.
Починаючи з Expo SDK 50+, Expo Router вбудований у шаблон за замовчуванням:

\`\`\`bash
npx create-expo-app@latest my-app
cd my-app
\`\`\`

Це створить проект з Expo Router, TypeScript, та базовою структурою.

## 2.2 Структура після створення

\`\`\`
my-app/
├── app/                    # File-based routes (Expo Router)
│   ├── (tabs)/             # Tab navigator group
│   │   ├── _layout.tsx     # Tab layout configuration
│   │   ├── index.tsx       # Home tab (/)
│   │   └── explore.tsx     # Explore tab (/explore)
│   ├── _layout.tsx         # Root layout
│   └── +not-found.tsx      # 404 page
├── assets/                 # Статичні ресурси (зображення, шрифти)
├── components/             # Базові компоненти (з шаблону)
├── constants/              # Константи (Colors, etc.)
├── hooks/                  # Custom hooks
├── scripts/                # Утиліти
├── app.json                # Expo конфігурація
├── babel.config.js
├── package.json
└── tsconfig.json
\`\`\`

**Ключовий принцип**: файли в \`app/\` = маршрути. \`app/index.tsx\` → \`/\`, \`app/profile.tsx\` → \`/profile\`.

## 2.3 Запуск проекту

\`\`\`bash
npx expo start
\`\`\`

Варіанти запуску:
- Натисніть \`i\` — iOS Simulator
- Натисніть \`a\` — Android Emulator
- Скануйте QR-код — Expo Go на фізичному пристрої

## 2.4 Перевірка роботи Expo Router

Відкрийте \`app/(tabs)/index.tsx\` і змініть текст — зміни мають з'явитись миттєво (hot reload).

Перейдіть між табами — навігація працює автоматично через file-based routing.

✅ **Checkpoint**: Проект створено, \`npx expo start\` працює, навігація між табами функціонує
`;
  }

  return `# Крок 2 — Створення нового Expo проекту (React Navigation)

## 2.1 Створення проекту

React Navigation — це component-based routing, де навігація описується в коді:

\`\`\`bash
npx create-expo-app@latest my-app --template blank-typescript
cd my-app
\`\`\`

## 2.2 Встановлення React Navigation

\`\`\`bash
npx expo install @react-navigation/native @react-navigation/native-stack

npx expo install react-native-screens react-native-safe-area-context
\`\`\`

Для tab-навігації (опціонально):
\`\`\`bash
npx expo install @react-navigation/bottom-tabs
\`\`\`

## 2.3 Базова конфігурація навігації

Створіть \`App.tsx\` (або оновіть існуючий):

\`\`\`tsx
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
\`\`\`

## 2.4 Структура після налаштування

\`\`\`
my-app/
├── src/
│   ├── screens/            # Екрани (containers + UI)
│   │   └── HomeScreen.tsx
│   ├── navigation/         # Навігатори
│   │   └── AppNavigator.tsx
│   ├── components/         # UI-компоненти
│   ├── store/              # State management
│   ├── services/           # API, storage
│   ├── hooks/              # Custom hooks
│   ├── constants/          # Кольори, розміри
│   └── types/              # TypeScript типи
├── assets/                 # Статичні ресурси
├── App.tsx                 # Точка входу з NavigationContainer
├── app.json
├── babel.config.js
├── package.json
└── tsconfig.json
\`\`\`

## 2.5 Запуск проекту

\`\`\`bash
npx expo start
\`\`\`

Варіанти запуску:
- Натисніть \`i\` — iOS Simulator
- Натисніть \`a\` — Android Emulator
- Скануйте QR-код — Expo Go на фізичному пристрої

✅ **Checkpoint**: Проект створено, React Navigation встановлено, базова навігація працює
`;
}
