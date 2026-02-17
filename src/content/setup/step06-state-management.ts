export function getStep06(): string {
  return `# Крок 6 — State Management (Zustand + MMKV)

## 6.1 Чому Zustand + MMKV?

- **Zustand** — мінімалістичний state manager (2KB), без boilerplate
- **MMKV** — швидке key-value сховище (в 30x швидше за AsyncStorage)
- **Zustand persist + MMKV** — стан зберігається між сесіями

## 6.2 Встановлення

\`\`\`bash
npx expo install zustand react-native-mmkv
\`\`\`

## 6.3 MMKV Storage

\`\`\`tsx
// src/services/storage/mmkv.ts
import { MMKV } from 'react-native-mmkv';
import { StateStorage } from 'zustand/middleware';

export const storage = new MMKV();

// Адаптер для Zustand persist
export const zustandStorage: StateStorage = {
  getItem: (name: string) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  setItem: (name: string, value: string) => {
    storage.set(name, value);
  },
  removeItem: (name: string) => {
    storage.delete(name);
  },
};
\`\`\`

## 6.4 Auth Store з persist

\`\`\`tsx
// src/store/auth.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage } from '@services/storage/mmkv';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;

  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user, token) =>
        set({ user, token, isAuthenticated: true }),

      logout: () =>
        set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
\`\`\`

## 6.5 Cart Store (без persist)

\`\`\`tsx
// src/store/cart.ts
import { create } from 'zustand';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;

  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()((set, get) => ({
  items: [],
  total: 0,

  addItem: (item) =>
    set((state) => {
      const existing = state.items.find((i) => i.id === item.id);
      if (existing) {
        const items = state.items.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
        return { items, total: calcTotal(items) };
      }
      const items = [...state.items, { ...item, quantity: 1 }];
      return { items, total: calcTotal(items) };
    }),

  removeItem: (id) =>
    set((state) => {
      const items = state.items.filter((i) => i.id !== id);
      return { items, total: calcTotal(items) };
    }),

  updateQuantity: (id, quantity) =>
    set((state) => {
      if (quantity <= 0) {
        const items = state.items.filter((i) => i.id !== id);
        return { items, total: calcTotal(items) };
      }
      const items = state.items.map((i) =>
        i.id === id ? { ...i, quantity } : i
      );
      return { items, total: calcTotal(items) };
    }),

  clearCart: () => set({ items: [], total: 0 }),
}));

function calcTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}
\`\`\`

## 6.6 Використання в компонентах

\`\`\`tsx
// Ефективна підписка — компонент ререндериться тільки коли змінюється count
import { useCartStore } from '@store/cart';

function CartBadge() {
  const count = useCartStore((s) => s.items.length);
  return <Text>{count}</Text>;
}
\`\`\`

**Важливо**: Використовуйте селектори для підписки тільки на потрібні поля:

\`\`\`tsx
// ✅ Добре — ререндер тільки коли змінюється user
const user = useAuthStore((s) => s.user);

// ❌ Погано — ререндер при БУДЬ-ЯКІЙ зміні store
const { user } = useAuthStore();
\`\`\`

Для множинних значень використовуйте \`useShallow\`:

\`\`\`tsx
import { useShallow } from 'zustand/react/shallow';

const { user, isAuthenticated } = useAuthStore(
  useShallow((s) => ({ user: s.user, isAuthenticated: s.isAuthenticated }))
);
\`\`\`

## 6.7 Store index

\`\`\`tsx
// src/store/index.ts
export { useAuthStore } from './auth';
export { useCartStore } from './cart';
\`\`\`

✅ **Checkpoint**: Zustand + MMKV налаштовані, Auth store з persist працює
`;
}
