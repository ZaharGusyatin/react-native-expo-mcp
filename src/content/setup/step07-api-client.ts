import { Router } from "../../utils/format.js";

export function getStep07(router: Router): string {
  const routerExample = router === "expo-router"
    ? `\`\`\`tsx
// app/(tabs)/catalog.tsx — використання в route
import { CatalogScreenUI } from '@screens/catalog/CatalogScreenUI';
import { useProducts } from '@hooks/useProducts';

export default function CatalogRoute() {
  const { data, isLoading, error, refetch } = useProducts();

  return (
    <CatalogScreenUI
      products={data ?? []}
      isLoading={isLoading}
      error={error?.message}
      onRefresh={refetch}
    />
  );
}
\`\`\``
    : `\`\`\`tsx
// src/screens/catalog/CatalogScreen.tsx — використання в container
import { CatalogScreenUI } from './CatalogScreenUI';
import { useProducts } from '@hooks/useProducts';

export function CatalogScreen() {
  const { data, isLoading, error, refetch } = useProducts();

  return (
    <CatalogScreenUI
      products={data ?? []}
      isLoading={isLoading}
      error={error?.message}
      onRefresh={refetch}
    />
  );
}
\`\`\``;

  return `# Крок 7 — API Client (Axios + TanStack Query)

## 7.1 Навіщо Axios + TanStack Query?

- **Axios** — HTTP клієнт з interceptors, retry, cancel
- **TanStack Query** — кешування, автоматичний refetch, optimistic updates, infinite scroll

## 7.2 Встановлення

\`\`\`bash
npx expo install axios @tanstack/react-query
\`\`\`

## 7.3 Axios Instance

\`\`\`tsx
// src/services/api/client.ts
import axios from 'axios';
import { useAuthStore } from '@store/auth';
import { getEnvConfig } from '@constants/config';

const apiClient = axios.create({
  baseURL: getEnvConfig().API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — додаємо token
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = \`Bearer \${token}\`;
  }
  return config;
});

// Response interceptor — обробка 401
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

## 7.4 API Service

\`\`\`tsx
// src/services/api/products.ts
import apiClient from './client';
import { Product } from '@app-types/product';

export const productsApi = {
  getAll: async (): Promise<Product[]> => {
    const { data } = await apiClient.get('/products');
    return data;
  },

  getById: async (id: string): Promise<Product> => {
    const { data } = await apiClient.get(\`/products/\${id}\`);
    return data;
  },

  search: async (query: string): Promise<Product[]> => {
    const { data } = await apiClient.get('/products/search', {
      params: { q: query },
    });
    return data;
  },
};
\`\`\`

\`\`\`tsx
// src/services/api/auth.ts
import apiClient from './client';

interface LoginRequest {
  email: string;
  password: string;
}

interface AuthResponse {
  user: { id: string; email: string; name: string };
  token: string;
}

export const authApi = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const { data } = await apiClient.post('/auth/login', credentials);
    return data;
  },

  register: async (credentials: LoginRequest & { name: string }): Promise<AuthResponse> => {
    const { data } = await apiClient.post('/auth/register', credentials);
    return data;
  },

  getProfile: async (): Promise<AuthResponse['user']> => {
    const { data } = await apiClient.get('/auth/profile');
    return data;
  },
};
\`\`\`

## 7.5 TanStack Query Hooks

\`\`\`tsx
// src/hooks/useProducts.ts
import { useQuery } from '@tanstack/react-query';
import { productsApi } from '@services/api/products';

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: productsApi.getAll,
    staleTime: 5 * 60 * 1000, // 5 хвилин
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['products', id],
    queryFn: () => productsApi.getById(id),
    enabled: !!id,
  });
}
\`\`\`

## 7.6 Query Provider

Додайте \`QueryClientProvider\` у root layout:

\`\`\`tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 30 * 1000, // 30 секунд
      gcTime: 5 * 60 * 1000, // 5 хвилин (garbage collection)
    },
  },
});

// Оберніть ваш root component:
<QueryClientProvider client={queryClient}>
  {children}
</QueryClientProvider>
\`\`\`

## 7.7 Приклад використання

${routerExample}

✅ **Checkpoint**: Axios client з interceptors, TanStack Query hooks, QueryProvider налаштовані
`;
}
