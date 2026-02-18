export function getScreenArchitecture(): string {
  return `# Screen Architecture: Logic/UI Separation

## The Core Rule

Every screen is ALWAYS split into 2 parts:
1. **Route file** (in \`app/\`) — contains ONLY logic (hooks, store, handlers, navigation)
2. **Screen UI** (in \`src/screens/\`) — contains ONLY UI (props-driven, no hooks except UI-specific)

## Route File (app/) — Logic

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
\`\`\`

## Screen UI (src/screens/) — Pure UI

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
\`\`\`

## Rules

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

3. **UI components do NOT depend on navigation** — no \`router.push()\` inside UI

## Benefits

- UI is independently testable (just pass mock props)
- Easy to swap navigation libraries
- UI is reusable with different logic
- Easy to find code: logic in route file, UI in src/screens/
- Follows SOLID: Single Responsibility Principle
`;
}
