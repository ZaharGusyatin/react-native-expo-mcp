export function getStackChoice(): string {
  return `# Best Practice: Вибір стеку

## Expo vs Bare React Native

| Критерій | Expo (Managed) | Bare React Native |
|---|---|---|
| Налаштування | Мінімальне | Ручне (Xcode, Android Studio) |
| Нативні модулі | Через Expo Modules + Prebuild | Повний контроль |
| OTA Updates | Вбудовано (expo-updates) | Потрібна ручна настройка |
| Збірка | EAS Build (хмарна) | Локальна (Xcode/Gradle) |
| Upgrade | \`npx expo install\` | Ручний, часто болісний |

**Рекомендація**: Починайте з **Expo (Managed Workflow)**. Якщо потрібен кастомний нативний код — використовуйте **Expo Prebuild** (config plugins).

## Expo Prebuild (Development Builds)

Expo Prebuild = Managed Workflow + нативний доступ:

\`\`\`bash
# Генерує ios/ та android/ з app.json + config plugins
npx expo prebuild

# Потім збірка через EAS або локально
eas build --profile development
\`\`\`

**Коли потрібен Prebuild:**
- Кастомні нативні модулі (наприклад, специфічний SDK)
- Зміни в \`AndroidManifest.xml\` або \`Info.plist\` через config plugins
- Потрібен dev client замість Expo Go

## Expo Router vs React Navigation

| Критерій | Expo Router | React Navigation |
|---|---|---|
| Підхід | File-based routing | Component-based routing |
| Deep links | Автоматично | Ручна конфігурація |
| Web support | Вбудовано (universal) | Обмежено |
| Гнучкість | Менше (конвенції) | Більше (явна конфігурація) |
| Learning curve | Простіше якщо знаєте Next.js | Простіше якщо знаєте RN |
| Ecosystem | Новий, росте | Зрілий, стабільний |
| Server Actions | Підтримка (experimental) | Ні |

**Рекомендація**:
- **Новий проект** → **Expo Router** (сучасний підхід, менше коду, auto deep links)
- **Існуючий проект з React Navigation** → залишайтесь (міграція не варта зусиль)
- **Потрібен максимальний контроль** → **React Navigation**

## Рекомендований стек

| Категорія | Інструмент | Чому |
|---|---|---|
| Framework | Expo (Managed + Prebuild) | Найкращий DX, OTA, EAS |
| Navigation | Expo Router / React Navigation | Залежить від проекту |
| Styling | NativeWind v4 (Tailwind CSS) | Швидка розробка, консистентність |
| State | Zustand + MMKV | Мінімальний, швидкий, persist |
| API | Axios + TanStack Query | Interceptors, кеш, refetch |
| Forms | React Hook Form + Zod | Типізована валідація |
| Language | TypeScript (strict) | Type safety |

## OTA Updates — стратегія

OTA дозволяє оновлювати JS без App Store review:
- **Bug fix** → OTA (миттєво)
- **Новий нативний модуль** → Нова збірка через EAS
- **UI зміни** → OTA
- **Нова версія SDK** → Нова збірка

Правило: якщо ви не змінювали нативний код — можна OTA.
`;
}
