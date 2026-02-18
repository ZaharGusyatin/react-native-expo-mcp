export function getTypescriptPatterns(): string {
  return `# TypeScript Patterns

## Strict Mode Configuration

\`\`\`json
// tsconfig.json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@screens/*": ["./src/screens/*"],
      "@hooks/*": ["./src/hooks/*"],
      "@store/*": ["./src/store/*"],
      "@services/*": ["./src/services/*"],
      "@constants/*": ["./src/constants/*"]
    }
  }
}
\`\`\`

## Route Param Typing

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
\`\`\`

## API Response Types

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
\`\`\`

## Model Types

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
\`\`\`

## Props Interface Naming

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
\`\`\`

## Store Types

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
\`\`\`

## Generics for Reusable API Hooks

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
\`\`\`

## \`as const\` for Configuration Objects

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
\`\`\`

## Discriminated Unions for Screen States

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
\`\`\`

## Type Guards

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
\`\`\`
`;
}
