export function getStateManagement(): string {
  return `# Best Practice: State Management

## Zustand — Ефективне використання

### Селектори (обов'язково!)

\`\`\`tsx
// ✅ Добре — підписка на конкретне поле
const count = useCartStore((s) => s.items.length);
const total = useCartStore((s) => s.total);

// ❌ Погано — підписка на ВСЕ (ререндер при будь-якій зміні)
const store = useCartStore();
const { items, total } = useCartStore();
\`\`\`

### useShallow для множинних значень

\`\`\`tsx
import { useShallow } from 'zustand/shallow';

// ✅ Підписка на декілька полів з shallow comparison
const { user, isAuthenticated } = useAuthStore(
  useShallow((s) => ({
    user: s.user,
    isAuthenticated: s.isAuthenticated,
  }))
);
\`\`\`

### Доступ до store поза React

\`\`\`tsx
// В API interceptors, утилітах, etc.
const token = useAuthStore.getState().token;
useAuthStore.getState().logout();
\`\`\`

### Derived state (computed values)

Zustand не підтримує JS getters в store. Використовуйте **селектори** для computed values:

\`\`\`tsx
// ✅ Правильно — computed через селектори
const useCartStore = create<CartState>()((set) => ({
  items: [],
  addItem: (item) => set((s) => ({ items: [...s.items, item] })),
  removeItem: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
}));

// Computed селектори — визначайте окремо
const selectTotal = (s: CartState) =>
  s.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

const selectItemCount = (s: CartState) =>
  s.items.reduce((sum, i) => sum + i.quantity, 0);

// Використання в компонентах
const total = useCartStore(selectTotal);
const count = useCartStore(selectItemCount);
\`\`\`

## Persist з MMKV

\`\`\`tsx
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage } from '@services/storage/mmkv';

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'system' as 'light' | 'dark' | 'system',
      language: 'uk' as 'uk' | 'en',
      notifications: true,

      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      toggleNotifications: () => set((s) => ({ notifications: !s.notifications })),
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
\`\`\`

## TanStack Query — Server State

Розділяйте client state (Zustand) і server state (TanStack Query):

| | Client State (Zustand) | Server State (TanStack Query) |
|---|---|---|
| Що | UI стан, settings, cart | Дані з API |
| Persist | MMKV | Query cache |
| Invalidation | Manual | Auto (staleTime, refetch) |
| Приклади | auth, theme, cart | products, orders, user profile |

### Query Keys Convention

\`\`\`tsx
// Ієрархічні ключі для invalidation
const queryKeys = {
  products: {
    all: ['products'] as const,
    lists: () => [...queryKeys.products.all, 'list'] as const,
    list: (filters: Filters) => [...queryKeys.products.lists(), filters] as const,
    details: () => [...queryKeys.products.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.products.details(), id] as const,
  },
};

// Використання
useQuery({
  queryKey: queryKeys.products.detail(id),
  queryFn: () => productsApi.getById(id),
});

// Invalidation — інвалідує ВСЕ що починається з ['products']
queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
\`\`\`

### Mutations

\`\`\`tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartApi.addItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}
\`\`\`

## Що де зберігати

| Дані | Де | Чому |
|---|---|---|
| Auth token | Zustand + MMKV persist | Потрібен offline, між сесіями |
| User profile | TanStack Query | Серверні дані, кешування |
| Cart items | Zustand (+ optional persist) | Client state, швидкий доступ |
| Product list | TanStack Query | Серверні дані, auto refetch |
| Theme/Language | Zustand + MMKV persist | User preference |
| Form state | React Hook Form (local) | Тимчасовий, form-specific |
`;
}
