import { PatternSections, resolvePattern } from './pattern-helper';

// ─── Full sections (with code examples) ─────────────────────────────

const sections: Record<string, string> = {
  'strict-config': `## Strict Mode Configuration

Enable strict mode in tsconfig.json:
\`\`\`json
"strict": true,
"noUncheckedIndexedAccess": true
\`\`\`

> For full tsconfig.json with path aliases, see \`get-project-structure\` (topic: import-aliases).`,

  'route-params': `## Route Param Typing

Use generics with \`useLocalSearchParams\` for type-safe URL params:

\`\`\`tsx
// app/product/[id].tsx
import { useLocalSearchParams } from 'expo-router';

type ProductParams = {
  id: string;
  category?: string;
};

export default function ProductRoute() {
  const { id, category } = useLocalSearchParams<ProductParams>();
  // id: string, category: string | undefined

  const { data } = useProduct(id);
  return <ProductScreenUI product={data} category={category} />;
}
\`\`\``,

  'api-types': `## API Response Types

\`\`\`tsx
// src/types/api.ts
type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
};

type ApiResponse<T> = {
  data: T;
  message?: string;
};

// Usage
type ProductListResponse = PaginatedResponse<Product>;
type LoginApiResponse = ApiResponse<{ token: string; user: User }>;
\`\`\``,

  'model-types': `## Model Types

\`\`\`tsx
// src/types/auth.ts
export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type AuthResponse = {
  token: string;
  user: User;
};

// src/types/product.ts
export type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  inStock: boolean;
};
\`\`\``,

  'props-naming': `## Props Interface Naming

Always name props interfaces \`ComponentNameProps\`:

\`\`\`tsx
// src/screens/LoginScreenUI.tsx
export type LoginScreenUIProps = {
  email: string;
  password: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  error?: string;
};

// src/components/ui/Button.tsx
type ButtonProps = PressableProps & {
  title: string;
  variant?: 'primary' | 'outline' | 'ghost';
  isLoading?: boolean;
};
\`\`\``,

  'store-types': `## Store Types

Combine state and actions in a single type:

\`\`\`tsx
// src/store/auth.ts
type AuthState = {
  // State
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;

  // Actions
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
};

export const useAuthStore = create<AuthState>()(...);
\`\`\``,

  generics: `## Generics for Reusable API Hooks

\`\`\`tsx
// Generic base hook
function useApiQuery<T>(
  queryKey: unknown[],
  queryFn: () => Promise<T>,
  options?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>
) {
  return useQuery({ queryKey, queryFn, ...options });
}

// Typed domain hook built on top
export function useProducts(page = 1) {
  return useApiQuery<PaginatedResponse<Product>>(
    ['products', page],
    () => productService.getAll({ page }),
    { staleTime: 60_000 }
  );
}
\`\`\``,

  'as-const': `## \`as const\` for Configuration Objects

\`\`\`tsx
// src/constants/colors.ts
export const colors = {
  primary: '#007AFF',
  error: '#FF3B30',
  success: '#34C759',
} as const;
// Type: { readonly primary: '#007AFF'; ... } — not just { primary: string }

// Enum-like constants
export const AUTH_EVENTS = {
  LOGIN: 'auth/login',
  LOGOUT: 'auth/logout',
  TOKEN_REFRESH: 'auth/token-refresh',
} as const;

type AuthEvent = typeof AUTH_EVENTS[keyof typeof AUTH_EVENTS];
// 'auth/login' | 'auth/logout' | 'auth/token-refresh'
\`\`\``,

  'discriminated-unions': `## Discriminated Unions for Screen States

\`\`\`tsx
type ScreenState<T> =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'empty' }
  | { status: 'success'; data: T };

function ProductScreenUI({ state }: { state: ScreenState<Product[]> }) {
  if (state.status === 'loading') return <LoadingSpinner />;
  if (state.status === 'error') return <ErrorView message={state.message} />;
  if (state.status === 'empty') return <EmptyState />;
  // TypeScript narrows: state.data is Product[]
  return <ProductList data={state.data} />;
}
\`\`\``,

  'type-guards': `## Type Guards

\`\`\`tsx
import { AxiosError } from 'axios';

function isAxiosError(error: unknown): error is AxiosError {
  return (error as AxiosError).isAxiosError === true;
}

// Usage in mutation error handler
onError: (error) => {
  if (isAxiosError(error) && error.response?.status === 422) {
    setValidationErrors(error.response.data.errors);
  }
}
\`\`\``,
};

// ─── Compact sections (rules only, no code) ─────────────────────────

const compactSections: Record<string, string> = {
  'strict-config': `## Strict Mode
- Enable \`"strict": true\` and \`"noUncheckedIndexedAccess": true\`
- Full tsconfig with path aliases: see \`get-project-structure\` (topic: import-aliases)`,

  'route-params': `## Route Params
- \`useLocalSearchParams<{ id: string }>()\` for type-safe params
- Define a type per dynamic route`,

  'api-types': `## API Types
- \`PaginatedResponse<T>\`: items, total, page, limit, hasMore
- \`ApiResponse<T>\`: data, message
- Compose: \`PaginatedResponse<Product>\``,

  'model-types': `## Model Types
- One file per domain: \`src/types/auth.ts\`, \`product.ts\`
- Export \`type User\`, \`type Product\`, etc.
- Separate request/response types: \`LoginRequest\`, \`AuthResponse\``,

  'props-naming': `## Props Naming
- Always \`ComponentNameProps\`: \`ButtonProps\`, \`LoginScreenUIProps\`
- Extend native props: \`PressableProps & { title: string }\``,

  'store-types': `## Store Types
- Single type with state fields + action functions
- \`create<AuthState>()()\` — type param on create`,

  generics: `## Generics
- Create generic \`useApiQuery<T>\` base hook
- Build domain hooks on top: \`useProducts\`, \`useProduct\`
- Pass \`UseQueryOptions\` for customization`,

  'as-const': `## as const
- Use \`as const\` on config objects for literal types
- Enum-like: \`typeof OBJ[keyof typeof OBJ]\` for union type`,

  'discriminated-unions': `## Discriminated Unions
- \`ScreenState<T>\` with \`status\` field: loading | error | empty | success
- TypeScript narrows type after checking \`status\``,

  'type-guards': `## Type Guards
- \`function isX(val: unknown): val is X\` pattern
- Common: \`isAxiosError\` for typed error handling`,
};

// ─── Export ──────────────────────────────────────────────────────────

const pattern: PatternSections = {
  title: 'TypeScript Patterns',
  sections,
  compactSections,
};

export const getTypescriptPatterns = (topic?: string, compact?: boolean): string =>
  resolvePattern(pattern, topic, compact);
