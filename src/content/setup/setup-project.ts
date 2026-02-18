export function getSetupNewProject(): string {
  return `# Setting Up a New Expo + React Native Project

## Prerequisites

- **Node.js 20+** — check with \`node --version\`
- **EAS CLI** — \`npm install -g eas-cli\`
- **Watchman** (macOS) — \`brew install watchman\`
- **Xcode** (iOS builds) — from Mac App Store + Command Line Tools
- **Android Studio** (Android builds) — with Android SDK and emulator

## Step 1: Create Expo Project

\`\`\`bash
npx create-expo-app@latest MyApp --template blank-typescript
cd MyApp
\`\`\`

Remove template boilerplate:
\`\`\`bash
rm -rf app/(tabs) app/modal.tsx components/ constants/ hooks/
\`\`\`

## Step 2: Configure TypeScript

\`\`\`json
// tsconfig.json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
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

## Step 3: Install NativeWind v4

\`\`\`bash
npx expo install nativewind tailwindcss react-native-reanimated react-native-safe-area-context
\`\`\`

Create \`global.css\`:
\`\`\`css
@tailwind base;
@tailwind components;
@tailwind utilities;
\`\`\`

Create \`tailwind.config.js\`:
\`\`\`js
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#007AFF', light: '#4DA2FF', dark: '#0056B3' },
        secondary: '#5856D6',
        background: '#F2F2F7',
        error: '#FF3B30',
        success: '#34C759',
      },
    },
  },
  plugins: [],
};
\`\`\`

Update \`metro.config.js\`:
\`\`\`js
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);
module.exports = withNativeWind(config, { input: './global.css' });
\`\`\`

Create \`nativewind-env.d.ts\`:
\`\`\`ts
/// <reference types="nativewind/types" />
\`\`\`

## Step 4: Create Project Structure

\`\`\`bash
mkdir -p src/{screens,components/ui,hooks,store,services/{api,storage},types,constants}
\`\`\`

Create \`src/constants/colors.ts\`:
\`\`\`ts
export const colors = {
  primary: '#007AFF',
  primaryLight: '#4DA2FF',
  primaryDark: '#0056B3',
  error: '#FF3B30',
  success: '#34C759',
  text: { primary: '#1C1C1E', secondary: '#8E8E93' },
} as const;
\`\`\`

## Step 5: Configure Babel

\`\`\`bash
npx expo install babel-plugin-module-resolver
\`\`\`

\`\`\`js
// babel.config.js
module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    // React Compiler (React 19+ / Expo SDK 52+)
    ['babel-plugin-react-compiler', { target: '19' }],
    // Path aliases
    ['module-resolver', {
      root: ['./src'],
      alias: {
        '@': './src',
        '@components': './src/components',
        '@screens': './src/screens',
        '@hooks': './src/hooks',
        '@store': './src/store',
        '@services': './src/services',
        '@constants': './src/constants',
      },
    }],
    'nativewind/babel',
  ],
};
\`\`\`

## Step 6: Install State Management (Zustand + MMKV)

\`\`\`bash
npx expo install zustand react-native-mmkv
\`\`\`

> **Note**: react-native-mmkv requires native build — it does NOT work in Expo Go. Use \`expo prebuild\` or EAS Build.

Create \`src/services/storage/mmkv.ts\`:
\`\`\`ts
import { MMKV } from 'react-native-mmkv';
import { StateStorage } from 'zustand/middleware';

let _storage: MMKV | null = null;

function getStorage(): MMKV {
  if (!_storage) _storage = new MMKV();
  return _storage;
}

export const zustandStorage: StateStorage = {
  getItem: (name) => getStorage().getString(name) ?? null,
  setItem: (name, value) => getStorage().set(name, value),
  removeItem: (name) => getStorage().delete(name),
};
\`\`\`

Create \`src/store/auth.ts\`:
\`\`\`ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage } from '@services/storage/mmkv';

type User = { id: string; name: string; email: string };

type AuthState = {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      login: (token, user) => set({ token, user, isAuthenticated: true }),
      logout: () => set({ token: null, user: null, isAuthenticated: false }),
    }),
    { name: 'auth-storage', storage: createJSONStorage(() => zustandStorage) }
  )
);
\`\`\`

## Step 7: Setup API Client (Axios + TanStack Query)

\`\`\`bash
npx expo install axios @tanstack/react-query
\`\`\`

Create \`src/services/api/client.ts\`:
\`\`\`ts
import axios from 'axios';
import { useAuthStore } from '@store/auth';

const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = \`Bearer \${token}\`;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) useAuthStore.getState().logout();
    return Promise.reject(error);
  }
);

export default apiClient;
\`\`\`

Add QueryClient to root layout \`app/_layout.tsx\`:
\`\`\`tsx
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '../global.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 5, retry: 1, refetchOnWindowFocus: false },
  },
});

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }} />
    </QueryClientProvider>
  );
}
\`\`\`

## Step 8: Configure Environment Variables

Create environment files:
\`\`\`bash
mkdir env
\`\`\`

\`\`\`json
// env/dev.json
{ "EXPO_PUBLIC_API_URL": "https://dev-api.example.com" }

// env/staging.json
{ "EXPO_PUBLIC_API_URL": "https://staging-api.example.com" }

// env/prod.json
{ "EXPO_PUBLIC_API_URL": "https://api.example.com" }
\`\`\`

Create \`scripts/set-env.js\`:
\`\`\`js
const fs = require('fs');
const path = require('path');

const env = process.argv[2] || 'dev';
const source = path.join(__dirname, '..', 'env', \`\${env}.json\`);
const envVars = JSON.parse(fs.readFileSync(source, 'utf-8'));

const lines = Object.entries(envVars).map(([k, v]) => \`\${k}=\${v}\`).join('\\n');
fs.writeFileSync(path.join(__dirname, '..', '.env'), lines);
console.log(\`Environment set to: \${env}\`);
\`\`\`

Add to \`package.json\`:
\`\`\`json
"scripts": {
  "env:dev": "node scripts/set-env.js dev",
  "env:staging": "node scripts/set-env.js staging",
  "env:prod": "node scripts/set-env.js prod"
}
\`\`\`

## Step 9: Setup EAS Build

\`\`\`bash
eas login
eas build:configure
\`\`\`

This creates \`eas.json\`:
\`\`\`json
{
  "cli": { "version": ">= 5.0.0" },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {}
  },
  "submit": {
    "production": {}
  }
}
\`\`\`

## Step 10: Setup OTA Updates

\`\`\`bash
npx expo install expo-updates
eas update:configure
\`\`\`

Add to \`app.json\`:
\`\`\`json
{
  "expo": {
    "updates": {
      "url": "https://u.expo.dev/YOUR_PROJECT_ID",
      "enabled": true,
      "fallbackToCacheTimeout": 0
    },
    "runtimeVersion": { "policy": "appVersion" }
  }
}
\`\`\`

Deploy an update:
\`\`\`bash
eas update --branch production --message "Fix login crash"
\`\`\`

## Step 11: CI/CD with GitHub Actions (Optional)

Create \`.github/workflows/eas-build.yml\`:
\`\`\`yaml
name: EAS Build

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with: { node-version: 20 }
      - run: npm ci
      - uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          token: \${{ secrets.EXPO_TOKEN }}
      - run: eas build --platform all --non-interactive
\`\`\`

## Step 12: Build Commands

\`\`\`bash
# Development build (installs on device, supports custom native code)
eas build --profile development --platform ios
eas build --profile development --platform android

# Preview build (for testing, no store submission)
eas build --profile preview --platform all

# Production build
eas build --profile production --platform all

# Local build (requires Xcode/Android Studio)
npx expo run:ios
npx expo run:android
\`\`\`

## Step 13: Testing on Devices

**iOS — TestFlight:**
\`\`\`bash
eas submit --platform ios --latest
\`\`\`

**Android — Direct APK:**
\`\`\`bash
# Download APK from EAS build output URL
# Or build locally:
npx expo run:android --variant release
\`\`\`

**Development client (Expo Go alternative):**
\`\`\`bash
# After installing development build on device:
npx expo start --dev-client
\`\`\`

## Quick Reference Commands

\`\`\`bash
# Start dev server
npx expo start

# Start with cache clear
npx expo start --clear

# Prebuild (generate native ios/ and android/ folders)
npx expo prebuild

# Run on simulator
npx expo run:ios
npx expo run:android

# EAS commands
eas build --platform all
eas update --branch production --message "Description"
eas submit --platform ios

# Type checking
npx tsc --noEmit
\`\`\`
`;
}
