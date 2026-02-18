export function getStatePatterns(): string {
  return `# State Management Patterns (Zustand + MMKV)

## Why Zustand

- Simpler than Redux (minimal boilerplate)
- TypeScript-friendly out of the box
- Hooks as primary API
- DevTools support
- Middleware: persist, immer, devtools
- Atomic approach — each store owns its slice of state

## Why MMKV for Persistence

- Fastest storage for React Native (~30x faster than AsyncStorage)
- Synchronous API (no async/await needed)
- Supports all types: string, number, boolean, object

**IMPORTANT**: react-native-mmkv is a native module — it does NOT work in Expo Go. Requires \`expo prebuild\` or EAS Build.

## MMKV Storage Adapter

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

**IMPORTANT**: Lazy init via getter function prevents a crash on startup (MMKV initializes before the native module is ready).

## Zustand Store Pattern

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
\`\`\`

## RULE: Always Use Selectors

\`\`\`tsx
// GOOD — re-renders only when user changes
const user = useAuthStore((s) => s.user);
const logout = useAuthStore((s) => s.logout);

// BAD — re-renders on ANY change in the store
const { user, logout } = useAuthStore();
\`\`\`

## useShallow for Multiple Values

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
\`\`\`

## Accessing Store Outside React Components

For interceptors, services, utilities — use \`getState()\`:

\`\`\`tsx
// In an API interceptor
const token = useAuthStore.getState().token;

// Call an action
useAuthStore.getState().logout();
\`\`\`

## Store Organization Rules

1. **One store = one domain**: \`useAuthStore\`, \`useCartStore\`, \`useAppStore\`
2. **Client state → Zustand**: auth tokens, cart, UI preferences, settings
3. **Server state → TanStack Query**: products, orders, user profile (caching, refetch)
4. **Do NOT store server data in Zustand** — that's what TanStack Query is for
5. **Persist only what's needed**: auth token, user preferences. Do NOT persist server data

## Atomic State

Zustand supports an atomic approach — each store is independent. A change in one store does not cause re-renders in components subscribed to another store.

\`\`\`tsx
// Separate stores — independent re-renders
const user = useAuthStore((s) => s.user);       // re-renders only when user changes
const cartCount = useCartStore((s) => s.count);  // re-renders only when count changes
\`\`\`

For fine-grained reactivity at the atom level, consider **Jotai** — each atom causes re-renders only in components that subscribe to it directly.
`;
}
