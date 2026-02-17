import { Router } from "../../utils/format.js";

export function getArchitecture(router?: Router): string {
  const routerSpecific = router === "expo-router"
    ? `
## Expo Router: Logic/UI Separation

У Expo Router route файли (\`app/\`) виконують роль контейнерів:

\`\`\`
app/(tabs)/catalog.tsx    ← ЛОГІКА (route = container)
src/screens/catalog/      ← UI (чистий, props-driven)
  └── CatalogScreenUI.tsx
\`\`\`

\`\`\`tsx
// app/(tabs)/catalog.tsx — Route = Container
import { CatalogScreenUI } from '@screens/catalog/CatalogScreenUI';
import { useProducts } from '@hooks/useProducts';
import { useCartStore } from '@store/cart';
import { router } from 'expo-router';

export default function CatalogRoute() {
  const { data: products, isLoading, refetch } = useProducts();
  const addToCart = useCartStore((s) => s.addItem);

  const handleProductPress = (id: string) => {
    router.push(\`/product/\${id}\`);
  };

  return (
    <CatalogScreenUI
      products={products ?? []}
      isLoading={isLoading}
      onRefresh={refetch}
      onProductPress={handleProductPress}
      onAddToCart={addToCart}
    />
  );
}
\`\`\`
`
    : router === "react-navigation"
    ? `
## React Navigation: Container/UI Pattern

\`\`\`
src/screens/catalog/
  ├── CatalogScreen.tsx      ← CONTAINER (логіка)
  └── CatalogScreenUI.tsx    ← UI (чистий, props-driven)
\`\`\`

\`\`\`tsx
// src/screens/catalog/CatalogScreen.tsx — Container
import { CatalogScreenUI } from './CatalogScreenUI';
import { useProducts } from '@hooks/useProducts';
import { useCartStore } from '@store/cart';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function CatalogScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { data: products, isLoading, refetch } = useProducts();
  const addToCart = useCartStore((s) => s.addItem);

  const handleProductPress = (id: string) => {
    navigation.navigate('Product', { id });
  };

  return (
    <CatalogScreenUI
      products={products ?? []}
      isLoading={isLoading}
      onRefresh={refetch}
      onProductPress={handleProductPress}
      onAddToCart={addToCart}
    />
  );
}
\`\`\`
`
    : `
## Logic/UI Separation (обидва роутери)

Обидва підходи використовують однаковий принцип розділення:

**Expo Router**: route файл (\`app/\`) = container
**React Navigation**: \`*Screen.tsx\` = container, \`*ScreenUI.tsx\` = UI

Логіка і UI завжди розділені.
`;

  return `# Best Practice: Архітектура

## SOLID Принципи в React Native

### S — Single Responsibility
Кожен компонент/модуль має одну відповідальність:
- \`Button.tsx\` — тільки UI кнопки
- \`useAuth.ts\` — тільки логіка авторизації
- \`api/products.ts\` — тільки API виклики для продуктів

### O — Open/Closed
Компоненти відкриті для розширення, закриті для модифікації:

\`\`\`tsx
// ✅ Добре — розширюємо через props
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onPress: () => void;
}
\`\`\`

### L — Liskov Substitution
Підтипи можуть замінити батьківські типи:

\`\`\`tsx
// ProductCard і FeaturedProductCard мають однаковий інтерфейс
<ProductList renderItem={(p) => <ProductCard product={p} />} />
<ProductList renderItem={(p) => <FeaturedProductCard product={p} />} />
\`\`\`

### I — Interface Segregation
Не змушуйте компоненти залежати від того, що вони не використовують:

\`\`\`tsx
// ❌ Погано — UI знає про весь store
interface Props {
  store: CartStore;
}

// ✅ Добре — UI знає тільки про потрібні дані
interface Props {
  items: CartItem[];
  total: number;
  onRemove: (id: string) => void;
}
\`\`\`

### D — Dependency Inversion
Компоненти залежать від абстракцій, не від деталей:

\`\`\`tsx
// UI компонент не знає звідки дані — він просто показує
function ProductListUI({ products, onRefresh }: Props) { ... }

// Container вирішує звідки дані
function ProductListContainer() {
  const { data } = useProducts(); // TanStack Query
  return <ProductListUI products={data ?? []} />;
}
\`\`\`

## Feature-based структура

Організовуйте код за фічами, не за типами:

\`\`\`
// ✅ Feature-based
src/
  features/
    auth/
      screens/
      hooks/
      store/
      api/
    catalog/
      screens/
      hooks/
      api/

// ❌ Type-based
src/
  screens/
    LoginScreen.tsx
    CatalogScreen.tsx
  hooks/
    useAuth.ts
    useProducts.ts
\`\`\`

> **Примітка**: Для невеликих проектів (< 10 екранів) type-based структура цілком прийнятна. Feature-based стає вигідною при зростанні.

${routerSpecific}

## UI компонент — однаковий для обох роутерів!

\`\`\`tsx
// src/screens/catalog/CatalogScreenUI.tsx
// Цей файл ІДЕНТИЧНИЙ для Expo Router та React Navigation
import { View, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { ProductCard } from '@components/shared/ProductCard';
import { Product } from '@types/product';

interface Props {
  products: Product[];
  isLoading: boolean;
  onRefresh: () => void;
  onProductPress: (id: string) => void;
  onAddToCart: (product: Product) => void;
}

export function CatalogScreenUI({
  products,
  isLoading,
  onRefresh,
  onProductPress,
  onAddToCart,
}: Props) {
  if (isLoading && products.length === 0) {
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
      contentContainerClassName="p-4 gap-3"
      renderItem={({ item }) => (
        <ProductCard
          product={item}
          onPress={() => onProductPress(item.id)}
          onAddToCart={() => onAddToCart(item)}
        />
      )}
      keyExtractor={(item) => item.id}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
      }
    />
  );
}
\`\`\`

**Ключовий принцип**: UI компоненти НЕ залежать від навігації. Вони отримують дані та callbacks через props.
`;
}
