# Setup Tutorial: React Native + Expo

**Version 1.0 (2024)**

## Preface

> **Read this carefully before starting:**
>
> This tutorial will guide you through setting up a production-ready React Native project with Expo, TypeScript, NativeWind, and all necessary tools for professional mobile development.

**Important:**
- Do not skip steps — follow them in order, as skipping will cause configuration issues
- Keep all credentials (API keys, tokens) secure and never commit them to git
- Test on both iOS and Android simulators before deploying to production
- Budget approximately 1-2 hours for initial setup (first time)

**What you'll build:**
- React Native + Expo SDK 54+ project
- TypeScript with strict mode enabled
- Expo Router (file-based routing) — сучасна маршрутизація як у Next.js
- NativeWind v4 (Tailwind CSS) — швидка стилізація без StyleSheet
- Zustand + MMKV — state management з persistence
- EAS Build — CI/CD для iOS та Android
- OTA Updates — оновлення без App Store review
- GitHub Actions / GitLab CI — автоматичні builds

## Prerequisites

Before starting, ensure you have:

- macOS (for iOS development) or Windows/Linux (Android only)
- Node.js 18+ installed (Download: https://nodejs.org/)
- Git installed
- Code editor: WebStorm (recommended) or VS Code
- Expo account (Create free: https://expo.dev/signup)
- Apple Developer Account ($99/year, required for iOS production builds)
- Google Play Console Account ($25 one-time fee, required for Android production)

**Optional (for local testing):**
- Xcode — for iOS simulator (macOS only)
- Android Studio — for Android emulator

---

## Step 1: Install Required Tools

### 1.1 Install Node.js and npm

Check if already installed in terminal:

```bash
node --version
npm --version
```

Should output version 18.x+ for Node and 9.x+ for npm.

If not installed, download from: https://nodejs.org/

### 1.2 Install Expo CLI

Open terminal and run:

```bash
npm install -g expo-cli eas-cli
```

Verify installation:

```bash
expo --version
eas --version
```

### 1.3 Install Watchman (macOS only, improves performance)

```bash
brew install watchman
```

Skip this step if you're on Windows/Linux.

---

## Step 2: Create New Expo Project

### 2.1 Initialize Project

In terminal, run:

```bash
npx create-expo-app@latest your-project-name --template expo-router-typescript
```

Replace `your-project-name` with your actual project name (lowercase, hyphens only, e.g., `my-awesome-app`).

Navigate to project folder:

```bash
cd your-project-name
```

### 2.2 Verify Project Structure

After creation, you should see these folders and files:

- `app/` — Expo Router routes (screens)
- `assets/` — Images, fonts
- `node_modules/` — Dependencies
- `package.json` — Project configuration
- `app.json` — Expo configuration
- `tsconfig.json` — TypeScript configuration

### 2.3 Start Development Server

In terminal:

```bash
npx expo start
```

You should see output like:

```
› Metro waiting on exp://192.168.x.x:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)
› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web
```

**Test the app:**
- Press `i` for iOS simulator (macOS only)
- Press `a` for Android emulator
- Or scan QR code with Expo Go app on your phone

> **Checkpoint:** App should load and show "Hello World" screen

---

## Step 3: Configure TypeScript (Strict Mode)

### 3.1 Update tsconfig.json

Open `tsconfig.json` and replace with:

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "strictNullChecks": true,
    "noImplicitAny": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "jsx": "react-native",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx", ".expo/types/**/*.ts", "expo-env.d.ts"],
  "exclude": ["node_modules"]
}
```

### 3.2 Create Path Alias Configuration (Optional but Recommended)

Path aliases дозволяють писати `import { Button } from '@/components/Button'` замість `import { Button } from '../../../components/Button'`.

Install required package:

```bash
npx expo install babel-plugin-module-resolver
```

Update `babel.config.js`:

```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './src',
          },
        },
      ],
    ],
  };
};
```

Якщо не потрібні path aliases — пропустіть цей крок і видаліть `"paths"` з `tsconfig.json`.

> **Checkpoint:** TypeScript strict mode enabled

---

## Step 4: Install and Configure NativeWind v4

### 4.1 Install NativeWind

```bash
npm install nativewind@^4.0.0 tailwindcss
npx tailwindcss init
```

### 4.2 Configure Tailwind CSS

Update `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#6366F1',
          secondary: '#EC4899',
        },
      },
    },
  },
  plugins: [],
};
```

### 4.3 Add NativeWind to Babel

Update `babel.config.js`:

```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'nativewind/babel',
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './src',
          },
        },
      ],
    ],
  };
};
```

### 4.4 Create Global CSS File

Create `global.css` in root:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 4.5 Import Global CSS

In `app/_layout.tsx`, add at the top:

```typescript
import '../global.css';
```

### 4.6 Test NativeWind

Update `app/index.tsx`:

```tsx
import { View, Text } from 'react-native';

const HomeScreen = () => {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-3xl font-bold text-brand-primary">
        Hello NativeWind!
      </Text>
    </View>
  );
};

export default HomeScreen;
```

Run `npx expo start` and verify Tailwind classes work.

> **Checkpoint:** NativeWind working, Tailwind classes applied

---

## Step 5: Setup Project Structure

### 5.1 Create Directory Structure

```bash
mkdir -p src/{components,screens,hooks,services,store,utils,constants,types,assets}
mkdir -p src/components/{buttons,inputs,common}
mkdir -p src/services/api
```

**Final structure:**

```
your-project-name/
├── app/                    # Expo Router routes
│   ├── (tabs)/
│   ├── (auth)/
│   ├── _layout.tsx
│   └── index.tsx
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── buttons/
│   │   ├── inputs/
│   │   └── common/
│   ├── screens/            # Screen UI components
│   ├── hooks/              # Custom hooks
│   ├── services/           # API services
│   │   └── api/
│   ├── store/              # Zustand stores
│   ├── utils/              # Helper functions
│   ├── constants/          # Constants (colors, layout, config)
│   ├── types/              # TypeScript types
│   └── assets/             # Local assets
├── assets/                 # Expo managed assets
├── global.css
├── app.json
├── package.json
└── tsconfig.json
```

### 5.2 Create Constants Files

**`src/constants/colors.ts`:**

```typescript
export const BRAND_PRIMARY = '#6366F1';
export const BRAND_SECONDARY = '#EC4899';
export const TEXT_PRIMARY = '#111827';
export const TEXT_SECONDARY = '#6B7280';
export const BACKGROUND = '#FFFFFF';
export const ERROR = '#EF4444';
export const SUCCESS = '#10B981';
```

**`src/constants/layout.ts`:**

```typescript
import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export const SCREEN_WIDTH = width;
export const SCREEN_HEIGHT = height;
export const IS_SMALL_DEVICE = width < 375;
export const IS_IOS = Platform.OS === 'ios';
export const IS_ANDROID = Platform.OS === 'android';
```

**`src/constants/config.ts`:**

```typescript
import Constants from 'expo-constants';

export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://api.example.com';
export const APP_VERSION = Constants.expoConfig?.version ?? '1.0.0';
export const IS_DEV = __DEV__;
```

> **Checkpoint:** Project structure created, constants files ready

---

## Step 6: Install State Management (Zustand + MMKV)

### 6.1 Install Packages

```bash
npx expo install zustand react-native-mmkv
```

### 6.2 Create Auth Store

**`src/store/auth.ts`:**

```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();

const mmkvStorage = {
  getItem: (key: string) => storage.getString(key) ?? null,
  setItem: (key: string, value: string) => storage.set(key, value),
  removeItem: (key: string) => storage.delete(key),
};

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
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      login: (token, user) =>
        set({ token, user, isAuthenticated: true }),

      logout: () =>
        set({ token: null, user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
```

> **Checkpoint:** Zustand + MMKV configured

---

## Step 7: Setup API Client (Axios + TanStack Query)

### 7.1 Install Packages

```bash
npm install axios @tanstack/react-query
```

**Чому TanStack Query (React Query)?**
- Автоматичне кешування API запитів
- Background refetching
- Optimistic updates
- Retry logic з коробки
- Loading/error states без зайвого коду

### 7.2 Create API Client

**`src/services/api/client.ts`:**

```typescript
import axios from 'axios';
import { useAuthStore } from '@/store/auth';
import { API_URL } from '@/constants/config';

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Logout on 401
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### 7.3 Setup TanStack Query Provider

**`app/_layout.tsx`:**

```typescript
import '../global.css';
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
    },
  },
});

const RootLayout = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack />
    </QueryClientProvider>
  );
};

export default RootLayout;
```

### 7.4 Create Auth Service

**`src/services/api/auth.ts`:**

```typescript
import apiClient from './client';

type LoginResponse = {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
};

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (data: {
    name: string;
    email: string;
    password: string;
  }): Promise<LoginResponse> => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  getProfile: async (userId: string) => {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  },
};
```

### 7.5 Create Custom Hooks with TanStack Query

**`src/hooks/useAuth.ts`:**

```typescript
import { useMutation, useQuery } from '@tanstack/react-query';
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

export const useProfile = (userId: string) => {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: () => authService.getProfile(userId),
    enabled: !!userId, // Не запитувати якщо userId немає
  });
};
```

### 7.6 Usage Example in Screen

**`app/(auth)/login.tsx`:**

```typescript
import { useState } from 'react';
import { router } from 'expo-router';
import LoginScreenUI from '@/screens/LoginScreenUI';
import { useLogin } from '@/hooks/useAuth';

const LoginRoute = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loginMutation = useLogin();

  const handleSubmit = () => {
    loginMutation.mutate(
      { email, password },
      {
        onSuccess: () => {
          router.replace('/(tabs)/home');
        },
        onError: (error) => {
          alert('Login failed');
        },
      }
    );
  };

  return (
    <LoginScreenUI
      email={email}
      password={password}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onSubmit={handleSubmit}
      isLoading={loginMutation.isPending}
    />
  );
};

export default LoginRoute;
```

> **Checkpoint:** API client + TanStack Query configured

---

## Step 8: Configure Environment Variables (Script-Based Approach)

**Рекомендований підхід:** Замість `.env` файлів використовуйте JSON конфіги + скрипт для швидкого переключення.

**Переваги:**
- Один скрипт — швидке переключення між dev/staging/production
- Всі налаштування в одному JSON (API URLs, bundle IDs, keys)
- Не потрібен rebuild — просто reload Metro bundler (натисни `r`)
- Легко масштабується

### 8.1 Create Directory Structure

```bash
mkdir envs
mkdir scripts
```

### 8.2 Create Environment Config Files

**`envs/dev.json`:**

```json
{
  "name": "MyApp (Dev)",
  "slug": "myapp_dev",
  "bundleIdentifier": "com.company.myapp.dev",
  "apiURL": "https://api-dev.example.com",
  "analyticsURL": "https://analytics-dev.example.com",
  "projectId": "your-expo-project-id-dev",
  "owner": "your-expo-username",
  "updatesUrl": "https://u.expo.dev/your-project-id-dev",
  "stripePublishableKey": "pk_test_...",
  "sentryDSN": ""
}
```

**`envs/staging.json`:**

```json
{
  "name": "MyApp (Staging)",
  "slug": "myapp_staging",
  "bundleIdentifier": "com.company.myapp.staging",
  "apiURL": "https://api-staging.example.com",
  "analyticsURL": "https://analytics-staging.example.com",
  "projectId": "your-expo-project-id-staging",
  "owner": "your-expo-username",
  "updatesUrl": "https://u.expo.dev/your-project-id-staging",
  "stripePublishableKey": "pk_test_...",
  "sentryDSN": ""
}
```

**`envs/production.json`:**

```json
{
  "name": "MyApp",
  "slug": "myapp",
  "bundleIdentifier": "com.company.myapp",
  "apiURL": "https://api.example.com",
  "analyticsURL": "https://analytics.example.com",
  "projectId": "your-expo-project-id-prod",
  "owner": "your-expo-username",
  "updatesUrl": "https://u.expo.dev/your-project-id-prod",
  "stripePublishableKey": "pk_live_...",
  "sentryDSN": "https://...@sentry.io/..."
}
```

### 8.3 Create Environment Switching Script

**`scripts/set-env.js`:**

```javascript
const fs = require('fs');
const path = require('path');

const ENV = process.argv[2] || 'dev';
const ENV_FILE = path.join(__dirname, '..', 'envs', `${ENV}.json`);
const APP_JSON = path.join(__dirname, '..', 'app.json');

if (!fs.existsSync(ENV_FILE)) {
  console.error(`Environment file not found: ${ENV_FILE}`);
  const envsDir = path.join(__dirname, '..', 'envs');
  if (fs.existsSync(envsDir)) {
    const available = fs.readdirSync(envsDir)
      .filter(f => f.endsWith('.json'))
      .map(f => f.replace('.json', ''))
      .join(', ');
    console.log(`Available environments: ${available}`);
  }
  process.exit(1);
}

const envConfig = JSON.parse(fs.readFileSync(ENV_FILE, 'utf8'));

// Generate app.json from environment config
const appConfig = {
  expo: {
    name: envConfig.name,
    slug: envConfig.slug,
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: envConfig.bundleIdentifier,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      package: envConfig.bundleIdentifier,
    },
    web: {
      favicon: './assets/favicon.png',
    },
    extra: {
      apiURL: envConfig.apiURL,
      analyticsURL: envConfig.analyticsURL,
      stripePublishableKey: envConfig.stripePublishableKey,
      sentryDSN: envConfig.sentryDSN,
      eas: {
        projectId: envConfig.projectId,
      },
    },
    owner: envConfig.owner,
    updates: {
      url: envConfig.updatesUrl,
    },
    runtimeVersion: {
      policy: 'appVersion',
    },
  },
};

fs.writeFileSync(APP_JSON, JSON.stringify(appConfig, null, 2));

console.log(`Environment set to: ${ENV}`);
console.log(`Bundle ID: ${envConfig.bundleIdentifier}`);
console.log(`API URL: ${envConfig.apiURL}`);
console.log(`\nReload Metro bundler (press 'r' in terminal) to apply changes`);
```

### 8.4 Add npm Scripts

Update `package.json`:

```json
{
  "scripts": {
    "start": "expo start",
    "env:dev": "node scripts/set-env.js dev",
    "env:staging": "node scripts/set-env.js staging",
    "env:prod": "node scripts/set-env.js production",
    "start:dev": "npm run env:dev && expo start",
    "start:staging": "npm run env:staging && expo start",
    "start:prod": "npm run env:prod && expo start"
  }
}
```

### 8.5 Update .gitignore

Add to `.gitignore`:

```
# Environment configs (NEVER commit secrets!)
/envs/
app.json
```

### 8.6 Create Example Templates for Team

```bash
mkdir envs-examples
```

**`envs-examples/dev.example.json`:**

```json
{
  "name": "MyApp (Dev)",
  "slug": "myapp_dev",
  "bundleIdentifier": "com.company.myapp.dev",
  "apiURL": "REPLACE_WITH_DEV_API_URL",
  "analyticsURL": "REPLACE_WITH_ANALYTICS_URL",
  "projectId": "REPLACE_WITH_EXPO_PROJECT_ID",
  "owner": "REPLACE_WITH_EXPO_USERNAME",
  "updatesUrl": "REPLACE_WITH_UPDATES_URL",
  "stripePublishableKey": "REPLACE_WITH_STRIPE_KEY",
  "sentryDSN": ""
}
```

Commit `envs-examples/` to git, but **NOT** `envs/`.

### 8.7 Use Environment Variables in Code

**`src/constants/config.ts`:**

```typescript
import Constants from 'expo-constants';

export const API_URL = Constants.expoConfig?.extra?.apiURL ?? 'https://api.example.com';
export const ANALYTICS_URL = Constants.expoConfig?.extra?.analyticsURL;
export const STRIPE_KEY = Constants.expoConfig?.extra?.stripePublishableKey;
export const SENTRY_DSN = Constants.expoConfig?.extra?.sentryDSN;

// TypeScript type-safe access
type AppConfig = {
  apiURL: string;
  analyticsURL: string;
  stripePublishableKey: string;
  sentryDSN: string;
};

export const getConfig = (): AppConfig => {
  return Constants.expoConfig?.extra as AppConfig;
};
```

### 8.8 Usage

Switch environments:

```bash
# Switch to dev and start
npm run start:dev

# Or switch separately
npm run env:staging
npm start
# Then press 'r' in Metro bundler to reload

# Build for specific environment
npm run env:prod
eas build --platform ios --profile production
```

First-time setup for new developers:

```bash
# 1. Copy examples to envs/
cp -r envs-examples envs

# 2. Fill in real values in envs/*.json
# 3. Start with dev environment
npm run start:dev
```

> **Checkpoint:** Environment variables configured with script-based switching

---

## Step 9: Setup EAS Build

### 9.1 Install EAS CLI

```bash
npm install -g eas-cli
```

### 9.2 Login to Expo

```bash
eas login
```

Enter your Expo credentials.

### 9.3 Configure EAS

```bash
eas build:configure
```

This creates `eas.json`:

```json
{
  "cli": {
    "version": ">= 5.9.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {}
  }
}
```

### 9.4 Update app.json

Add EAS project ID:

```json
{
  "expo": {
    "name": "YourAppName",
    "slug": "your-app-slug",
    "version": "1.0.0",
    "extra": {
      "eas": {
        "projectId": "your-project-id"
      }
    }
  }
}
```

Get project ID:

```bash
eas project:info
```

> **Checkpoint:** EAS Build configured

---

## Step 10: Setup OTA Updates

### 10.1 Install Expo Updates

```bash
npx expo install expo-updates
```

### 10.2 Configure Updates in app.json

```json
{
  "expo": {
    "updates": {
      "enabled": true,
      "checkAutomatically": "ON_LOAD",
      "fallbackToCacheTimeout": 0,
      "url": "https://u.expo.dev/[your-project-id]"
    },
    "runtimeVersion": {
      "policy": "appVersion"
    }
  }
}
```

### 10.3 Add Update Check in App

Update `app/_layout.tsx`:

```typescript
import '../global.css';
import { useEffect } from 'react';
import * as Updates from 'expo-updates';
import { Stack } from 'expo-router';

const RootLayout = () => {
  useEffect(() => {
    const checkUpdates = async () => {
      if (__DEV__) return;

      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
        }
      } catch (error) {
        console.error('Update check failed:', error);
      }
    };

    checkUpdates();
  }, []);

  return <Stack />;
};

export default RootLayout;
```

### 10.4 Publish OTA Update

```bash
# Publish to production channel
eas update --branch production --message "Initial release"

# Publish to preview channel
eas update --branch preview --message "Test update"
```

> **Checkpoint:** OTA Updates configured

---

## Step 11: Setup CI/CD (GitHub Actions) — OPTIONAL

> **Цей крок ОПЦІОНАЛЬНИЙ** — пропустіть якщо:
> - Ви один розробник або невелика команда (1-2 особи)
> - Ви робите builds вручну через `eas build`
> - У вас немає потреби в автоматичних builds
>
> **Використовуйте GitHub Actions якщо:**
> - Команда 3+ розробників
> - Хочете автоматичні builds при кожному PR
> - Потрібне автоматичне тестування перед merge
> - Хочете автоматичний deploy після merge в main

**Що таке GitHub Actions?**
CI/CD інструмент вбудований в GitHub, який автоматично запускає команди (build, test, deploy) при push/PR.

### 11.1 Create GitHub Repository

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/your-repo.git
git push -u origin main
```

### 11.2 Add GitHub Secrets

Go to your GitHub repo: **Settings → Secrets and variables → Actions → New repository secret**

Add these secrets:
- `EXPO_TOKEN` — Get from `eas whoami --json` or create at expo.dev/settings/access-tokens

### 11.3 Create GitHub Actions Workflow (Optional)

Тільки якщо потрібна автоматизація!

Create `.github/workflows/eas-build.yml`:

```yaml
name: EAS Build

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Setup Expo
        uses: expo/expo-github-action@v8
        with:
          expo-version: latest
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}

      - name: Install dependencies
        run: npm ci

      - name: Run tests (optional)
        run: npm test || echo "No tests configured"

      - name: Build iOS (Preview)
        run: eas build --platform ios --profile preview --non-interactive

      - name: Build Android (Preview)
        run: eas build --platform android --profile preview --non-interactive
```

**Що це робить:**
- При кожному push в main — автоматично запускає build
- При створенні PR — запускає тести та preview build
- Не треба вручну запускати `eas build`

> **Checkpoint:** GitHub repository created (CI/CD optional)

---

## Step 12: Build and Deploy

### 12.1 Build Development Version

```bash
# iOS simulator build (macOS only)
eas build --profile development --platform ios

# Android APK for testing
eas build --profile preview --platform android
```

### 12.2 Build Production Version

```bash
# Build for both platforms
eas build --profile production --platform all

# Or separately
eas build --profile production --platform ios
eas build --profile production --platform android
```

### 12.3 Submit to Stores

```bash
# Submit to both stores
eas submit --platform all

# Or separately
eas submit --platform ios
eas submit --platform android
```

> **Checkpoint:** App built and ready for deployment

---

## Step 13: Testing on Devices

### 13.1 Install on iOS Device (TestFlight)

After building with `--profile preview`:
1. Download IPA from EAS dashboard
2. Upload to App Store Connect
3. Submit for TestFlight review
4. Share TestFlight link with testers

### 13.2 Install on Android Device (Direct APK)

After building with `--profile preview`:
1. Download APK from EAS dashboard
2. Send APK to testers
3. Install on device (enable "Install from unknown sources")

---

## Troubleshooting

### Common Issues

**Issue: Metro bundler cache errors**
```bash
npx expo start --clear
```

**Issue: TypeScript errors after installing packages**
```bash
npm install
npx expo start
```

**Issue: NativeWind styles not applying**
```bash
# Clear Metro cache
npx expo start --clear

# Verify global.css is imported in app/_layout.tsx
```

**Issue: EAS Build fails**
```bash
# Check build logs
eas build:list

# View specific build logs
eas build:view [build-id]
```

**Issue: OTA Updates not working**
```bash
# Check update status
eas update:list

# Verify runtimeVersion matches
```

---

## Cheat Sheet

### Useful Commands

**Development:**
```bash
npx expo start              # Start dev server
npx expo start --clear      # Clear cache and start
npx expo start --ios        # Start iOS simulator
npx expo start --android    # Start Android emulator
```

**Building:**
```bash
eas build --profile development --platform ios
eas build --profile preview --platform android
eas build --profile production --platform all
```

**Updates:**
```bash
eas update --branch production --message "Bug fix"
eas update --branch preview --message "New feature test"
eas update:list             # List all updates
```

**Submission:**
```bash
eas submit --platform ios
eas submit --platform android
eas submit --platform all
```

**Debugging:**
```bash
npx expo doctor             # Check project health
npx expo install --check    # Check for outdated packages
npx expo install --fix      # Fix package versions
```

---

## Next Steps

After completing this tutorial:

- Read Best Practices guide for coding guidelines
- Setup error tracking (Sentry, Bugsnag)
- Configure analytics (Firebase Analytics, Amplitude)
- Add push notifications (Expo Notifications)
- Implement deep linking
- Setup app icons and splash screens
- Configure App Store metadata
- Create app preview videos

---

## Important Notes

### Security
- Never commit `.env` files
- Use Expo Secure Store for sensitive data
- Enable SSL pinning for production
- Obfuscate JavaScript code for production builds

### Performance
- Use `expo-image` for images (automatic caching)
- Optimize images (use WebP format)
- Implement code splitting for large apps
- Use FlatList for long lists

### Monitoring
- Setup error tracking from day 1
- Monitor app performance (startup time, crashes)
- Track user analytics
- Monitor API response times
