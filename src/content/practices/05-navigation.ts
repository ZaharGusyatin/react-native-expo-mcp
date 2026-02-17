import { Router } from "../../utils/format.js";

export function getNavigation(router?: Router): string {
  const expoRouterSection = `
## Expo Router — Типізація

### Typed Routes

\`\`\`tsx
// app/(tabs)/product/[id].tsx
import { useLocalSearchParams } from 'expo-router';

interface ProductParams {
  id: string;
}

export default function ProductRoute() {
  const { id } = useLocalSearchParams<ProductParams>();
  // id is typed as string
  return <ProductScreenUI productId={id} />;
}
\`\`\`

### Typed Navigation

\`\`\`tsx
import { router } from 'expo-router';

// Type-safe навігація
router.push('/catalog');
router.push(\`/product/\${id}\`);
router.replace('/(auth)/login');
router.back();
\`\`\`

### Layouts

\`\`\`tsx
// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="catalog"
        options={{
          title: 'Catalog',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart" color={color} size={size} />
          ),
          tabBarBadge: 3, // Динамічний badge
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
\`\`\`

### Protected Routes

\`\`\`tsx
// app/_layout.tsx
import { Stack, useRouter, useSegments } from 'expo-router';
import { useAuthStore } from '@store/auth';
import { useEffect } from 'react';

export default function RootLayout() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
\`\`\`

### Deep Linking

Deep linking працює автоматично в Expo Router — кожен файл = URL.
\`app/product/[id].tsx\` → \`myapp://product/123\`

Конфігурація в \`app.json\`:
\`\`\`json
{
  "expo": {
    "scheme": "myapp"
  }
}
\`\`\`
`;

  const reactNavigationSection = `
## React Navigation — Типізація

### ParamList

\`\`\`tsx
// src/navigation/types.ts
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Product: { id: string };
  OrderDetails: { orderId: string };
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: { email?: string };
};

export type MainTabParamList = {
  Home: undefined;
  Catalog: undefined;
  Cart: undefined;
  Profile: undefined;
};

// Глобальна декларація для useNavigation
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
\`\`\`

### Typed Screen Props

\`\`\`tsx
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Product'>;

export function ProductScreen({ route, navigation }: Props) {
  const { id } = route.params;

  return <ProductScreenUI productId={id} />;
}
\`\`\`

### Typed Navigation Hook

\`\`\`tsx
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';

type ProductNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Product'>;
type ProductRouteProp = RouteProp<RootStackParamList, 'Product'>;

function ProductScreen() {
  const navigation = useNavigation<ProductNavigationProp>();
  const route = useRoute<ProductRouteProp>();

  const { id } = route.params;

  navigation.navigate('OrderDetails', { orderId: '456' }); // Type-safe!
}
\`\`\`

### Navigators

\`\`\`tsx
// src/navigation/MainNavigator.tsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import type { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Catalog"
        component={CatalogScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart" color={color} size={size} />
          ),
          tabBarBadge: 3,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
\`\`\`

### Auth Flow

\`\`\`tsx
// src/navigation/AppNavigator.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '@store/auth';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <>
          <Stack.Screen name="Main" component={MainNavigator} />
          <Stack.Screen name="Product" component={ProductScreen} />
          <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
        </>
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
}
\`\`\`

### Deep Linking

\`\`\`tsx
// src/navigation/linking.ts
import { LinkingOptions } from '@react-navigation/native';
import type { RootStackParamList } from './types';

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['myapp://', 'https://myapp.com'],
  config: {
    screens: {
      Main: {
        screens: {
          Home: '',
          Catalog: 'catalog',
          Cart: 'cart',
          Profile: 'profile',
        },
      },
      Product: 'product/:id',
      Auth: {
        screens: {
          Login: 'login',
          Register: 'register',
        },
      },
    },
  },
};

// App.tsx
<NavigationContainer linking={linking}>
  <AppNavigator />
</NavigationContainer>
\`\`\`
`;

  let content = `# Best Practice: Навігація

## Загальні принципи

1. **Типізація** — завжди типізуйте params та navigation props
2. **Auth flow** — conditional rendering navigators (не redirect)
3. **Deep linking** — налаштуйте URL scheme
4. **Screen options** — визначайте в navigator, не в screen

`;

  if (router === "expo-router") {
    content += expoRouterSection;
  } else if (router === "react-navigation") {
    content += reactNavigationSection;
  } else {
    content += expoRouterSection + "\n\n---\n\n" + reactNavigationSection;
  }

  return content;
}
