import { PatternSections, resolvePattern } from './pattern-helper';

// ─── Full sections (with code examples) ─────────────────────────────

const sections: Record<string, string> = {
  'file-routing': `## File-based Routing

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
\`\`\``,

  layouts: `## Layouts (_layout.tsx)

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
\`\`\``,

  'auth-guard': `## AuthGuard Pattern

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

**IMPORTANT**: Always wait for \`navigationRef.isReady()\` before navigating — otherwise you'll get a race condition.`,

  'typed-params': `## Typed Route Params

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
\`\`\``,

  'navigation-api': `## Navigation API

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
\`\`\``,

  'deep-linking': `## Deep Linking

Deep links work automatically with Expo Router. File structure = URL schema:
- \`app/(tabs)/index.tsx\` → \`myapp:///(tabs)\`
- \`app/product/[id].tsx\` → \`myapp:///product/123\`
- \`app/(auth)/login.tsx\` → \`myapp:///(auth)/login\`

No additional configuration needed — Expo Router generates deep links from the file structure.`,

  groups: `## Groups (Parentheses)

Groups \`(tabs)\`, \`(auth)\` are layout groups. They do NOT appear in the URL:
- \`app/(tabs)/catalog.tsx\` → URL \`/catalog\` (not \`/(tabs)/catalog\`)
- \`app/(auth)/login.tsx\` → URL \`/login\`

Use groups for:
- Different navigators (tabs, stack, drawer)
- Logical separation (auth vs main)
- Different layouts for different parts of the app`,
};

// ─── Compact sections (rules only, no code) ─────────────────────────

const compactSections: Record<string, string> = {
  'file-routing': `## File-based Routing
- Files in \`app/\` automatically become routes (like Next.js)
- \`_layout.tsx\` = layout wrapper, \`index.tsx\` = default route
- \`[id].tsx\` = dynamic route, \`+not-found.tsx\` = 404
- Group folders: \`(tabs)/\`, \`(auth)/\` for different navigators`,

  layouts: `## Layouts
- Root layout (\`app/_layout.tsx\`): providers (QueryClient), auth guard, Stack navigator
- Tab layout (\`app/(tabs)/_layout.tsx\`): Tabs navigator with icons
- Import \`../global.css\` in root layout for NativeWind`,

  'auth-guard': `## AuthGuard
- Implement in root \`_layout.tsx\` via \`useProtectedRoute\` hook
- Wait for \`navigationRef.isReady()\` before navigating (prevents race condition)
- Check \`useSegments()[0]\` to detect current group
- Redirect: unauthenticated → \`/(auth)/login\`, authenticated in auth group → \`/(tabs)\``,

  'typed-params': `## Typed Params
- \`useLocalSearchParams<{ id: string }>()\` for type-safe URL params
- Define a type for each dynamic route's params`,

  'navigation-api': `## Navigation API
- \`router.push('/path')\` — adds to stack
- \`router.replace('/path')\` — replaces current screen
- \`router.back()\` — go back
- With params: \`router.push({ pathname: '/product/[id]', params: { id } })\``,

  'deep-linking': `## Deep Linking
- Automatic with Expo Router — file structure = URL schema
- No additional configuration needed`,

  groups: `## Groups
- Parenthesized folders \`(tabs)\`, \`(auth)\` don't appear in URL
- Use for: different navigators, logical separation, different layouts`,
};

// ─── Export ──────────────────────────────────────────────────────────

const pattern: PatternSections = {
  title: 'Navigation Patterns (Expo Router)',
  sections,
  compactSections,
};

export const getNavigationPatterns = (topic?: string, compact?: boolean): string =>
  resolvePattern(pattern, topic, compact);
