# React Native: Best Practices

## 0. Вибір Стека та Інструментів

### 0.1 Expo vs Bare React Native

**Рекомендація: Використовуйте Expo для 95% проєктів**

**Чому Expo:**
- Швидкий старт без налаштування нативних середовищ (Xcode, Android Studio)
- Expo Prebuild — повний доступ до нативного коду коли потрібно
- OTA Updates — оновлення без проходження App Store review
- Вбудовані бібліотеки: camera, notifications, updates, файлова система
- Expo Router — сучасна файлова маршрутизація
- EAS Build/Submit — CI/CD в один клік
- Expo Dev Client — повноцінний debugger навіть з native modules

**Коли використовувати bare React Native:**
- Потрібна глибока інтеграція з існуючим нативним кодом (brownfield app)
- Специфічні вимоги до розміру APK/IPA (Expo додає ~2-3MB)
- Потрібен повний контроль над нативним build process з першого дня

> **Золоте правило:** Починайте з Expo managed → при необхідності переходьте на Expo prebuild → тільки якщо це не вистачає, йдіть на bare RN

### 0.2 Expo Prebuild — Коли використовувати

Expo Prebuild = Expo managed workflow + доступ до нативних папок `ios/` та `android/`

**Використовуйте prebuild коли:**
- Потрібні native modules які не підтримує Expo SDK
- Треба редагувати Info.plist, AndroidManifest.xml, нативні налаштування
- Кастомні native fonts, splash screens, app icons з особливими вимогами
- Інтеграція з third-party SDK (Firebase з кастомними конфігами, analytics)

**Як працює:**

```bash
# Генерує ios/ та android/ папки з app.json конфігурації
npx expo prebuild

# Після змін в app.json — перегенерувати
npx expo prebuild --clean
```

> **Важливо:**
> Після prebuild НЕ комітьте `ios/` та `android/` в git (додайте в `.gitignore`).
> Генеруйте їх кожен раз перед build через EAS або локально.
> Зберігайте всі налаштування в `app.json`/`app.config.js`.

### 0.3 OTA Updates — ОБОВ'ЯЗКОВО ДЛЯ DEV

OTA (Over-The-Air) Updates — критично важлива фіча для production додатків.

**Чому це обов'язково:**
- Виправлення багів без чекання App Store/Google Play review (1-7 днів)
- A/B тестування та feature flags
- Rollback до попередньої версії за секунди
- Поступовий rollout (10% → 50% → 100% користувачів)

**Що можна оновлювати через OTA:**
- JavaScript код (вся бізнес-логіка, UI, screens)
- Assets (images, fonts, JSON конфіги)
- **НЕ** нативний код (Java, Kotlin, Swift, Objective-C) — потрібен новий build

**Налаштування Expo Updates:**

```bash
npx expo install expo-updates
```

```json
{
  "expo": {
    "updates": {
      "enabled": true,
      "checkAutomatically": "ON_LOAD",
      "fallbackToCacheTimeout": 0,
      "url": "https://u.expo.dev/[project-id]"
    },
    "runtimeVersion": {
      "policy": "appVersion"
    }
  }
}
```

**Deployment:**

```bash
# Публікація OTA update (не потребує нового build)
eas update --branch production --message "Fix login bug"

# Для різних каналів
eas update --branch preview --message "New feature test"
eas update --branch development --message "Dev test"
```

**Best Practices для OTA:**
- Тестуйте оновлення на preview каналі перед production
- Використовуйте `runtimeVersion` щоб уникнути несумісних оновлень
- Завжди додавайте `--message` для відстеження змін
- Налаштуйте rollback strategy (зберігайте попередні версії)

**Альтернативи для bare React Native:**
- CodePush (Microsoft) — для bare RN, старіший, менш зручний
- Expo Updates — працює навіть у bare RN через config plugin

### 0.4 Навігація — Expo Router vs React Navigation

Вибір залежить від проєкту:

#### Expo Router (File-based routing)

**Використовуйте якщо:**
- Ваш проєкт на Expo managed/prebuild
- Хочете Next.js-style файлову маршрутизацію
- Потрібен Deep linking з коробки
- SEO для web версії (Expo supports web)
- Новий проєкт з нуля

**Приклад структури:**

```
app/
  _layout.tsx           → Root layout
  (tabs)/
    _layout.tsx         → Tab navigator
    index.tsx           → Home tab
    profile.tsx         → Profile tab
  (auth)/
    login.tsx           → Login screen
    register.tsx        → Register screen
  [id].tsx              → Dynamic route (user/123)
  +not-found.tsx        → 404 page
```

**Переваги:**
- Менше boilerplate коду
- Deep links автоматично (`app://home`, `app://profile`)
- Type-safe navigation через `useLocalSearchParams<Type>()`
- Легше refactoring (перейменував файл = змінився route)

**Недоліки:**
- Менше контролю над navigation state
- Складніше для legacy проєктів (міграція)
- Прив'язка до Expo (хоча можна використовувати в bare RN)

#### React Navigation (Component-based routing)

**Використовуйте якщо:**
- Bare React Native проєкт
- Legacy проєкт, який вже використовує React Navigation
- Потрібен повний контроль над navigation state
- Складні navigation patterns (custom navigators)

**Приклад структури:**

```typescript
// src/navigation/AppNavigator.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

const AppNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Tabs" component={TabNavigator} />
  </Stack.Navigator>
);
```

**Переваги:**
- Повний контроль над navigation state
- Більше готових navigators (Drawer, Material Top Tabs)
- Працює в будь-якому React Native проєкті

**Недоліки:**
- Більше boilerplate коду
- Deep linking потребує ручного налаштування
- Type-safety складніше налаштувати

**Рекомендація:**
- Новий Expo проєкт → **Expo Router**
- Bare React Native проєкт → **React Navigation**
- Legacy Expo з React Navigation → залишайте React Navigation, міграція не обов'язкова

---

## 1. Архітектура та Проєктування

### 1.1 Принципи проєктування

**SOLID принципи:** Завжди дотримуйтесь принципів Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion.

**S - Single Responsibility (Єдина відповідальність)**
- Погано: Компонент `UserProfile` який робить API запити, валідацію, навігацію і рендерінг
- Добре: `UserProfileUI` (тільки рендер), `useUserProfile` (логіка), `userService` (API)

**O - Open/Closed (Відкритість/Закритість)**
- Погано: Змінювати `PaymentButton` кожен раз для нового способу оплати
- Добре: `PaymentButton` приймає `onPress` prop, логіка платежів в окремих service файлах

**L - Liskov Substitution (Підстановка Лісков)**
- Погано: `TextButton extends PrimaryButton` але не підтримує всі його props
- Добре: Спільний інтерфейс `BaseButtonProps`, різні реалізації

**I - Interface Segregation (Розділення інтерфейсів)**
- Погано: Один гігантський `UserScreenProps` з 20+ полями для всіх можливих станів
- Добре: Окремі `LoginScreenProps`, `ProfileScreenProps`, `SettingsScreenProps`

**D - Dependency Inversion (Інверсія залежностей)**
- Погано: Компонент безпосередньо викликає `fetch('/api/users')` всередині
- Добре: Компонент отримує `fetchUsers` через props або кастомний hook з service

**DRY (Don't Repeat Yourself):**
- Погано: Копіювати одну й ту саму валідацію телефону в 5 різних екранах
- Добре: Створити `validatePhone()` в `utils/validators.ts` і `usePhoneValidation` hook

**KISS (Keep It Simple, Stupid):**
- Погано: Компонент з 10 вкладеними `useEffect`, 15 станами і 300 рядків коду
- Добре: Розбити на менші компоненти, винести логіку в кастомні hooks

**YAGNI (You Aren't Gonna Need It):**
- Погано: "Давайте зробимо систему темізації з 50 темами, хоча зараз потрібна тільки світла"
- Добре: "Зробимо світлу тему, але структуру `colors.ts` так, щоб легко додати темну"

### 1.2 Структура проєкту

Універсальна структура (працює для Expo Router та React Navigation):

```
# Для Expo Router
/app                         # Expo Router - файлова маршрутизація
  /(tabs)                    # Tab navigation group
  /(auth)                    # Auth stack group
  _layout.tsx                # Root layout

# Для React Navigation
/src/navigation              # Navigation (тільки для React Navigation)
  AppNavigator.tsx           # Root navigator
  TabNavigator.tsx           # Tabs
  AuthNavigator.tsx          # Auth stack

# Загальна структура (для всіх проєктів)
/src
  /components                # Переиспользуемі UI компоненти
    /buttons                 # PrimaryButton, TextButton, IconButton
    /inputs                  # AppTextInput, PhoneInput, PINInput
    /common                  # Badge, Avatar, Divider, Card
    /modals                  # BottomSheet, AlertModal, ConfirmModal
  /screens                   # Screen UI компоненти (тільки UI, БЕЗ логіки)
    LoginScreenUI.tsx        # Приймає дані через props
    ProfileScreenUI.tsx
    HomeScreenUI.tsx
  /hooks                     # Кастомні React hooks
    useBoolean.ts            # Стан boolean з helpers
    useAuth.ts               # Логіка аутентифікації
    useKeyboard.ts           # Keyboard handling
    useAppState.ts           # App background/foreground tracking
  /services                  # API та зовнішні сервіси
    api/
      auth.ts                # authService.login(), register()
      user.ts                # userService.getProfile(), updateProfile()
      client.ts              # Axios instance з interceptors
    analytics/
      analytics.ts           # Firebase Analytics, Amplitude
    notifications/
      push.ts                # Push notifications logic
  /store                     # Zustand stores для глобального стану
    auth.ts                  # useAuthStore - токени, user info
    app.ts                   # useAppStore - глобальні settings
    cart.ts                  # useCartStore - e-commerce cart (приклад)
  /utils                     # Допоміжні функції
    validators.ts            # validatePhone, validateEmail, validateCard
    formatters.ts            # formatPhoneNumber, formatCurrency, formatDate
    helpers.ts               # capitalizeFirstLetter, sleep, debounce
    permissions.ts           # Camera, location, notifications permissions
  /constants                 # Константи проєкту
    colors.ts                # Кольори (BRAND_PRIMARY, TEXT_PRIMARY)
    layout.ts                # SCREEN_WIDTH, SCREEN_HEIGHT, SPACING
    config.ts                # API_URL, APP_VERSION, FEATURE_FLAGS
    strings.ts               # Статичні тексти (або i18n)
  /types                     # TypeScript типи і інтерфейси
    api.ts                   # Response типи для API
    navigation.ts            # Route params типи (для обох навігацій)
    models.ts                # User, Transaction, Product, Order
  /assets                    # Статичні файли
    /images                  # PNG, JPG, WebP
    /fonts                   # Custom fonts
    /lottie                  # Lottie animations

# Root рівень
/android                     # Android native (якщо prebuild/bare)
/ios                         # iOS native (якщо prebuild/bare)
app.json                     # Expo configuration
package.json
tsconfig.json
.env                         # Environment variables
.env.production
.env.development
```

### 1.3 Screen Architecture: Logic/UI Separation

**КРИТИЧНО ВАЖЛИВО:** Кожен екран ЗАВЖДИ розділяється на 2 частини.

#### Для Expo Router

Route файл (в `app/`) — Логіка:

```typescript
// app/(auth)/login.tsx
import { useState } from 'react';
import { router } from 'expo-router';
import LoginScreenUI from '@/screens/LoginScreenUI';
import { authService } from '@/services/api/auth';
import { useAuthStore } from '@/store/auth';

const LoginRoute = () => {
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore(s => s.login);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await authService.login(phone);
      await login(response.token);
      router.replace('/(tabs)/home');
    } catch (error) {
      alert('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginScreenUI
      phone={phone}
      onPhoneChange={setPhone}
      onSubmit={handleSubmit}
      isLoading={isLoading}
    />
  );
};

export default LoginRoute;
```

#### Для React Navigation

Container файл (поруч з навігацією або в `src/screens/`) — Логіка:

```typescript
// src/screens/LoginScreen.tsx
import { useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import LoginScreenUI from './LoginScreenUI';
import { authService } from '@/services/api/auth';
import { useAuthStore } from '@/store/auth';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const LoginScreen = ({ navigation }: Props) => {
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore(s => s.login);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await authService.login(phone);
      await login(response.token);
      navigation.replace('Tabs');
    } catch (error) {
      alert('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginScreenUI
      phone={phone}
      onPhoneChange={setPhone}
      onSubmit={handleSubmit}
      isLoading={isLoading}
    />
  );
};

export default LoginScreen;
```

#### Screen UI (однаковий для обох)

```typescript
// src/screens/LoginScreenUI.tsx
import { View, Text } from 'react-native';
import AppTextInput from '@/components/AppTextInput';
import PrimaryButton from '@/components/PrimaryButton';

type LoginScreenUIProps = {
  phone: string;
  onPhoneChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
};

const LoginScreenUI = ({
  phone,
  onPhoneChange,
  onSubmit,
  isLoading,
}: LoginScreenUIProps) => {
  return (
    <View className="flex-1 bg-white px-6 pt-20">
      <Text className="text-3xl font-bold mb-8">Login</Text>

      <AppTextInput
        label="Phone number"
        value={phone}
        onChangeText={onPhoneChange}
        placeholder="+380 XX XXX XX XX"
        keyboardType="phone-pad"
      />

      <PrimaryButton
        text="Continue"
        onPress={onSubmit}
        isLoading={isLoading}
        className="mt-6"
      />
    </View>
  );
};

export default LoginScreenUI;
```

**Переваги:**
- UI можна тестувати окремо (просто передай mock props)
- Легко змінити навігаційну бібліотеку (міграція Expo Router <-> React Navigation)
- UI переиспользується з різною логікою
- Легко знайти код: логіка в route/screen файлі, UI в `src/screens/`

---

## 2. Стилізація

### 2.1 NativeWind vs StyleSheet vs Styled Components

**Рекомендація: NativeWind v4 для 95% проєктів**

| Підхід | Pros | Cons |
|---|---|---|
| NativeWind | Tailwind синтаксис, швидко | Потрібна компіляція |
| StyleSheet | Native, нічого не треба | Багато boilerplate |
| Styled Components | CSS-in-JS, динамічні стилі | Performance overhead |

**Використовуйте NativeWind:**

```tsx
// Добре
<View className="flex-1 bg-white px-6 pt-20">
  <Text className="text-3xl font-bold text-gray-900">Title</Text>
</View>

// Погано - StyleSheet
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  title: { fontSize: 30, fontWeight: 'bold' },
});
```

**Налаштування NativeWind v4:**

```bash
npm install nativewind@^4.0.0 tailwindcss
```

```javascript
// tailwind.config.js
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
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

```javascript
// babel.config.js
module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    'nativewind/babel',
    // інші плагіни
  ],
};
```

```typescript
// app/_layout.tsx або src/App.tsx
import '../global.css'; // Tailwind styles

const RootLayout = () => {
  return <Stack />;
};
```

**Arbitrary values:**

```tsx
<View className="h-[50px] w-[250px] rounded-[12px] top-[60px]" />
```

**cssInterop для сторонніх бібліотек:**

```typescript
import { cssInterop } from 'nativewind';
import Animated from 'react-native-reanimated';

cssInterop(Animated.View, { className: 'style' });

<Animated.View className="bg-white rounded-lg" />
```

### 2.2 Глобальні константи

ЗАВЖДИ використовуйте константи замість hardcoded значень:

```typescript
// src/constants/layout.ts
import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export const SCREEN_WIDTH = width;
export const SCREEN_HEIGHT = height;
export const IS_SMALL_DEVICE = width < 375;
export const IS_IOS = Platform.OS === 'ios';
export const IS_ANDROID = Platform.OS === 'android';
```

```typescript
// src/constants/colors.ts
export const BRAND_PRIMARY = '#6366F1';
export const BRAND_SECONDARY = '#EC4899';
export const TEXT_PRIMARY = '#111827';
export const TEXT_SECONDARY = '#6B7280';
export const BACKGROUND = '#FFFFFF';
export const ERROR = '#EF4444';
export const SUCCESS = '#10B981';
```

```typescript
// src/constants/spacing.ts
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};
```

> **Правило:** Якщо значення використовується в 2+ файлах — воно має бути в `constants/`

---

## 3. Компоненти та Performance

### 3.1 Вибір правильних компонентів

**Pressable замість TouchableOpacity:**

```tsx
// Добре - сучасний API, кращий performance
import { Pressable } from 'react-native';

<Pressable onPress={handlePress}>
  {({ pressed }) => (
    <Text style={{ opacity: pressed ? 0.7 : 1 }}>Press me</Text>
  )}
</Pressable>
```

**expo-image (Expo) або react-native-fast-image (bare RN):**

```tsx
// Expo
import { Image } from 'expo-image';

<Image
  source={{ uri: avatarUrl }}
  placeholder={{ blurhash }}
  contentFit="cover"
  transition={200}
  className="w-20 h-20 rounded-full"
/>

// Bare React Native
import FastImage from 'react-native-fast-image';

<FastImage
  source={{ uri: avatarUrl, priority: FastImage.priority.high }}
  style={{ width: 80, height: 80, borderRadius: 40 }}
/>
```

**НІКОЛИ `<Text onPress={...}>`:**

```tsx
// Добре - Pressable або кастомний TextButton
<Pressable onPress={handlePress}>
  <Text className="text-blue-500 underline">Click here</Text>
</Pressable>
```

### 3.2 React.memo для оптимізації

```typescript
type CardProps = {
  title: string;
  subtitle: string;
  onPress: () => void;
};

const Card = React.memo<CardProps>(({ title, subtitle, onPress }) => {
  return (
    <Pressable onPress={onPress} className="bg-white rounded-lg p-4">
      <Text className="text-lg font-bold">{title}</Text>
      <Text className="text-sm text-gray-600">{subtitle}</Text>
    </Pressable>
  );
});

export default Card;
```

### 3.3 React Compiler (React 19+)

**НЕ ВИКОРИСТОВУЙТЕ `useCallback` та `useMemo` якщо у вас React 19+ з Compiler:**

```typescript
// Добре - React Compiler автоматично мемоізує
const handleSubmit = () => {
  // ...
};

// Погано - не потрібно з React Compiler
const handleSubmit = useCallback(() => {
  // ...
}, [dependency]);
```

**Налаштування React Compiler (Expo SDK 54+):**

```javascript
// babel.config.js
module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    'react-compiler/babel',
    // інші плагіни
  ],
};
```

---

## 4. State Management

### 4.1 Zustand + MMKV (рекомендовано)

**Чому Zustand:**
- Простіший за Redux (менше boilerplate)
- TypeScript-friendly
- Хуки з коробки
- DevTools підтримка
- Middleware (persist, immer, devtools)

**Чому MMKV для persist:**
- Найшвидший storage для React Native (~30x швидше за AsyncStorage)
- Синхронний API
- Підтримка всіх типів (string, number, boolean, object)

**Налаштування:**

```bash
npm install zustand react-native-mmkv
```

```typescript
// src/store/auth.ts
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
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
```

**Використання в компонентах:**

```typescript
// Добре - селектори (ре-рендер тільки при зміні user)
const user = useAuthStore(s => s.user);
const logout = useAuthStore(s => s.logout);

// Погано - ре-рендер на будь-яку зміну store
const { user, logout } = useAuthStore();
```

**Для множинних значень - shallow compare:**

```typescript
import { shallow } from 'zustand/shallow';

const { token, user } = useAuthStore(
  s => ({ token: s.token, user: s.user }),
  shallow
);
```

---

## 5. Навігація — Типізація та Patterns

### 5.1 Типізація для Expo Router

```typescript
// src/types/navigation.ts
export type RootStackParamList = {
  'index': undefined;
  'profile': { userId: string };
  'settings': { section?: 'account' | 'privacy' };
};

// Використання
import { useLocalSearchParams } from 'expo-router';

type Params = {
  userId: string;
};

const ProfileRoute = () => {
  const { userId } = useLocalSearchParams<Params>();
  // userId: string (typed!)
};
```

### 5.2 Типізація для React Navigation

```typescript
// src/types/navigation.ts
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

export type RootStackParamList = {
  Login: undefined;
  Register: { referralCode?: string };
  Tabs: undefined;
};

export type TabParamList = {
  Home: undefined;
  Profile: { userId: string };
  Settings: undefined;
};

export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;
export type TabNavigationProp = BottomTabNavigationProp<TabParamList>;

// Використання
type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

const RegisterScreen = ({ navigation, route }: Props) => {
  const referralCode = route.params?.referralCode;
  // referralCode: string | undefined (typed!)
};
```

---

## 8. Performance Optimization

### 8.1 FlatList оптимізація

```tsx
const ITEM_HEIGHT = 80;

<FlatList
  data={items}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => <Card {...item} />}

  // Performance оптимізації
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
  windowSize={10}
  maxToRenderPerBatch={10}
  removeClippedSubviews={true}
  initialNumToRender={10}
/>
```

### 8.2 Image optimization

**Використовуйте WebP формат:**
- Розмір в 2-3 рази менший за PNG/JPG
- Підтримка transparency

### 8.3 Bundle Size

**Аналіз:**

```bash
# Для Expo
npx expo export --dump-sourcemap

# Для bare RN
npx react-native-bundle-visualizer
```

**Tree-shaking:**

```typescript
// Добре
import format from 'date-fns/format';
import addDays from 'date-fns/addDays';

// Погано
import { format, addDays } from 'date-fns';
```

---

## 9. Додаткові Рекомендації

### 9.1 Continuous Learning
- Читайте офіційну документацію (React Native, Expo)
- Слідкуйте за updates в екосистемі
- Вивчайте чужий код (GitHub, open source проєкти)

### 9.2 Team Work
- Code review — найкращий спосіб покращити код
- Пишіть чіткі PR descriptions
- Діліться знаннями з командою

### 9.3 Баланс
- **Perfect vs Good Enough:** Не витрачайте тижні на 1% оптимізації
- **Technical Debt:** Іноді швидке рішення OK, але плануйте рефакторинг
- **Pragmatic Approach:** Обирайте рішення залежно від контексту

---

Ці практики покривають 95% сценаріїв React Native розробки. Використовуйте як довідник для вашої команди.
