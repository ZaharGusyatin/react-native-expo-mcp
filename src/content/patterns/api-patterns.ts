export function getApiPatterns(): string {
  return `# API Patterns (Axios + TanStack Query)

## Axios Client with Interceptors

\`\`\`tsx
// src/services/api/client.ts
import axios from 'axios';
import { useAuthStore } from '@/store/auth';

const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — automatically adds auth token
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = \`Bearer \${token}\`;
  }
  return config;
});

// Response interceptor — auto-logout on 401
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default apiClient;
\`\`\`

## API Service Pattern

Group API calls by domain in separate files:

\`\`\`tsx
// src/services/api/auth.ts
import apiClient from './client';

type LoginResponse = {
  token: string;
  user: { id: string; name: string; email: string };
};

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const { data } = await apiClient.post('/auth/login', { email, password });
    return data;
  },

  register: async (payload: {
    name: string;
    email: string;
    password: string;
  }): Promise<LoginResponse> => {
    const { data } = await apiClient.post('/auth/register', payload);
    return data;
  },

  getProfile: async (): Promise<User> => {
    const { data } = await apiClient.get('/auth/profile');
    return data;
  },
};
\`\`\`

\`\`\`tsx
// src/services/api/products.ts
import apiClient from './client';

export const productService = {
  getAll: async (params?: { page?: number; limit?: number }) => {
    const { data } = await apiClient.get('/products', { params });
    return data;
  },

  getById: async (id: string) => {
    const { data } = await apiClient.get(\`/products/\${id}\`);
    return data;
  },

  create: async (product: CreateProductPayload) => {
    const { data } = await apiClient.post('/products', product);
    return data;
  },
};
\`\`\`

## TanStack Query — Custom Hooks

Always create custom hooks for TanStack Query. Do NOT use useQuery/useMutation directly in components.

### useQuery for Reading

\`\`\`tsx
// src/hooks/useProducts.ts
import { useQuery } from '@tanstack/react-query';
import { productService } from '@/services/api/products';

export const useProducts = (page = 1) => {
  return useQuery({
    queryKey: ['products', page],
    queryFn: () => productService.getAll({ page, limit: 20 }),
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getById(id),
    enabled: !!id, // Don't fetch if id is missing
  });
};
\`\`\`

### useMutation for Writing

\`\`\`tsx
// src/hooks/useAuth.ts
import { useMutation } from '@tanstack/react-query';
import { authService } from '@/services/api/auth';
import { useAuthStore } from '@/store/auth';

export const useLogin = () => {
  const login = useAuthStore((s) => s.login);

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authService.login(email, password),
    onSuccess: (data) => {
      login(data.token, data.user);
    },
  });
};
\`\`\`

### Usage in a Route File

\`\`\`tsx
// app/(tabs)/catalog.tsx
import CatalogScreenUI from '@/screens/CatalogScreenUI';
import { useProducts } from '@/hooks/useProducts';

export default function CatalogRoute() {
  const { data, isLoading, error, refetch } = useProducts();

  return (
    <CatalogScreenUI
      products={data?.items ?? []}
      isLoading={isLoading}
      error={error?.message}
      onRefresh={refetch}
    />
  );
}
\`\`\`

## Query Key Conventions

Use a consistent key structure:

\`\`\`tsx
// Entity list
queryKey: ['products']
queryKey: ['products', { page: 1, category: 'electronics' }]

// Single entity
queryKey: ['product', productId]

// Nested entity
queryKey: ['product', productId, 'reviews']

// User-specific
queryKey: ['user', userId, 'orders']
\`\`\`

## QueryClient Config

\`\`\`tsx
// app/_layout.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes — data is considered fresh
      retry: 2,                  // 2 retries on error
      refetchOnWindowFocus: false, // Don't refetch on focus (mobile app)
    },
  },
});

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* ... */}
    </QueryClientProvider>
  );
}
\`\`\`

## Rules

1. **Client state → Zustand**: auth, cart, preferences
2. **Server state → TanStack Query**: products, orders, profiles
3. **Custom hooks**: always create \`useProducts\`, \`useLogin\` — do not write \`useQuery\` directly in components
4. **Query keys**: consistent structure \`['entity', ...params]\`
5. **Error handling**: interceptor for 401, onError for specific errors
6. **Token injection**: via interceptor, do not pass token manually
`;
}
