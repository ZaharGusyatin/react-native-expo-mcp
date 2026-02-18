interface ProjectFilesOptions {
  appName: string;
  router?: string; // kept for API compatibility, always Expo Router
  features?: string[];
  includeCI?: boolean;
  includeEnvSetup?: boolean;
}

interface GeneratedFile {
  path: string;
  content: string;
}

export function generateProjectFiles(options: ProjectFilesOptions): string {
  const {
    appName,
    features = [],
    includeCI = false,
    includeEnvSetup = true,
  } = options;

  const files: GeneratedFile[] = [];

  // Common files
  files.push(...getCommonFiles(appName));

  // tsconfig.json with path aliases
  files.push(getTsConfig());

  // Expo Router files
  files.push(...getExpoRouterFiles(appName, features));

  // Store files
  files.push(...getStoreFiles());

  // API files
  files.push(...getApiFiles());

  // Env setup
  if (includeEnvSetup) {
    files.push(...getEnvFiles(appName));
  }

  // CI/CD
  if (includeCI) {
    files.push(...getCIFiles());
  }

  // Format output
  const output = files
    .map((f) => `## ${f.path}\n\`\`\`${getExt(f.path)}\n${f.content}\n\`\`\``)
    .join("\n\n");

  const cleanupInstructions = `## Cleanup Template Files

If your project was created from a template with example files, remove them:

\`\`\`bash
rm -f "app/(tabs)/two.tsx" app/modal.tsx app/+html.tsx
rm -f components/EditScreenInfo.tsx components/StyledText.tsx components/Themed.tsx
rm -f constants/Colors.ts
\`\`\`

Update \`app/+not-found.tsx\` — replace any \`@/components/Themed\` import with standard \`react-native\`:
\`\`\`tsx
import { Text, View } from 'react-native';
\`\`\``;

  return `# Starter Files for ${appName} (Expo Router)

Create the following files in your project:

${output}

${cleanupInstructions}

---

After creating the files:
\`\`\`bash
npm install babel-plugin-module-resolver babel-plugin-react-compiler
npm install
npx expo prebuild --clean
npx expo run:ios     # or npx expo run:android
\`\`\`

> **Note:** This project uses \`react-native-mmkv\` — a native module that does **not work in Expo Go**. You need \`expo prebuild\` to generate native projects (ios/android folders), then run via \`expo run:ios\` / \`expo run:android\`.
`;
}

function getExt(path: string): string {
  if (path.endsWith(".tsx") || path.endsWith(".ts")) return "tsx";
  if (path.endsWith(".js")) return "js";
  if (path.endsWith(".json")) return "json";
  if (path.endsWith(".css")) return "css";
  if (path.endsWith(".yml") || path.endsWith(".yaml")) return "yaml";
  return "";
}

function getCommonFiles(appName: string): GeneratedFile[] {
  return [
    {
      path: "tailwind.config.js",
      content: `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#007AFF', light: '#4DA2FF', dark: '#0056B3' },
        secondary: '#5856D6',
        background: '#F2F2F7',
        surface: '#FFFFFF',
        error: '#FF3B30',
        success: '#34C759',
        warning: '#FF9500',
      },
    },
  },
  plugins: [],
};`,
    },
    {
      path: "global.css",
      content: `@tailwind base;
@tailwind components;
@tailwind utilities;`,
    },
    {
      path: "metro.config.js",
      content: `const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: "./global.css" });`,
    },
    {
      path: "nativewind-env.d.ts",
      content: `/// <reference types="nativewind/types" />`,
    },
    {
      path: "src/constants/colors.ts",
      content: `export const colors = {
  primary: '#007AFF',
  primaryLight: '#4DA2FF',
  primaryDark: '#0056B3',
  secondary: '#5856D6',
  background: '#F2F2F7',
  surface: '#FFFFFF',
  error: '#FF3B30',
  success: '#34C759',
  warning: '#FF9500',
  text: {
    primary: '#1C1C1E',
    secondary: '#8E8E93',
    tertiary: '#AEAEB2',
  },
} as const;`,
    },
    {
      path: "src/components/ui/Button.tsx",
      content: `import { Pressable, Text } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
}

export function Button({ title, onPress, variant = 'primary', disabled }: ButtonProps) {
  const base = 'rounded-xl py-3 px-6 items-center';
  const variants = {
    primary: 'bg-primary active:bg-primary-dark',
    secondary: 'bg-secondary active:opacity-80',
    outline: 'border-2 border-primary active:bg-primary/10',
  };
  const textStyles = {
    primary: 'text-white font-semibold',
    secondary: 'text-white font-semibold',
    outline: 'text-primary font-semibold',
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={\`\${base} \${variants[variant]} \${disabled ? 'opacity-50' : ''}\`}
    >
      <Text className={textStyles[variant]}>{title}</Text>
    </Pressable>
  );
}`,
    },
    {
      path: "babel.config.js",
      content: `module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-compiler/babel',
      'nativewind/babel',
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './src',
            '@store': './src/store',
            '@components': './src/components',
            '@constants': './src/constants',
            '@services': './src/services',
            '@app-types': './src/types',
            '@hooks': './src/hooks',
            '@screens': './src/screens',
            '@utils': './src/utils',
          },
        },
      ],
    ],
  };
};`,
    },
    {
      path: "src/types/auth.ts",
      content: `export interface User {
  id: string;
  email: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest extends LoginRequest {
  name: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}`,
    },
  ];
}

function getTsConfig(): GeneratedFile {
  return {
    path: "tsconfig.json",
    content: `{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": ["./src/*"],
      "@store/*": ["./src/store/*"],
      "@components/*": ["./src/components/*"],
      "@constants/*": ["./src/constants/*"],
      "@services/*": ["./src/services/*"],
      "@app-types/*": ["./src/types/*"],
      "@hooks/*": ["./src/hooks/*"],
      "@screens/*": ["./src/screens/*"],
      "@utils/*": ["./src/utils/*"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx", ".expo/types/**/*.ts", "expo-env.d.ts", "nativewind-env.d.ts"]
}`,
  };
}

function getExpoRouterFiles(appName: string, features: string[]): GeneratedFile[] {
  return [
    {
      path: "app/_layout.tsx",
      content: `import { Stack, useRouter, useSegments, useNavigationContainerRef } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '@store/auth';
import { useEffect, useState } from 'react';
import "../global.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 2, staleTime: 30_000 },
  },
});

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
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </QueryClientProvider>
  );
}`,
    },
    {
      path: "app/(auth)/_layout.tsx",
      content: `import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}`,
    },
    {
      path: "app/(auth)/login.tsx",
      content: `import { View, Text, TextInput, Alert } from 'react-native';
import { useState } from 'react';
import { useAuthStore } from '@store/auth';
import { Button } from '@components/ui/Button';
import { router } from 'expo-router';

export default function LoginRoute() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const setAuth = useAuthStore((s) => s.setAuth);

  const handleLogin = () => {
    // TODO: Replace with actual API call
    setAuth({ id: '1', email, name: 'User' }, 'mock-token');
  };

  return (
    <View className="flex-1 bg-background justify-center px-6">
      <Text className="text-3xl font-bold text-center mb-8">${appName}</Text>
      <TextInput
        className="bg-surface rounded-xl px-4 py-3 mb-3 text-base"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        className="bg-surface rounded-xl px-4 py-3 mb-6 text-base"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Sign In" onPress={handleLogin} />
      <Text
        className="text-primary text-center mt-4"
        onPress={() => router.push('/(auth)/register')}
      >
        Don't have an account? Register
      </Text>
    </View>
  );
}`,
    },
    {
      path: "app/(tabs)/_layout.tsx",
      content: `import { Tabs } from 'expo-router';
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
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}`,
    },
    {
      path: "app/(tabs)/index.tsx",
      content: `import { View, Text } from 'react-native';
import { useAuthStore } from '@store/auth';

export default function HomeRoute() {
  const user = useAuthStore((s) => s.user);

  return (
    <View className="flex-1 bg-background items-center justify-center p-6">
      <Text className="text-2xl font-bold">Hello, {user?.name ?? 'Guest'}!</Text>
      <Text className="text-gray-500 mt-2">Welcome to ${appName}</Text>
    </View>
  );
}`,
    },
    {
      path: "app/(tabs)/catalog.tsx",
      content: `import { View, Text } from 'react-native';

export default function CatalogRoute() {
  return (
    <View className="flex-1 bg-background items-center justify-center p-6">
      <Text className="text-2xl font-bold">Catalog</Text>
      <Text className="text-gray-500 mt-2">Product list goes here</Text>
    </View>
  );
}`,
    },
    {
      path: "app/(tabs)/profile.tsx",
      content: `import { View, Text } from 'react-native';
import { useAuthStore } from '@store/auth';
import { Button } from '@components/ui/Button';

export default function ProfileRoute() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  return (
    <View className="flex-1 bg-background items-center justify-center p-6">
      <Text className="text-2xl font-bold">{user?.name ?? 'Guest'}</Text>
      <Text className="text-gray-500 mt-2">{user?.email ?? ''}</Text>
      <View className="mt-8 w-full">
        <Button title="Sign Out" variant="outline" onPress={logout} />
      </View>
    </View>
  );
}`,
    },
    {
      path: "app/(auth)/register.tsx",
      content: `import { View, Text, TextInput } from 'react-native';
import { useState } from 'react';
import { useAuthStore } from '@store/auth';
import { Button } from '@components/ui/Button';
import { router } from 'expo-router';

export default function RegisterRoute() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const setAuth = useAuthStore((s) => s.setAuth);

  const handleRegister = () => {
    // TODO: Replace with actual API call
    setAuth({ id: '1', email, name }, 'mock-token');
  };

  return (
    <View className="flex-1 bg-background justify-center px-6">
      <Text className="text-3xl font-bold text-center mb-8">Register</Text>
      <TextInput
        className="bg-surface rounded-xl px-4 py-3 mb-3 text-base"
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        className="bg-surface rounded-xl px-4 py-3 mb-3 text-base"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        className="bg-surface rounded-xl px-4 py-3 mb-6 text-base"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Register" onPress={handleRegister} />
      <Text
        className="text-primary text-center mt-4"
        onPress={() => router.back()}
      >
        Already have an account? Sign In
      </Text>
    </View>
  );
}`,
    },
  ];
}


function getStoreFiles(): GeneratedFile[] {
  return [
    {
      path: "src/services/storage/mmkv.ts",
      content: `import { MMKV } from 'react-native-mmkv';
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
};`,
    },
    {
      path: "src/store/auth.ts",
      content: `import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage } from '@services/storage/mmkv';
import { User } from '@app-types/auth';

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
      setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);`,
    },
    {
      path: "src/store/index.ts",
      content: `export { useAuthStore } from './auth';`,
    },
  ];
}

function getApiFiles(): GeneratedFile[] {
  return [
    {
      path: "src/services/api/client.ts",
      content: `import axios from 'axios';
import { useAuthStore } from '@store/auth';
import { getEnvConfig } from '@constants/config';

const apiClient = axios.create({
  baseURL: getEnvConfig().API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = \`Bearer \${token}\`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default apiClient;`,
    },
  ];
}

function getEnvFiles(appName: string): GeneratedFile[] {
  return [
    {
      path: "env/env.example.json",
      content: `{
  "API_URL": "https://api.example.com",
  "APP_ENV": "development",
  "SENTRY_DSN": "",
  "ANALYTICS_KEY": ""
}`,
    },
    {
      path: "src/constants/config.ts",
      content: `import envConfig from '../../env/env.json';

interface EnvConfig {
  API_URL: string;
  APP_ENV: 'development' | 'staging' | 'production';
  SENTRY_DSN: string;
  ANALYTICS_KEY: string;
}

export function getEnvConfig(): EnvConfig {
  return envConfig as EnvConfig;
}

export const config = {
  get apiUrl() { return getEnvConfig().API_URL; },
  get isDev() { return getEnvConfig().APP_ENV === 'development'; },
  get isProd() { return getEnvConfig().APP_ENV === 'production'; },
};`,
    },
    {
      path: "scripts/set-env.js",
      content: `const fs = require('fs');
const env = process.env.APP_ENV || 'development';
const source = \`env/env.\${env}.json\`;
const dest = 'env/env.json';

if (fs.existsSync(source)) {
  fs.copyFileSync(source, dest);
  console.log(\`Environment set to: \${env}\`);
} else {
  console.warn(\`Warning: \${source} not found, using example\`);
  fs.copyFileSync('env/env.example.json', dest);
}`,
    },
  ];
}

function getCIFiles(): GeneratedFile[] {
  return [
    {
      path: ".github/workflows/eas-build.yml",
      content: `name: EAS Build & Update

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint-and-typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npx tsc --noEmit
      - run: npx eslint . --max-warnings 0

  build-production:
    if: github.ref == 'refs/heads/main'
    needs: lint-and-typecheck
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          token: \${{ secrets.EXPO_TOKEN }}
      - run: npm ci
      - run: eas build --profile production --platform all --non-interactive`,
    },
  ];
}
