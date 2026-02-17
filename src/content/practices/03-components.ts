export function getComponents(): string {
  return `# Best Practice: Компоненти

## Pressable замість TouchableOpacity

\`TouchableOpacity\` — застарілий. Використовуйте \`Pressable\`:

\`\`\`tsx
import { Pressable, Text } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
}

export function Button({ title, onPress, variant = 'primary', disabled }: ButtonProps) {
  const baseStyles = 'rounded-xl py-3 px-6 items-center';
  const variantStyles = {
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
      className={\`\${baseStyles} \${variantStyles[variant]} \${disabled ? 'opacity-50' : ''}\`}
    >
      <Text className={textStyles[variant]}>{title}</Text>
    </Pressable>
  );
}
\`\`\`

## expo-image замість Image

\`expo-image\` — значно кращий за стандартний \`Image\`:
- Кешування (memory + disk)
- BlurHash / ThumbHash placeholders
- Анімовані переходи
- WebP, AVIF, SVG підтримка

\`\`\`bash
npx expo install expo-image
\`\`\`

\`\`\`tsx
import { Image } from 'expo-image';
import { cssInterop } from 'nativewind';

cssInterop(Image, { className: 'style' });

// Використання:
<Image
  className="w-full h-48 rounded-2xl"
  source={{ uri: product.imageUrl }}
  placeholder={{ blurhash: product.blurhash }}
  contentFit="cover"
  transition={200}
/>
\`\`\`

## React.memo — коли використовувати

\`React.memo\` — для компонентів які часто ререндеряться з однаковими props:

\`\`\`tsx
import { memo } from 'react';

// ✅ Використовуйте memo для елементів списків
export const ProductCard = memo(function ProductCard({
  product,
  onPress,
}: ProductCardProps) {
  return (
    <Pressable onPress={onPress} className="bg-surface rounded-2xl p-3 mb-3">
      <Image className="w-full h-40 rounded-xl" source={{ uri: product.image }} />
      <Text className="text-base font-semibold mt-2">{product.name}</Text>
      <Text className="text-primary font-bold">{product.price} ₴</Text>
    </Pressable>
  );
});

// ❌ Не потрібно memo для:
// - Компонентів які завжди отримують нові props
// - Компонентів які рендеряться рідко
// - Дуже простих компонентів (overhead memo > benefit)
\`\`\`

## React Compiler (React 19+)

React Compiler автоматично оптимізує ререндери:

\`\`\`bash
npx expo install babel-plugin-react-compiler
\`\`\`

\`\`\`js
// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['react-compiler', { target: '19' }],
    ],
  };
};
\`\`\`

> З React Compiler ручний \`memo\`, \`useMemo\`, \`useCallback\` стають опціональними — компілятор робить це автоматично.

## Composable компоненти

\`\`\`tsx
// ✅ Composable — гнучкий
<Card>
  <Card.Header>
    <Card.Title>Замовлення #123</Card.Title>
    <Card.Badge status="active" />
  </Card.Header>
  <Card.Body>
    <OrderItems items={items} />
  </Card.Body>
  <Card.Footer>
    <Button title="Деталі" onPress={handleDetails} />
  </Card.Footer>
</Card>

// ❌ Monolithic — негнучкий
<OrderCard
  title="Замовлення #123"
  status="active"
  items={items}
  onDetails={handleDetails}
/>
\`\`\`

## Типізація компонентів

\`\`\`tsx
import { View, ViewProps, Text, TextProps } from 'react-native';

// Розширення стандартних props
interface CardProps extends ViewProps {
  variant?: 'elevated' | 'outlined';
  children: React.ReactNode;
}

export function Card({ variant = 'elevated', children, className, ...props }: CardProps) {
  const variantStyles = {
    elevated: 'bg-surface shadow-sm',
    outlined: 'bg-surface border border-gray-200',
  };

  return (
    <View className={\`rounded-2xl p-4 \${variantStyles[variant]} \${className ?? ''}\`} {...props}>
      {children}
    </View>
  );
}
\`\`\`
`;
}
