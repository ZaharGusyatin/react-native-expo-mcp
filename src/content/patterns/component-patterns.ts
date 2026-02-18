export const getComponentPatterns = (): string => {
  return `# Component Patterns

## Pressable Instead of TouchableOpacity

ALWAYS use \`Pressable\` instead of \`TouchableOpacity\`.
\`Pressable\` is the modern API with better performance and flexibility.

\`\`\`tsx
import { Pressable, Text } from 'react-native';

// Pressable with visual feedback
<Pressable
  onPress={handlePress}
  className="bg-primary rounded-xl py-3 px-6 active:opacity-80"
>
  <Text className="text-white font-semibold text-center">Press me</Text>
</Pressable>

// Pressable with render function for custom pressed states
<Pressable onPress={handlePress}>
  {({ pressed }) => (
    <Text style={{ opacity: pressed ? 0.7 : 1 }}>Press me</Text>
  )}
</Pressable>
\`\`\`

## expo-image Instead of Image

ALWAYS use \`expo-image\` instead of the standard \`Image\` from react-native.
Benefits: built-in caching, blurhash placeholder, transition animations.

\`\`\`tsx
import { Image } from 'expo-image';

<Image
  source={{ uri: avatarUrl }}
  placeholder={{ blurhash }}
  contentFit="cover"
  transition={200}
  cachePolicy="memory-disk"
  className="w-20 h-20 rounded-full"
/>
\`\`\`

## NEVER \`<Text onPress={...}>\`

Never use \`onPress\` on \`<Text>\`. Always wrap in \`<Pressable>\`.

\`\`\`tsx
// BAD
<Text onPress={handlePress}>Click here</Text>

// GOOD
<Pressable onPress={handlePress}>
  <Text className="text-blue-500 underline">Click here</Text>
</Pressable>
\`\`\`

## React.memo for List Items

Always memoize components rendered in lists (FlatList, FlashList).

\`\`\`tsx
import React from 'react';
import { Pressable, Text } from 'react-native';

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
\`\`\`

## React Compiler (React 19+)

If the project uses React 19+ with React Compiler — do NOT use \`useCallback\` and \`useMemo\` manually. The Compiler handles this automatically.

\`\`\`tsx
// GOOD (with React Compiler)
const handleSubmit = () => {
  // compiler auto-memoizes this
};

// NOT NEEDED with React Compiler
const handleSubmit = useCallback(() => {
  // ...
}, [dependency]);
\`\`\`

React Compiler setup:
\`\`\`js
// babel.config.js
const ReactCompilerConfig = { target: '19' };

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['babel-plugin-react-compiler', ReactCompilerConfig],
    ],
  };
};
\`\`\`

If the compiler is not set up or React < 19 — use \`useCallback\` for handler functions passed as props.

## Composable Components

Break complex components into smaller focused components with clear prop interfaces. Each sub-component does one thing.

\`\`\`tsx
// BAD: One large component with all props mixed together
const ProductCard = ({ product, onBuy, onFavorite, onShare, showRating, showPrice }) => {
  // 200 lines of mixed UI...
};

// GOOD: Split into focused components
type ProductCardProps = {
  children: React.ReactNode;
};

const ProductCard = ({ children }: ProductCardProps) => (
  <View className="bg-white rounded-xl p-4 shadow-sm">{children}</View>
);

type ProductCardImageProps = {
  uri: string;
};

const ProductCardImage = ({ uri }: ProductCardImageProps) => (
  <Image source={{ uri }} className="w-full h-48 rounded-lg" contentFit="cover" />
);

type ProductCardTitleProps = {
  children: string;
};

const ProductCardTitle = ({ children }: ProductCardTitleProps) => (
  <Text className="text-lg font-bold mt-2">{children}</Text>
);

type ProductCardPriceProps = {
  amount: number;
  currency?: string;
};

const ProductCardPrice = ({ amount, currency = 'USD' }: ProductCardPriceProps) => (
  <Text className="text-primary font-semibold">{currency} {amount}</Text>
);

// Usage — compose as needed
<ProductCard>
  <ProductCardImage uri={product.imageUrl} />
  <ProductCardTitle>{product.name}</ProductCardTitle>
  <ProductCardPrice amount={product.price} />
</ProductCard>
\`\`\`

## Uncontrolled TextInput

For TextInput in large forms or on low-performance devices, use the uncontrolled pattern — remove the \`value\` prop and work via a ref.

\`\`\`tsx
// Controlled (standard approach — fine for real-time validation)
const [value, setValue] = useState('');
<TextInput value={value} onChangeText={setValue} />

// Uncontrolled (better performance for simple data-collection forms)
const valueRef = useRef('');
<TextInput
  defaultValue=""
  onChangeText={(text) => { valueRef.current = text; }}
/>
\`\`\`

Use **controlled** when you need real-time validation or input masking.
Use **uncontrolled** when you just collect data to submit (e.g., registration form).

> Note: The controlled TextInput de-synchronization issue (flickering) exists in legacy architecture only. New Architecture resolves it. Uncontrolled is still useful for performance in complex forms.
`;
}
