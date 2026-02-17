export function getStyling(): string {
  return `# Best Practice: Styling (NativeWind v4)

## Чому NativeWind?

- Tailwind CSS синтаксис для React Native
- Utility-first підхід — швидка розробка
- Consistent design через theme tokens
- Підтримка dark mode, responsive, animations

## Design Tokens (theme)

Визначте кольори, розміри, та інші токени в \`tailwind.config.js\`:

\`\`\`js
// tailwind.config.js
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#007AFF',
          light: '#4DA2FF',
          dark: '#0056B3',
        },
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
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
      spacing: {
        '18': '72px',
        '88': '352px',
      },
    },
  },
};
\`\`\`

## Constants як додатковий шар

Для значень які потрібні поза Tailwind:

\`\`\`tsx
// src/constants/colors.ts
export const colors = {
  primary: '#007AFF',
  secondary: '#5856D6',
  background: '#F2F2F7',
  surface: '#FFFFFF',
  error: '#FF3B30',
  success: '#34C759',
} as const;

// src/constants/spacing.ts
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;
\`\`\`

## cssInterop для third-party компонентів

Деякі third-party компоненти не підтримують \`className\`. Використовуйте \`cssInterop\`:

\`\`\`tsx
import { cssInterop } from 'nativewind';
import { Image } from 'expo-image';
import Svg from 'react-native-svg';

// Тепер expo-image підтримує className
cssInterop(Image, { className: 'style' });
cssInterop(Svg, { className: 'style' });

// Використання:
<Image className="w-20 h-20 rounded-full" source={{ uri: avatarUrl }} />
\`\`\`

## Responsive Design

\`\`\`tsx
// Breakpoints працюють як у Tailwind CSS
<View className="flex-row flex-wrap">
  <View className="w-full sm:w-1/2 lg:w-1/3 p-2">
    <ProductCard />
  </View>
</View>

// Platform-specific
<Text className="text-base ios:text-lg android:text-sm">
  Platform-specific text
</Text>
\`\`\`

## Dark Mode

\`\`\`tsx
// Автоматичний dark mode через dark: prefix
<View className="bg-white dark:bg-gray-900">
  <Text className="text-gray-900 dark:text-white">
    Adapts to system theme
  </Text>
</View>
\`\`\`

## Комбінування класів (clsx + tailwind-merge)

Для динамічного комбінування NativeWind класів використовуйте \`clsx\` або \`tailwind-merge\`:

\`\`\`bash
npx expo install clsx tailwind-merge
\`\`\`

\`\`\`tsx
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Утиліта для комбінування
function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

// Використання в компонентах
interface CardProps {
  className?: string;
  highlighted?: boolean;
  children: React.ReactNode;
}

function Card({ className, highlighted, children }: CardProps) {
  return (
    <View className={cn(
      'rounded-2xl p-4 bg-surface',
      highlighted && 'border-2 border-primary',
      className  // дозволяє override ззовні
    )}>
      {children}
    </View>
  );
}
\`\`\`

> \`clsx\` — умовне об'єднання класів. \`tailwind-merge\` — розумне злиття (пізніший клас переважає: \`cn('p-4', 'p-6')\` → \`'p-6'\`).

## Рекомендації

1. **Уникайте StyleSheet.create** — використовуйте className для 90% стилів
2. **Не створюйте wrapper компоненти** тільки для стилів
3. **Використовуйте theme** замість хардкоду кольорів
4. **cssInterop** для сторонніх компонентів
5. **Константи** для значень, які потрібні в JS (наприклад, animation values)
6. **clsx + tailwind-merge** для динамічного комбінування класів в компонентах
`;
}
