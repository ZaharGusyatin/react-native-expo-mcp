export const getPerformancePatterns = (): string => {
  return `# Performance Patterns

## List Components

For any list — use a performant list component. NEVER \`ScrollView\` + \`.map()\`.

### LegendList — Recommended

LegendList is the modern choice for React Native (New Architecture, JavaScript-only, no native modules needed).

\`\`\`tsx
import { LegendList } from '@legendapp/list';

const ITEM_HEIGHT = 80;

<LegendList
  data={items}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => <Card {...item} />}
  estimatedItemSize={ITEM_HEIGHT}
  recycleItems   // enables item recycling for better performance
/>
\`\`\`

**estimatedItemSize** is required. If items have variable heights — use the average value.

### FlashList — Battle-tested Alternative

FlashList from Shopify is a drop-in replacement for FlatList. Uses item recycling.

\`\`\`tsx
import { FlashList } from '@shopify/flash-list';

<FlashList
  data={items}
  renderItem={({ item }) => <Card {...item} />}
  estimatedItemSize={ITEM_HEIGHT}
  keyExtractor={(item) => item.id}
/>
\`\`\`

FlashList vs FlatList (Flashlist benchmark):
- FlashList: score 68/100, ~56 FPS stable
- FlatList: score 25/100, visible FPS drops

### FlatList — Fallback

Use when LegendList/FlashList are not an option. Key optimization: always provide \`getItemLayout\` for fixed-height items.

\`\`\`tsx
<FlatList
  data={items}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => <Card {...item} />}
  getItemLayout={(_, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
  windowSize={10}
  maxToRenderPerBatch={10}
  removeClippedSubviews={true}
  initialNumToRender={10}
/>
\`\`\`

## Image Optimization

### WebP Format

ALWAYS use WebP instead of PNG/JPG:
- 2-3x smaller file size
- Transparency support
- Animation support

### expo-image with Caching

\`\`\`tsx
import { Image } from 'expo-image';

<Image
  source={{ uri: imageUrl }}
  placeholder={{ blurhash: 'LKO2:N%2Tw=w]~RBVZRi};RPxuwH' }}
  contentFit="cover"
  transition={200}
  cachePolicy="memory-disk"
  className="w-full h-48 rounded-lg"
/>
\`\`\`

## Tree-Shaking Imports

\`\`\`tsx
// GOOD — tree-shakeable (direct submodule imports)
import format from 'date-fns/format';
import addDays from 'date-fns/addDays';

// BAD — pulls in the entire package
import { format, addDays } from 'date-fns';
\`\`\`

## Avoid Barrel Exports

Barrel exports (\`index.ts\` with re-exports) prevent tree-shaking and increase bundle size.

\`\`\`tsx
// BAD — barrel export in components/index.ts
// Importing one component pulls in all of them
export { Button } from './Button';
export { Card } from './Card';
export { Avatar } from './Avatar';

// GOOD — direct imports
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
\`\`\`

Use \`eslint-plugin-no-barrel-imports\` to enforce this rule.

## Bundle Size Analysis

\`\`\`bash
# Analyze bundle with Expo Atlas (recommended)
EXPO_UNSTABLE_ATLAS=true npx expo start --no-dev
npx expo-atlas

# Source map explorer
npx expo export --dump-sourcemap
npx source-map-explorer output.js
\`\`\`

## React Compiler — Auto Memoization

React Compiler (React 19+) automatically memoizes components and functions. If configured — no need for manual \`useCallback\` and \`useMemo\`.

\`React.memo\` is still useful for list items — it works at the component level.

## Concurrent React Features

### useDeferredValue

For heavy computations — defer rendering of non-critical components:

\`\`\`tsx
import { useDeferredValue, useState } from 'react';

function SearchScreen() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;

  return (
    <View>
      <TextInput value={query} onChangeText={setQuery} placeholder="Search..." />
      <View style={[isStale && { opacity: 0.8 }]}>
        <SearchResults query={deferredQuery} />
      </View>
    </View>
  );
}
\`\`\`

> Wrap computation-heavy components in \`React.memo()\` when passing deferred values.

### useTransition

For non-critical state updates — mark them as low priority:

\`\`\`tsx
import { useState, useTransition } from 'react';

function FilterScreen() {
  const [filter, setFilter] = useState('all');
  const [results, setResults] = useState([]);
  const [isPending, startTransition] = useTransition();

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter); // High priority — updates UI immediately
    startTransition(() => {
      setResults(filterData(newFilter)); // Low priority — doesn't block UI
    });
  };

  return (
    <View>
      <FilterBar filter={filter} onChange={handleFilterChange} />
      {isPending ? <ActivityIndicator /> : <ResultsList data={results} />}
    </View>
  );
}
\`\`\`

**How to choose**: \`useDeferredValue\` — for a single value. \`useTransition\` — for entire state updates.

## InteractionManager

Defer heavy operations until after animations complete:

\`\`\`tsx
import { InteractionManager } from 'react-native';

useEffect(() => {
  const task = InteractionManager.runAfterInteractions(() => {
    // Heavy operation after transition animation finishes
    loadHeavyData();
  });

  return () => task.cancel();
}, []);
\`\`\`

## Animations — Reanimated Worklets

For 60+ FPS animations — use react-native-reanimated worklets that run on the UI thread:

\`\`\`tsx
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

function AnimatedBox() {
  const offset = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: withSpring(offset.value) }],
  }));

  return (
    <Animated.View style={animatedStyle} className="w-20 h-20 bg-primary rounded-lg" />
  );
}
\`\`\`

Worklets run on the UI thread — the JS thread is not blocked. Critical for 60+ FPS animations.

**16 ms budget per frame** (60 FPS) / **8 ms for 120 FPS**. Functions that run longer than this budget will drop frames.

## Performance Checklist

- [ ] Lists: LegendList / FlashList (NOT ScrollView + map)
- [ ] estimatedItemSize for LegendList/FlashList; getItemLayout for FlatList
- [ ] React.memo for list items
- [ ] expo-image instead of Image (caching, blurhash)
- [ ] WebP format for images
- [ ] Tree-shaking imports (direct submodule imports)
- [ ] Avoid barrel exports
- [ ] React Compiler (if React 19+)
- [ ] Reanimated for animations (UI thread worklets)
- [ ] InteractionManager for heavy operations after transition
- [ ] useDeferredValue / useTransition for non-critical updates
`;
}
