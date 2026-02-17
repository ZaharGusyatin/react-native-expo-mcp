import { Router } from "../../utils/format.js";

export function getStep05(router: Router): string {
  if (router === "expo-router") {
    return `# Крок 5 — Структура проекту (Expo Router)

## 5.1 Feature-based структура

Організовуємо код за фічами, а не за типами файлів:

\`\`\`
my-app/
├── app/                          # Routes (Expo Router)
│   ├── _layout.tsx               # Root layout (providers, fonts)
│   ├── +not-found.tsx            # 404 сторінка
│   ├── index.tsx                 # Redirect або Landing
│   │
│   ├── (auth)/                   # Auth group (без табів)
│   │   ├── _layout.tsx           # Stack navigator для auth
│   │   ├── login.tsx             # /login — логіка авторизації
│   │   └── register.tsx          # /register
│   │
│   ├── (tabs)/                   # Main app (з табами)
│   │   ├── _layout.tsx           # Tab navigator
│   │   ├── index.tsx             # Home tab (/)
│   │   ├── catalog.tsx           # Catalog tab
│   │   ├── cart.tsx              # Cart tab
│   │   └── profile.tsx          # Profile tab
│   │
│   └── (tabs)/product/
│       └── [id].tsx              # /product/123 — Dynamic route
│
├── src/
│   ├── screens/                  # Screen UI-компоненти (тільки UI!)
│   │   ├── auth/
│   │   │   ├── LoginScreenUI.tsx
│   │   │   └── RegisterScreenUI.tsx
│   │   ├── home/
│   │   │   └── HomeScreenUI.tsx
│   │   ├── catalog/
│   │   │   └── CatalogScreenUI.tsx
│   │   └── product/
│   │       └── ProductScreenUI.tsx
│   │
│   ├── components/               # Shared UI-компоненти
│   │   ├── ui/                   # Базові: Button, Input, Card
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Card.tsx
│   │   ├── layout/               # Header, Container, SafeArea
│   │   │   └── Container.tsx
│   │   └── shared/               # ProductCard, UserAvatar, etc.
│   │       └── ProductCard.tsx
│   │
│   ├── store/                    # Zustand stores
│   │   ├── auth.ts
│   │   ├── cart.ts
│   │   └── index.ts
│   │
│   ├── services/                 # Зовнішні сервіси
│   │   ├── api/
│   │   │   ├── client.ts         # Axios instance
│   │   │   ├── auth.ts           # Auth API calls
│   │   │   └── products.ts       # Products API calls
│   │   └── storage/
│   │       └── mmkv.ts           # MMKV instance
│   │
│   ├── hooks/                    # Custom hooks
│   │   ├── useAuth.ts
│   │   └── useProducts.ts        # TanStack Query hooks
│   │
│   ├── constants/
│   │   ├── colors.ts
│   │   └── config.ts
│   │
│   ├── types/
│   │   ├── auth.ts
│   │   └── product.ts
│   │
│   └── utils/
│       ├── validation.ts
│       └── formatting.ts
│
├── assets/
│   ├── images/
│   └── fonts/
│
├── app.json
├── babel.config.js
├── metro.config.js
├── tailwind.config.js
├── global.css
├── tsconfig.json
└── package.json
\`\`\`

## 5.2 Принцип Logic/UI Separation

**Route файл** (\`app/\`) — логіка:
- Hooks (store, API, navigation)
- Data fetching
- Event handlers

**Screen UI** (\`src/screens/\`) — чистий UI:
- Props-driven
- Ніякої бізнес-логіки
- Легко тестувати

Приклад:

\`\`\`tsx
// app/(tabs)/catalog.tsx — ЛОГІКА
import { CatalogScreenUI } from '@screens/catalog/CatalogScreenUI';
import { useProducts } from '@hooks/useProducts';
import { useCartStore } from '@store/cart';

export default function CatalogRoute() {
  const { data: products, isLoading } = useProducts();
  const addToCart = useCartStore((s) => s.addItem);

  return (
    <CatalogScreenUI
      products={products ?? []}
      isLoading={isLoading}
      onAddToCart={addToCart}
    />
  );
}
\`\`\`

\`\`\`tsx
// src/screens/catalog/CatalogScreenUI.tsx — UI
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { ProductCard } from '@components/shared/ProductCard';
import { Product } from '@app-types/product';

interface Props {
  products: Product[];
  isLoading: boolean;
  onAddToCart: (product: Product) => void;
}

export function CatalogScreenUI({ products, isLoading, onAddToCart }: Props) {
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <FlatList
      data={products}
      className="flex-1 bg-background"
      contentContainerClassName="p-4"
      renderItem={({ item }) => (
        <ProductCard product={item} onPress={() => onAddToCart(item)} />
      )}
      keyExtractor={(item) => item.id}
    />
  );
}
\`\`\`

## 5.3 Групи маршрутів

Expo Router підтримує групи через \`(назва)/\`:
- \`(auth)\` — екрани авторизації (Stack)
- \`(tabs)\` — основний додаток (Bottom Tabs)
- Дужки \`()\` означають що назва групи НЕ є частиною URL

✅ **Checkpoint**: Feature-based структура створена, Logic/UI separation зрозумілий
`;
  }

  return `# Крок 5 — Структура проекту (React Navigation)

## 5.1 Feature-based структура

\`\`\`
my-app/
├── src/
│   ├── navigation/               # Навігатори
│   │   ├── AppNavigator.tsx      # Root navigator (auth check)
│   │   ├── AuthNavigator.tsx     # Stack: Login, Register
│   │   ├── MainNavigator.tsx     # Bottom Tabs
│   │   └── types.ts              # Navigation type definitions
│   │
│   ├── screens/                  # Екрани (Container + UI)
│   │   ├── auth/
│   │   │   ├── LoginScreen.tsx       # Container (логіка)
│   │   │   ├── LoginScreenUI.tsx     # UI (чистий)
│   │   │   ├── RegisterScreen.tsx
│   │   │   └── RegisterScreenUI.tsx
│   │   ├── home/
│   │   │   ├── HomeScreen.tsx
│   │   │   └── HomeScreenUI.tsx
│   │   ├── catalog/
│   │   │   ├── CatalogScreen.tsx
│   │   │   └── CatalogScreenUI.tsx
│   │   └── product/
│   │       ├── ProductScreen.tsx
│   │       └── ProductScreenUI.tsx
│   │
│   ├── components/               # Shared UI-компоненти
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Card.tsx
│   │   ├── layout/
│   │   │   └── Container.tsx
│   │   └── shared/
│   │       └── ProductCard.tsx
│   │
│   ├── store/                    # Zustand stores
│   │   ├── auth.ts
│   │   ├── cart.ts
│   │   └── index.ts
│   │
│   ├── services/
│   │   ├── api/
│   │   │   ├── client.ts
│   │   │   ├── auth.ts
│   │   │   └── products.ts
│   │   └── storage/
│   │       └── mmkv.ts
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   └── useProducts.ts
│   │
│   ├── constants/
│   │   ├── colors.ts
│   │   └── config.ts
│   │
│   ├── types/
│   │   ├── auth.ts
│   │   └── product.ts
│   │
│   └── utils/
│       ├── validation.ts
│       └── formatting.ts
│
├── assets/
│   ├── images/
│   └── fonts/
│
├── App.tsx                       # Entry point з NavigationContainer
├── app.json
├── babel.config.js
├── metro.config.js
├── tailwind.config.js
├── global.css
├── tsconfig.json
└── package.json
\`\`\`

## 5.2 Принцип Logic/UI Separation (Container Pattern)

**Container** (\`*Screen.tsx\`) — логіка:
- Hooks, store, navigation
- Data fetching, event handlers

**UI** (\`*ScreenUI.tsx\`) — чистий UI:
- Props-driven, легко тестувати

Приклад:

\`\`\`tsx
// src/screens/catalog/CatalogScreen.tsx — CONTAINER
import { CatalogScreenUI } from './CatalogScreenUI';
import { useProducts } from '@hooks/useProducts';
import { useCartStore } from '@store/cart';

export function CatalogScreen() {
  const { data: products, isLoading } = useProducts();
  const addToCart = useCartStore((s) => s.addItem);

  return (
    <CatalogScreenUI
      products={products ?? []}
      isLoading={isLoading}
      onAddToCart={addToCart}
    />
  );
}
\`\`\`

\`\`\`tsx
// src/screens/catalog/CatalogScreenUI.tsx — UI
import { View, FlatList, ActivityIndicator } from 'react-native';
import { ProductCard } from '@components/shared/ProductCard';
import { Product } from '@app-types/product';

interface Props {
  products: Product[];
  isLoading: boolean;
  onAddToCart: (product: Product) => void;
}

export function CatalogScreenUI({ products, isLoading, onAddToCart }: Props) {
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <FlatList
      data={products}
      className="flex-1 bg-background"
      contentContainerClassName="p-4"
      renderItem={({ item }) => (
        <ProductCard product={item} onPress={() => onAddToCart(item)} />
      )}
      keyExtractor={(item) => item.id}
    />
  );
}
\`\`\`

## 5.3 Навігатори

\`\`\`tsx
// src/navigation/AppNavigator.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '@store/auth';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';

const Stack = createNativeStackNavigator();

export function AppNavigator() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name="Main" component={MainNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
}
\`\`\`

✅ **Checkpoint**: Feature-based структура створена, Container/UI pattern зрозумілий
`;
}
