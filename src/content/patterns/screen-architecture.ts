import { PatternSections, resolvePattern } from './pattern-helper';

// ─── Full sections (with code examples) ─────────────────────────────

const sections: Record<string, string> = {
  'core-rule': `## The Core Rule

Every screen is ALWAYS split into 2 parts:
1. **Route file** (in \`app/\`) — contains ONLY logic (hooks, store, handlers, navigation)
2. **Screen UI** (in \`src/screens/\`) — contains ONLY UI (props-driven, no hooks except UI-specific)`,

  'route-file': `## Route File (app/) — Logic

\`\`\`tsx
// app/(auth)/login.tsx
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
        onSuccess: () => router.replace('/(tabs)'),
        onError: () => alert('Login failed'),
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
\`\`\``,

  'screen-ui': `## Screen UI (src/screens/) — Pure UI

\`\`\`tsx
// src/screens/LoginScreenUI.tsx
import { View, Text } from 'react-native';
import { Button } from '@/components/ui/Button';
import { TextInput } from '@/components/ui/TextInput';

type LoginScreenUIProps = {
  email: string;
  password: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
};

const LoginScreenUI = ({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  isLoading,
}: LoginScreenUIProps) => {
  return (
    <View className="flex-1 bg-white px-6 pt-20">
      <Text className="text-3xl font-bold mb-8">Login</Text>

      <TextInput
        label="Email"
        value={email}
        onChangeText={onEmailChange}
        placeholder="user@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        label="Password"
        value={password}
        onChangeText={onPasswordChange}
        secureTextEntry
      />

      <Button
        title="Continue"
        onPress={onSubmit}
        isLoading={isLoading}
        className="mt-6"
      />
    </View>
  );
};

export default LoginScreenUI;
\`\`\``,

  rules: `## Rules

1. **Route file** (\`app/*.tsx\`):
   - Imports store hooks, API hooks, navigation
   - Handles business logic (handleSubmit, handleDelete, etc.)
   - Passes everything via props to the Screen UI
   - Naming: \`LoginRoute\`, \`ProfileRoute\`, \`CatalogRoute\`

2. **Screen UI** (\`src/screens/*UI.tsx\`):
   - Receives EVERYTHING via props — no direct store/API/navigation dependencies
   - Can be tested in isolation (just pass mock props)
   - Naming: \`LoginScreenUI\`, \`ProfileScreenUI\`, \`CatalogScreenUI\`
   - Props interface naming: \`LoginScreenUIProps\`, \`ProfileScreenUIProps\`

3. **UI components do NOT depend on navigation** — no \`router.push()\` inside UI`,

  benefits: `## Benefits

- UI is independently testable (just pass mock props)
- Easy to swap navigation libraries
- UI is reusable with different logic
- Easy to find code: logic in route file, UI in src/screens/
- Follows SOLID: Single Responsibility Principle`,
};

// ─── Compact sections (rules only, no code) ─────────────────────────

const compactSections: Record<string, string> = {
  'core-rule': `## Core Rule
- Every screen = 2 files: Route file (logic) + Screen UI (pure UI)
- Route file in \`app/\` — hooks, store, handlers, navigation
- Screen UI in \`src/screens/\` — props-driven, no direct dependencies`,

  'route-file': `## Route File
- Located in \`app/\` directory
- Imports store hooks, API hooks, navigation
- Handles business logic, passes everything via props to Screen UI
- Naming: \`LoginRoute\`, \`ProfileRoute\`, \`CatalogRoute\``,

  'screen-ui': `## Screen UI
- Located in \`src/screens/\`
- Receives EVERYTHING via props — no store/API/navigation imports
- Testable in isolation (just pass mock props)
- Naming: \`LoginScreenUI\`, \`ProfileScreenUI\`
- Props: \`LoginScreenUIProps\`, \`ProfileScreenUIProps\``,

  rules: `## Rules
- Route file: imports hooks, handles logic, passes props to Screen UI
- Screen UI: props-driven, no direct dependencies, testable in isolation
- UI components NEVER depend on navigation — no \`router.push()\` inside UI`,

  benefits: `## Benefits
- UI independently testable (mock props)
- Easy to swap navigation libraries
- UI reusable with different logic
- Follows SOLID: Single Responsibility Principle`,
};

// ─── Export ──────────────────────────────────────────────────────────

const pattern: PatternSections = {
  title: 'Screen Architecture: Logic/UI Separation',
  sections,
  compactSections,
};

export const getScreenArchitecture = (topic?: string, compact?: boolean): string =>
  resolvePattern(pattern, topic, compact);
