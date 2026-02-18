export function getNavigationPatterns(): string {
  return `# Navigation Patterns (Expo Router)

## File-based Routing

Expo Router uses file-based routing (like Next.js). Files in \`app/\` automatically become routes.

### app/ Folder Structure

\`\`\`
app/
  _layout.tsx              # Root layout (providers, auth guard)
  index.tsx                # Home page (/)
  +not-found.tsx           # 404 page

  (tabs)/                  # Tab navigation group
    _layout.tsx            # Tab navigator config
    index.tsx              # Home tab
    catalog.tsx            # Catalog tab
    profile.tsx            # Profile tab

  (auth)/                  # Auth stack group
    _layout.tsx            # Auth stack config
    login.tsx              # Login screen
    register.tsx           # Register screen

  product/
    [id].tsx               # Dynamic route (/product/123)

  settings/
    index.tsx              # Settings main
    notifications.tsx      # Settings > Notifications
\`\`\`

## Layouts (_layout.tsx)

### Root Layout — providers and auth guard

\`\`\`tsx
// app/_layout.tsx
import { Stack } from 'expo-router';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import '../global.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 2, staleTime: 30_000 },
  },
});

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </QueryClientProvider>
  );
}
\`\`\`

### Tab Layout

\`\`\`tsx
// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: true }}>
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
    </Tabs>
  );
}
\`\`\`

## AuthGuard Pattern

Protect routes from unauthenticated users via _layout.tsx.

\`\`\`tsx
// app/_layout.tsx
import { Stack, useRouter, useSegments, useNavigationContainerRef } from 'expo-router';
import { useAuthStore } from '@/store/auth';
import { useEffect, useState } from 'react';

function useProtectedRoute(isAuthenticated: boolean) {
  const segments = useSegments();
  const router = useRouter();
  const navigationRef = useNavigationContainerRef();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (navigationRef?.isReady()) {
      setIsReady(true);
    }
  }, [navigationRef?.isReady()]);

  useEffect(() => {
    if (!isReady) return;

    const inAuthGroup = segments[0] === '(auth)';
    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, segments, isReady]);
}

export default function RootLayout() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  useProtectedRoute(isAuthenticated);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
\`\`\`

**IMPORTANT**: Always wait for \`navigationRef.isReady()\` before navigating — otherwise you'll get a race condition.

## Typed Route Params

\`\`\`tsx
// Dynamic route with typed parameters
import { useLocalSearchParams } from 'expo-router';

type ProductParams = {
  id: string;
};

export default function ProductRoute() {
  const { id } = useLocalSearchParams<ProductParams>();
  // id: string (typed!)

  const { data: product } = useProduct(id);

  return <ProductScreenUI product={product} />;
}
\`\`\`

## Navigation API

\`\`\`tsx
import { router } from 'expo-router';

// Push (adds to stack)
router.push('/product/123');

// Replace (replaces current screen)
router.replace('/(tabs)');

// Back
router.back();

// With params
router.push({
  pathname: '/product/[id]',
  params: { id: '123' },
});
\`\`\`

## Deep Linking

Deep links work automatically with Expo Router. File structure = URL schema:
- \`app/(tabs)/index.tsx\` → \`myapp:///(tabs)\`
- \`app/product/[id].tsx\` → \`myapp:///product/123\`
- \`app/(auth)/login.tsx\` → \`myapp:///(auth)/login\`

No additional configuration needed — Expo Router generates deep links from the file structure.

## Groups (Parentheses)

Groups \`(tabs)\`, \`(auth)\` are layout groups. They do NOT appear in the URL:
- \`app/(tabs)/catalog.tsx\` → URL \`/catalog\` (not \`/(tabs)/catalog\`)
- \`app/(auth)/login.tsx\` → URL \`/login\`

Use groups for:
- Different navigators (tabs, stack, drawer)
- Logical separation (auth vs main)
- Different layouts for different parts of the app
`;
}
