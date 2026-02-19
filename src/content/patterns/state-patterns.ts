import { PatternSections, resolvePattern } from './pattern-helper';

// ─── Full sections (with code examples) ─────────────────────────────

const sections: Record<string, string> = {
  zustand: `## Why Zustand

- Simpler than Redux (minimal boilerplate)
- TypeScript-friendly out of the box
- Hooks as primary API
- DevTools support
- Middleware: persist, immer, devtools
- Atomic approach — each store owns its slice of state`,

  mmkv: `## Why MMKV for Persistence

- Fastest storage for React Native (~30x faster than AsyncStorage)
- Synchronous API (no async/await needed)
- Supports all types: string, number, boolean, object

**IMPORTANT**: react-native-mmkv is a native module — it does NOT work in Expo Go. Requires \`expo prebuild\` or EAS Build.`,

  'mmkv-adapter': `## MMKV Storage Adapter

\`\`\`tsx
// src/services/storage/mmkv.ts
import { MMKV } from 'react-native-mmkv';
import { StateStorage } from 'zustand/middleware';

let _storage: MMKV | null = null;

function getStorage(): MMKV {
  if (!_storage) {
    _storage = new MMKV();
  }
  return _storage;
}

export const zustandStorage: StateStorage = {
  getItem: (name: string) => {
    const value = getStorage().getString(name);
    return value ?? null;
  },
  setItem: (name: string, value: string) => {
    getStorage().set(name, value);
  },
  removeItem: (name: string) => {
    getStorage().delete(name);
  },
};
\`\`\`

**IMPORTANT**: Lazy init via getter function prevents a crash on startup (MMKV initializes before the native module is ready).`,

  'store-pattern': `## Zustand Store Pattern

\`\`\`tsx
// src/store/auth.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage } from '@/services/storage/mmkv';

type User = {
  id: string;
  name: string;
  email: string;
};

type AuthState = {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      login: (token, user) =>
        set({ token, user, isAuthenticated: true }),

      logout: () =>
        set({ token: null, user: null, isAuthenticated: false }),

      updateUser: (userData) =>
        set({ user: { ...get().user!, ...userData } }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
\`\`\``,

  selectors: `## RULE: Always Use Selectors

\`\`\`tsx
// GOOD — re-renders only when user changes
const user = useAuthStore((s) => s.user);
const logout = useAuthStore((s) => s.logout);

// BAD — re-renders on ANY change in the store
const { user, logout } = useAuthStore();
\`\`\``,

  'use-shallow': `## useShallow for Multiple Values

When you need multiple values from a store — use \`useShallow\`:

\`\`\`tsx
import { useShallow } from 'zustand/react/shallow';

// GOOD — shallow compare, re-renders only when token or user changes
const { token, user } = useAuthStore(
  useShallow((s) => ({ token: s.token, user: s.user }))
);

// Alternative with array
const [token, user] = useAuthStore(
  useShallow((s) => [s.token, s.user])
);
\`\`\``,

  'get-state': `## Accessing Store Outside React Components

For interceptors, services, utilities — use \`getState()\`:

\`\`\`tsx
// In an API interceptor
const token = useAuthStore.getState().token;

// Call an action
useAuthStore.getState().logout();
\`\`\``,

  organization: `## Store Organization Rules

1. **One store = one domain**: \`useAuthStore\`, \`useCartStore\`, \`useAppStore\`
2. **Client state → Zustand**: auth tokens, cart, UI preferences, settings
3. **Server state → TanStack Query**: products, orders, user profile (caching, refetch)
4. **Do NOT store server data in Zustand** — that's what TanStack Query is for
5. **Persist only what's needed**: auth token, user preferences. Do NOT persist server data

Zustand supports an atomic approach — each store is independent. A change in one store does not cause re-renders in components subscribed to another store.

\`\`\`tsx
// Separate stores — independent re-renders
const user = useAuthStore((s) => s.user);       // re-renders only when user changes
const cartCount = useCartStore((s) => s.count);  // re-renders only when count changes
\`\`\`

For fine-grained reactivity at the atom level, consider **Jotai** — each atom causes re-renders only in components that subscribe to it directly.`,
};

// ─── Compact sections (rules only, no code) ─────────────────────────

const compactSections: Record<string, string> = {
  zustand: `## Why Zustand
- Minimal boilerplate, TypeScript-friendly, hooks-based API
- Middleware: persist, immer, devtools
- Each store is atomic and independent`,

  mmkv: `## Why MMKV
- ~30x faster than AsyncStorage, synchronous API
- Native module — does NOT work in Expo Go (needs \`expo prebuild\` or EAS Build)`,

  'mmkv-adapter': `## MMKV Adapter
- Create \`src/services/storage/mmkv.ts\` with \`zustandStorage: StateStorage\`
- Use lazy init (getter function) to prevent native crash on startup
- Implements: \`getItem\`, \`setItem\`, \`removeItem\``,

  'store-pattern': `## Store Pattern
- \`create<StateType>()(persist((set, get) => ({ ...state, ...actions }), { name, storage }))\`
- Type combines state fields + action functions in one interface
- Use \`createJSONStorage(() => zustandStorage)\` for MMKV persistence`,

  selectors: `## Selectors
- ALWAYS use selectors: \`useStore((s) => s.field)\`
- NEVER destructure entire store: \`const { a, b } = useStore()\` causes re-renders on ANY change`,

  'use-shallow': `## useShallow
- For multiple values: \`useShallow((s) => ({ a: s.a, b: s.b }))\`
- Import from \`zustand/react/shallow\`
- Alternative: array form \`useShallow((s) => [s.a, s.b])\``,

  'get-state': `## getState()
- Outside React: \`useAuthStore.getState().token\`
- For API interceptors, services, utilities
- Can also call actions: \`useAuthStore.getState().logout()\``,

  organization: `## Organization
- One store = one domain (\`useAuthStore\`, \`useCartStore\`)
- Client state → Zustand (auth, cart, preferences)
- Server state → TanStack Query (products, orders, profiles)
- Do NOT store server data in Zustand
- Persist only: auth tokens, user preferences`,
};

// ─── Export ──────────────────────────────────────────────────────────

const pattern: PatternSections = {
  title: 'State Management Patterns (Zustand + MMKV)',
  sections,
  compactSections,
};

export const getStatePatterns = (topic?: string, compact?: boolean): string =>
  resolvePattern(pattern, topic, compact);
