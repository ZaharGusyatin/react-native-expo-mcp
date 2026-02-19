import { PatternSections, resolvePattern } from './pattern-helper';

// ─── Full sections (with code examples) ─────────────────────────────

const sections: Record<string, string> = {
  nativewind: `## NativeWind — Recommended Approach

NativeWind v4 (Tailwind CSS for React Native) — use for 95% of styles.

\`\`\`tsx
// GOOD — NativeWind
<View className="flex-1 bg-white px-6 pt-20">
  <Text className="text-3xl font-bold text-gray-900">Title</Text>
</View>

// BAD — StyleSheet (too much boilerplate)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white', paddingHorizontal: 24, paddingTop: 80 },
  title: { fontSize: 30, fontWeight: 'bold', color: '#111827' },
});
\`\`\``,

  'arbitrary-values': `## Arbitrary Values

For specific values not in Tailwind — use arbitrary values:

\`\`\`tsx
<View className="h-[50px] w-[250px] rounded-[12px] top-[60px]" />
<Text className="text-[#FF5733] text-[17px]">Custom</Text>
\`\`\``,

  'css-interop': `## cssInterop for Third-Party Libraries

When a third-party library does not support \`className\` — use \`cssInterop\`:

\`\`\`tsx
import { cssInterop } from 'nativewind';
import Animated from 'react-native-reanimated';
import { Image } from 'expo-image';

// Register className support
cssInterop(Animated.View, { className: 'style' });
cssInterop(Image, { className: 'style' });

// Now className works
<Animated.View className="bg-white rounded-lg p-4" />
<Image className="w-20 h-20 rounded-full" source={{ uri }} />
\`\`\``,

  'tailwind-config': `## Tailwind Config — Colors and Theme

\`\`\`js
// tailwind.config.js
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
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
};
\`\`\`

Now use in code:
\`\`\`tsx
<View className="bg-primary" />
<Text className="text-error" />
<View className="bg-background" />
\`\`\``,

  'js-constants': `## JS Constants for Non-Tailwind Values

Tailwind covers styles, but when values are needed in JavaScript (e.g., animations, calculations) — use constants:

\`\`\`tsx
// src/constants/colors.ts
export const colors = {
  primary: '#007AFF',
  primaryLight: '#4DA2FF',
  primaryDark: '#0056B3',
  secondary: '#5856D6',
  error: '#FF3B30',
  success: '#34C759',
  text: {
    primary: '#1C1C1E',
    secondary: '#8E8E93',
  },
} as const;

// src/constants/layout.ts
import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export const SCREEN_WIDTH = width;
export const SCREEN_HEIGHT = height;
export const IS_SMALL_DEVICE = width < 375;
export const IS_IOS = Platform.OS === 'ios';
export const IS_ANDROID = Platform.OS === 'android';

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;
\`\`\`

## Rule: 2+ Files → constants/

If a value (color, size, spacing) is used in 2+ files — it belongs in \`constants/\`.`,

  conditional: `## Conditional Styles

\`\`\`tsx
// Template literals
<View className={\`rounded-xl p-4 \${isActive ? 'bg-primary' : 'bg-gray-200'}\`} />

// Multi-condition
<Pressable
  className={\`py-3 px-6 rounded-xl \${variant === 'primary' ? 'bg-primary' : ''} \${variant === 'outline' ? 'border-2 border-primary' : ''} \${disabled ? 'opacity-50' : ''}\`}
/>
\`\`\``,

  checklist: `## NativeWind Setup Checklist

1. \`tailwind.config.js\` — content paths, presets, theme colors
2. \`global.css\` — \`@tailwind base; @tailwind components; @tailwind utilities;\`
3. \`metro.config.js\` — \`withNativeWind(config, { input: "./global.css" })\`
4. \`nativewind-env.d.ts\` — \`/// <reference types="nativewind/types" />\`
5. \`app/_layout.tsx\` — \`import '../global.css';\`
6. \`babel.config.js\` — \`'nativewind/babel'\` in plugins`,
};

// ─── Compact sections (rules only, no code) ─────────────────────────

const compactSections: Record<string, string> = {
  nativewind: `## NativeWind
- Use NativeWind v4 (Tailwind CSS) for 95% of styles
- \`className\` prop on RN components — no \`StyleSheet.create\`
- Cleaner, less boilerplate, consistent with web Tailwind`,

  'arbitrary-values': `## Arbitrary Values
- For non-standard values: \`h-[50px]\`, \`text-[#FF5733]\`, \`rounded-[12px]\`
- Works for any CSS property`,

  'css-interop': `## cssInterop
- For third-party libs without \`className\` support
- \`cssInterop(Component, { className: 'style' })\`
- Common: \`Animated.View\`, \`expo-image Image\``,

  'tailwind-config': `## Tailwind Config
- \`content\`: \`['./app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}']\`
- \`presets: [require('nativewind/preset')]\`
- Extend \`theme.colors\`: primary, secondary, background, error, success`,

  'js-constants': `## JS Constants
- Colors/layout values needed in JS (animations, calculations) go in \`src/constants/\`
- Use \`as const\` for literal types
- Rule: if a value is used in 2+ files → move to \`constants/\``,

  conditional: `## Conditional Styles
- Template literals: \`\\\`bg-\${isActive ? 'primary' : 'gray-200'}\\\`\`
- Multi-condition: chain ternaries in template string`,

  checklist: `## Setup Checklist
1. \`tailwind.config.js\` (content, presets, theme)
2. \`global.css\` (@tailwind directives)
3. \`metro.config.js\` (withNativeWind)
4. \`nativewind-env.d.ts\` (type reference)
5. \`app/_layout.tsx\` (import global.css)
6. \`babel.config.js\` (nativewind/babel plugin)`,
};

// ─── Export ──────────────────────────────────────────────────────────

const pattern: PatternSections = {
  title: 'Styling Patterns (NativeWind / Tailwind CSS)',
  sections,
  compactSections,
};

export const getStylingPatterns = (topic?: string, compact?: boolean): string =>
  resolvePattern(pattern, topic, compact);
