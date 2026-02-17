export function getPerformance(): string {
  return `# Best Practice: Performance

## FlatList оптимізація

\`\`\`tsx
<FlatList
  data={products}
  renderItem={({ item }) => <ProductCard product={item} />}
  keyExtractor={(item) => item.id}

  // Performance props
  initialNumToRender={10}        // Скільки рендерити спочатку
  maxToRenderPerBatch={5}        // Скільки рендерити за батч
  windowSize={5}                 // Viewport множник (5 = 2 екрани зверху + поточний + 2 знизу)
  removeClippedSubviews={true}   // Знищувати offscreen views (iOS та Android)

  // Обов'язково для однакових елементів
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
/>
\`\`\`

### FlashList (альтернатива FlatList)

\`\`\`bash
npx expo install @shopify/flash-list
\`\`\`

\`\`\`tsx
import { FlashList } from '@shopify/flash-list';

<FlashList
  data={products}
  renderItem={({ item }) => <ProductCard product={item} />}
  estimatedItemSize={120}  // Обов'язковий prop
  keyExtractor={(item) => item.id}
/>
\`\`\`

FlashList від Shopify — до 5x швидший за FlatList для великих списків.

## Зображення

### WebP формат

WebP = менший розмір + однакова якість:
- 25-35% менше ніж JPEG
- Підтримка прозорості (як PNG, але менший)

\`\`\`tsx
// Використовуйте expo-image (кращий кеш + WebP)
import { Image } from 'expo-image';

<Image
  source={{ uri: 'https://example.com/image.webp' }}
  className="w-full h-48"
  contentFit="cover"
  placeholder={{ blurhash: 'LEHV6nWB2yk8pyo0adR*.7kCMdnj' }}
  transition={200}
  cachePolicy="memory-disk"
/>
\`\`\`

### Оптимізація розмірів

\`\`\`tsx
// Завантажуйте зображення потрібного розміру
const imageUrl = \`https://api.com/images/\${id}?w=\${width * 2}&q=80\`;
// width * 2 для Retina дисплеїв, q=80 достатня якість
\`\`\`

## Bundle Size

### Tree Shaking

\`\`\`tsx
// ✅ Добре — імпорт конкретної іконки
import { Ionicons } from '@expo/vector-icons/Ionicons';

// ❌ Погано — імпорт всього пакету
import { Ionicons } from '@expo/vector-icons';
\`\`\`

\`\`\`tsx
// ✅ Добре — конкретний імпорт з lodash
import debounce from 'lodash/debounce';

// ❌ Погано — весь lodash в бандлі
import { debounce } from 'lodash';
\`\`\`

### Аналіз бандлу

\`\`\`bash
# Expo bundle analysis
npx expo export --dump-sourcemap
npx react-native-bundle-visualizer
\`\`\`

## Мемоізація

\`\`\`tsx
// useMemo — для дорогих обчислень
const sortedProducts = useMemo(
  () => products.sort((a, b) => a.price - b.price),
  [products]
);

// useCallback — для стабільних callbacks в FlatList
const handlePress = useCallback((id: string) => {
  router.push(\`/product/\${id}\`);
}, []);

// React.memo — для list items
const ProductCard = memo(({ product, onPress }: Props) => (
  <Pressable onPress={() => onPress(product.id)}>
    <Text>{product.name}</Text>
  </Pressable>
));
\`\`\`

> З React Compiler (React 19+) мемоізація стає автоматичною. Але для React 18 та старше — використовуйте ручну мемоізацію в performance-critical місцях.

## Reanimated для анімацій

\`\`\`tsx
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';

function AnimatedCard() {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(scale.value) }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPressIn={() => { scale.value = 0.95; }}
        onPressOut={() => { scale.value = 1; }}
      >
        <Text>Press me</Text>
      </Pressable>
    </Animated.View>
  );
}
\`\`\`

> \`react-native-reanimated\` працює на UI thread — анімації залишаються 60fps навіть при завантаженому JS thread.

## Performance Checklist

- [ ] Використовуйте \`expo-image\` замість \`Image\`
- [ ] WebP для всіх зображень де можливо
- [ ] \`FlatList\` або \`FlashList\` для списків (ніколи не \`ScrollView\` + \`map\`)
- [ ] \`React.memo\` для list items
- [ ] Селектори в Zustand (не деструктуризація)
- [ ] Tree shaking imports
- [ ] Release build для performance тестування
- [ ] \`getItemLayout\` для списків з фіксованою висотою
`;
}
