import { Router } from "../utils/format.js";

interface ClaudeMdOptions {
  appName: string;
  router: Router;
  appDescription?: string;
  features?: string[];
}

export function generateClaudeMd(options: ClaudeMdOptions): string {
  const { appName, router, appDescription, features } = options;

  const descriptionSection = appDescription
    ? `\n## Опис\n${appDescription}\n`
    : "";

  const featuresSection = features && features.length > 0
    ? `\n## Основні фічі\n${features.map((f) => `- ${f}`).join("\n")}\n`
    : "";

  if (router === "expo-router") {
    return `# ${appName}
${descriptionSection}${featuresSection}
## Стек технологій

- **Framework**: Expo (Managed Workflow)
- **Navigation**: Expo Router (file-based routing)
- **Language**: TypeScript (strict mode)
- **Styling**: NativeWind v4 (Tailwind CSS)
- **State Management**: Zustand + MMKV (persist)
- **API**: Axios + TanStack Query
- **Forms**: React Hook Form + Zod
- **Build**: EAS Build + OTA Updates

## Архітектура

### File-based Routing (Expo Router)
- Файли в \`app/\` = маршрути
- \`app/_layout.tsx\` = root layout (providers)
- \`app/(tabs)/\` = tab navigator
- \`app/(auth)/\` = auth screens (stack)

### Logic/UI Separation
- **Route файл** (\`app/*.tsx\`) = контейнер (логіка, hooks, handlers)
- **Screen UI** (\`src/screens/*UI.tsx\`) = чистий UI (props-driven)
- UI компоненти НЕ залежать від навігації

### Структура проекту
\`\`\`
app/                    # Routes (Expo Router)
├── _layout.tsx         # Root layout
├── (auth)/             # Auth group
│   └── login.tsx       # Login route (логіка)
├── (tabs)/             # Tab navigator
│   ├── _layout.tsx     # Tab config
│   ├── index.tsx       # Home tab
│   └── catalog.tsx     # Catalog tab
└── (tabs)/product/
    └── [id].tsx        # Dynamic route

src/
├── screens/            # Screen UI компоненти
├── components/         # Shared UI
│   ├── ui/             # Button, Input, Card
│   └── shared/         # ProductCard, etc.
├── store/              # Zustand stores
├── services/api/       # Axios client + API calls
├── hooks/              # Custom hooks (TanStack Query)
├── constants/          # Colors, config
├── types/              # TypeScript types
└── utils/              # Helpers
\`\`\`

## Правила коду

### Компоненти
- Використовуй \`Pressable\` замість \`TouchableOpacity\`
- Використовуй \`expo-image\` замість \`Image\`
- Використовуй \`className\` (NativeWind) для стилів
- \`React.memo\` для list items
- Composable pattern для складних компонентів

### State Management
- **Zustand** для client state (auth, cart, settings)
- **TanStack Query** для server state (products, orders)
- Завжди використовуй **селектори**: \`useStore((s) => s.field)\`
- \`useShallow\` для множинних значень
- MMKV persist для auth та settings

### API
- Axios instance з interceptors (auth token, 401 handling)
- TanStack Query hooks для data fetching
- Query key conventions: \`['entity', ...params]\`

### Navigation
- \`router.push()\` для навігації
- \`useLocalSearchParams()\` для параметрів
- Protected routes в \`_layout.tsx\`
- Deep linking працює автоматично

### TypeScript
- Strict mode завжди
- Ніяких \`any\` (максимум \`unknown\` з type guard)
- Типізовані route params
- Path aliases: \`@/\`, \`@components/\`, \`@store/\`, etc.

### Стилі
- NativeWind (Tailwind CSS) для 90% стилів
- Кольори через theme (\`tailwind.config.js\`)
- \`cssInterop\` для third-party компонентів
- Constants для значень потрібних в JS

### Performance
- \`FlatList\` або \`FlashList\` для списків (НЕ ScrollView+map)
- \`expo-image\` з кешуванням
- WebP формат для зображень
- Tree shaking imports
`;
  }

  // React Navigation variant
  return `# ${appName}
${descriptionSection}${featuresSection}
## Стек технологій

- **Framework**: Expo (Managed Workflow)
- **Navigation**: React Navigation (native-stack + bottom-tabs)
- **Language**: TypeScript (strict mode)
- **Styling**: NativeWind v4 (Tailwind CSS)
- **State Management**: Zustand + MMKV (persist)
- **API**: Axios + TanStack Query
- **Forms**: React Hook Form + Zod
- **Build**: EAS Build + OTA Updates

## Архітектура

### Component-based Navigation (React Navigation)
- Навігатори в \`src/navigation/\`
- \`AppNavigator.tsx\` = root (auth conditional)
- \`MainNavigator.tsx\` = bottom tabs
- \`AuthNavigator.tsx\` = auth stack

### Container/UI Pattern
- **Container** (\`*Screen.tsx\`) = логіка (hooks, store, navigation)
- **UI** (\`*ScreenUI.tsx\`) = чистий UI (props-driven)
- UI компоненти НЕ залежать від навігації

### Структура проекту
\`\`\`
src/
├── navigation/         # Навігатори
│   ├── AppNavigator.tsx
│   ├── AuthNavigator.tsx
│   ├── MainNavigator.tsx
│   └── types.ts        # ParamList types
├── screens/            # Screens (Container + UI)
│   ├── auth/
│   │   ├── LoginScreen.tsx      # Container
│   │   └── LoginScreenUI.tsx    # UI
│   └── catalog/
│       ├── CatalogScreen.tsx
│       └── CatalogScreenUI.tsx
├── components/         # Shared UI
│   ├── ui/             # Button, Input, Card
│   └── shared/         # ProductCard, etc.
├── store/              # Zustand stores
├── services/api/       # Axios client + API calls
├── hooks/              # Custom hooks (TanStack Query)
├── constants/          # Colors, config
├── types/              # TypeScript types
└── utils/              # Helpers
\`\`\`

## Правила коду

### Компоненти
- Використовуй \`Pressable\` замість \`TouchableOpacity\`
- Використовуй \`expo-image\` замість \`Image\`
- Використовуй \`className\` (NativeWind) для стилів
- \`React.memo\` для list items
- Composable pattern для складних компонентів

### State Management
- **Zustand** для client state (auth, cart, settings)
- **TanStack Query** для server state (products, orders)
- Завжди використовуй **селектори**: \`useStore((s) => s.field)\`
- \`useShallow\` для множинних значень
- MMKV persist для auth та settings

### API
- Axios instance з interceptors (auth token, 401 handling)
- TanStack Query hooks для data fetching
- Query key conventions: \`['entity', ...params]\`

### Navigation
- Typed ParamList для всіх navigators
- \`NativeStackScreenProps\` для screen props
- Conditional navigators для auth flow
- Deep linking через \`linking\` config

### TypeScript
- Strict mode завжди
- Ніяких \`any\` (максимум \`unknown\` з type guard)
- Typed navigation props (ParamList)
- Path aliases: \`@/\`, \`@components/\`, \`@store/\`, etc.

### Стилі
- NativeWind (Tailwind CSS) для 90% стилів
- Кольори через theme (\`tailwind.config.js\`)
- \`cssInterop\` для third-party компонентів
- Constants для значень потрібних в JS

### Performance
- \`FlatList\` або \`FlashList\` для списків (НЕ ScrollView+map)
- \`expo-image\` з кешуванням
- WebP формат для зображень
- Tree shaking imports
`;
}
