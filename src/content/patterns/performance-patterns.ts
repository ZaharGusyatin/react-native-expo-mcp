import { PatternSections, resolvePattern } from './pattern-helper';

// ─── Full sections (with code examples) ─────────────────────────────

const sections: Record<string, string> = {
  lists: `## List Components

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

> Always \`React.memo\` list item components — see \`get-component-patterns\` (topic: react-memo).`,

  images: `## Image Optimization

### WebP Format

ALWAYS use WebP instead of PNG/JPG:
- 2-3x smaller file size
- Transparency support
- Animation support

> Use \`expo-image\` for all images with \`cachePolicy="memory-disk"\` — see \`get-component-patterns\` (topic: expo-image).`,

  'tree-shaking': `## Tree-Shaking Imports

\`\`\`tsx
// GOOD — tree-shakeable (direct submodule imports)
import format from 'date-fns/format';
import addDays from 'date-fns/addDays';

// BAD — pulls in the entire package
import { format, addDays } from 'date-fns';
\`\`\``,

  'barrel-exports': `## Avoid Barrel Exports

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

Use \`eslint-plugin-no-barrel-imports\` to enforce this rule.`,

  bundle: `## Bundle Size Analysis

\`\`\`bash
# Analyze bundle with Expo Atlas (recommended)
EXPO_UNSTABLE_ATLAS=true npx expo start --no-dev
npx expo-atlas

# Source map explorer
npx expo export --dump-sourcemap
npx source-map-explorer output.js
\`\`\``,

  concurrent: `## Concurrent React Features

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

**How to choose**: \`useDeferredValue\` — for a single value. \`useTransition\` — for entire state updates.`,

  'interaction-manager': `## InteractionManager

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
\`\`\``,

  reanimated: `## Animations — Reanimated Worklets

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

**16 ms budget per frame** (60 FPS) / **8 ms for 120 FPS**. Functions that run longer than this budget will drop frames.`,

  checklist: `## Performance Checklist

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
- [ ] useDeferredValue / useTransition for non-critical updates`,
};

// ─── Compact sections (rules only, no code) ─────────────────────────

const compactSections: Record<string, string> = {
  lists: `## Lists
- NEVER use \`ScrollView\` + \`.map()\` for lists
- **LegendList** (recommended): JS-only, New Architecture, \`recycleItems\` prop
- **FlashList** (alternative): Shopify, drop-in FlatList replacement, item recycling
- **FlatList** (fallback): always provide \`getItemLayout\` for fixed-height items
- All require \`estimatedItemSize\` or \`getItemLayout\`
- Props to tune: \`windowSize\`, \`maxToRenderPerBatch\`, \`removeClippedSubviews\`, \`initialNumToRender\`
- Always \`React.memo\` list items — see \`get-component-patterns\` (topic: react-memo)`,

  images: `## Images
- ALWAYS use WebP format (2-3x smaller than PNG/JPG)
- Use \`expo-image\` with \`cachePolicy="memory-disk"\`
- See \`get-component-patterns\` (topic: expo-image) for full expo-image usage`,

  'tree-shaking': `## Tree-Shaking
- Use direct submodule imports: \`import format from 'date-fns/format'\`
- Never: \`import { format } from 'date-fns'\` (pulls entire package)`,

  'barrel-exports': `## Barrel Exports
- Avoid \`index.ts\` re-export barrels — they prevent tree-shaking
- Use direct file imports: \`import { Button } from '@/components/ui/Button'\`
- Enforce with \`eslint-plugin-no-barrel-imports\``,

  bundle: `## Bundle Analysis
- \`EXPO_UNSTABLE_ATLAS=true npx expo start --no-dev\` + \`npx expo-atlas\` (recommended)
- \`npx expo export --dump-sourcemap\` + \`npx source-map-explorer output.js\``,

  concurrent: `## Concurrent React
- \`useDeferredValue\`: defer rendering of a single value (search input → results)
- \`useTransition\`: mark entire state updates as low priority (\`startTransition\`)
- Wrap heavy components in \`React.memo\` when passing deferred values
- Choose: \`useDeferredValue\` for one value, \`useTransition\` for state updates`,

  'interaction-manager': `## InteractionManager
- \`InteractionManager.runAfterInteractions(() => heavyWork())\` — defer after animations
- Always return \`() => task.cancel()\` in useEffect cleanup`,

  reanimated: `## Reanimated
- Use \`react-native-reanimated\` worklets for 60+ FPS animations (runs on UI thread)
- Core: \`useSharedValue\`, \`useAnimatedStyle\`, \`withSpring\` / \`withTiming\`
- 16ms budget per frame (60 FPS) / 8ms for 120 FPS
- JS thread stays free — animations never blocked by business logic`,

  checklist: `## Checklist
- [ ] LegendList / FlashList for lists
- [ ] estimatedItemSize / getItemLayout
- [ ] React.memo for list items
- [ ] expo-image + cachePolicy
- [ ] WebP images
- [ ] Tree-shaking imports
- [ ] No barrel exports
- [ ] React Compiler (React 19+)
- [ ] Reanimated for animations
- [ ] InteractionManager for post-animation work
- [ ] useDeferredValue / useTransition`,
};

// ─── Export ──────────────────────────────────────────────────────────

const pattern: PatternSections = {
  title: 'Performance Patterns',
  sections,
  compactSections,
};

export const getPerformancePatterns = (topic?: string, compact?: boolean): string =>
  resolvePattern(pattern, topic, compact);
