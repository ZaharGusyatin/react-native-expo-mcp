# React Native Optimization: The Ultimate Guide

**By Callstack**

---

## Table of Contents

- [Introduction](#introduction)
  - [Preface](#preface)
  - [How to Read This Book](#how-to-read-this-book)
  - [Why Performance Matters](#why-performance-matters)
- [Part 1: JavaScript](#part-1-javascript)
  - [Introduction](#javascript-introduction)
  - [How to Profile JS and React Code](#how-to-profile-js-and-react-code)
  - [How to Measure JS FPS](#how-to-measure-js-fps)
  - [How to Hunt JS Memory Leaks](#how-to-hunt-js-memory-leaks)
  - [Uncontrolled Components](#uncontrolled-components)
  - [Higher-Order Specialized Components](#higher-order-specialized-components)
  - [Atomic State Management](#atomic-state-management)
  - [Concurrent React](#concurrent-react)
  - [React Compiler](#react-compiler)
  - [High-Performance Animations Without Dropping Frames](#high-performance-animations-without-dropping-frames)
- [Part 2: Native](#part-2-native)
  - [Introduction](#native-introduction)
  - [Understand Platform Differences](#understand-platform-differences)
  - [How to Profile Native Parts of React Native](#how-to-profile-native-parts-of-react-native)
  - [How to Measure TTI](#how-to-measure-tti)
  - [Understanding Native Memory Management](#understanding-native-memory-management)
  - [Understand the Threading Model of Turbo Modules and Fabric](#understand-the-threading-model-of-turbo-modules-and-fabric)
  - [Use View Flattening](#use-view-flattening)
  - [Use Dedicated React Native SDKs Over Web](#use-dedicated-react-native-sdks-over-web)
  - [Make Your Native Modules Faster](#make-your-native-modules-faster)
  - [How to Hunt Memory Leaks](#how-to-hunt-memory-leaks)
- [Part 3: Bundling](#part-3-bundling)
  - [Introduction](#bundling-introduction)
  - [How to Analyze JS Bundle Size](#how-to-analyze-js-bundle-size)
  - [How to Analyze App Bundle Size](#how-to-analyze-app-bundle-size)
  - [Determine True Size of Third-Party Libraries](#determine-true-size-of-third-party-libraries)
  - [Avoid Barrel Exports](#avoid-barrel-exports)
  - [Experiment With Tree Shaking](#experiment-with-tree-shaking)
  - [Load Code Remotely When Needed](#load-code-remotely-when-needed)
  - [Shrink Code With R8 Android](#shrink-code-with-r8-android)
  - [Use Native Assets Folder](#use-native-assets-folder)
  - [Disable JS Bundle Compression](#disable-js-bundle-compression)
- [Acknowledgements](#acknowledgements)
  - [About The Authors](#about-the-authors)
  - [Libraries and Tools Mentioned in This Guide](#libraries-and-tools-mentioned-in-this-guide)

---

## Introduction

### Preface

React Native has come a long way. From the early days as a promising experiment in cross-platform development to adoption by some of the world's largest enterprises, its evolution has been nothing short of remarkable. The framework has matured, proving capable of handling the demands of high-scale applications while continuing to refine and push its technical boundaries.

For years, we have seen React Native introduce new features, often groundbreaking, with every release. Today, we see steady, low-level improvements that often enhance performance, stability, and scalability. These refinements reflect how React Native is being adopted more widely, reinforcing its role as a mature and enterprise-ready framework.

A significant milestone in this journey was the introduction of the New Architecture, which redefined many core aspects of the framework, including how we think about development in general and performance optimizations. It brought new features and best practices, enabling developers to build even more efficient and scalable applications.

And so, we decided it was time to overhaul our guide to optimization completely. The landscape has changed, and so must our approach. Some techniques that were once essential are no longer relevant; others have taken on new importance. In this new edition, we aim to equip developers with the latest insights, tools, and strategies to make the most of React Native's evolving capabilities.

Whether you're an experienced React Native engineer or just getting started, this guide goes beyond performance best practices. It also provides essential knowledge to help you understand React Native in general, including what happens under the hood. We rely on that knowledge every day to build better, more efficient, and scalable applications, and we hope it will help you do the same.

*-- Mike Grabowski, Callstack's Founder & CTO*

### How to Read This Book

This book is intended for React Native developers of various levels of experience. We believe that both newcomers and seasoned React Native devs, regardless of whether they come from a web or native app development background, will find something valuable and applicable in their apps.

We acknowledge that at a given time you may not be interested in all the optimizations presented in this book. Oftentimes, your focus will be on a specific area, such as optimizing React re-renders. That's why, although you can read the whole book linearly, we made sure it's easy to open on any given chapter and get right to the topic of your interest.

**What's waiting for you inside?**

To make it easier for everyone to find relevant information, we split this guide into three parts focusing on different kinds of optimization you may be particularly interested in: the React side, the Native side, and overall build-time optimizations. All three parts contain an introduction to the main topic, detailed guides, and best practices to help you improve the most important metrics describing your app's performance: **FPS** (Frames Per Second) and **TTI** (Time to Interactive).

Here's what you can expect in each part:

- **Introduction** -- where we present key topics, terms, and ideas related to the main topic.
- **Guides** -- where we explain how to use specialized tools and measure important metrics.
- **Best practices** -- where we show you what to do to make your app run and initialize faster.

**Conventions used in this book:**

To better illustrate the ideas presented in this book, we've included a lot of short code snippets, screenshots from the tools we use, and diagrams. We link to external resources, such as official docs or libraries, but also to other chapters of this book.

**About Callstack:**

At Callstack, we are committed to advancing React Native and empowering developers to build high-performance applications. As core contributors and Meta partners, we work closely with the community -- shaping proposals, maintaining key modules, and driving the framework's evolution.

### Why Performance Matters

When building mobile apps, performance is not just a technical concern -- it's a user experience priority. A fast, responsive app can make the difference between a delighted user and one who abandons your app entirely.

**The user's perspective:**

Perceived performance is all about how fast your app *feels* to the user. It's not just about raw numbers or benchmarks -- it's about creating the illusion of speed.

When a mobile app takes a few seconds to load, showing a splash screen, skeleton UI, or even a game to play can make users feel like the app is responsive and ready to use. That's why perceived performance is often more important than actual performance in shaping user satisfaction.

However, focusing solely on perceived performance can be misleading. While tricks like animations, placeholders, or preloading content can improve the user's perception, they don't address the underlying performance issues. That's where measurable metrics like TTI and FPS show their value.

**The metrics that matter: TTI and FPS**

Out of the many metrics you can measure and monitor, two have the most impact on how users perceive the speed of your app.

**Time to Interactive (TTI):**

Measuring the app's boot-time performance is described by the TTI metric. It measures how quickly your app becomes usable after launch. Companies often track variations of this metric, such as Time to Home or Time to Specific Screen.

If your app takes too long to load, users may abandon it before they even get a chance to explore its features.

**Frames Per Second (FPS):**

Once your app is up and running, FPS becomes the key metric for runtime performance. FPS measures how smoothly your app responds to user interactions, such as scrolling, swiping, or tapping buttons. A high FPS (ideally 60 frames per second or more) ensures that animations and transitions feel smooth and natural.

---

## Part 1: JavaScript

*Guides and techniques to improve FPS by optimizing JavaScript and React side of React Native*

### JavaScript Introduction

In the first part of this guide, we'll focus on the JavaScript part of the React Native ecosystem. React Native leverages native platform primitives and glues together various technologies: Kotlin or Java for Android, Swift or Objective-C for iOS, C++ for React Native's core runtime, and JavaScript executed by the Hermes engine.

**JavaScript initialization path:**

React Native initialization code handles key mechanisms:

- Initialization of React Native internals -- cross-platform C++ React renderer, JavaScript Interface (JSI), Hermes JS engine, layout engine (Yoga) -- on the main thread.
- Initialization of the JavaScript thread that runs JS and communicates back and forth with the main thread through the JSI.
- Initialization of the Native modules thread that runs lazily loaded Turbo Modules.

> According to an internal survey of 100 React Native developers at Callstack, **80% of the performance challenges** they face originate from the JavaScript side.

**React re-rendering model:**

React takes care of rendering and updating the application UI based on its state for you, regardless of the environment. The `react` library itself consists mostly of public API definitions, some cross-platform functionality, and a reconciliation algorithm.

> **React component re-renders in the following cases:**
> - Parent component re-renders
> - State (including hooks) changes
> - Props change
> - Context changes
> - Force update (escape hatch)

---

### How to Profile JS and React Code

**GUIDE**

When optimizing performance, we want to know exactly which code path is the source of a slowdown. To be precise with our actions, we must make decisions guided by data.

**Profiling with React Native DevTools:**

The best tool to profile React running in a mobile app is React Native DevTools. React Profiler is integrated as the default plugin and can produce a flame graph of the React rendering pipeline.

Example code to profile:

```tsx
export const App = () => {
  const [count, setCount] = React.useState(0);
  const [second, setSecond] = React.useState(0);
  return (
    <View style={styles.container}>
      <Text>Welcome!</Text>
      <Text>{count}</Text>
      <Text>{second}</Text>
      <Button onPress={() => setCount(count + 1)} title="Press one" />
      <Button onPress={() => setSecond(second + 1)} title="Press two" />
    </View>
  );
};

const Button = ({onPress, title}) => {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text>{title}</Text>
    </Pressable>
  );
};
```

You can access DevTools by pressing `j` in the Metro dev server or from the app using the React Native Dev Menu.

**Profiler settings:**

1. Go to the Profiler tab
2. Configure "Highlight updates when components render"
3. Enable "Record why each component rendered while profiling"
4. Press "Start profiling" or "Reload and start profiling"

After wrapping Button with `React.memo` and its `onPress` handlers with `React.useCallback`:

```tsx
// wrap inline functions with `useCallback`
const onPressHandler = useCallback(() => setCount(count + 1), [count]);
const secondHandler = useCallback(() => setSecond(second + 1), [second]);
// ...
<Button onPress={onPressHandler} title="Press one" />
<Button onPress={secondHandler} title="Press two" />
// wrap Button component with `memo`
const Button = memo(({onPress, title}) => {
  // ...
});
```

> Remember to focus on the components marked with yellow as the ones where React spends the most time. And leverage the "Why did this render?" information.

**Profiling JavaScript Code:**

React Native DevTools also provides JavaScript CPU Profiler. Example of a long-running function:

```typescript
const longRunningFunction = () => {
  let i = 0;
  while (i < 1000000000) {
    i++;
  }
};
```

> In mobile apps, we want our functions never to block the JS thread for more than **16 ms** to achieve 60 FPS and, ideally, **8 ms** for 120 FPS.

---

### How to Measure JS FPS

**GUIDE**

Mobile users expect smooth, well-designed interfaces that respond instantly. If your application fails to provide a responsive interface, lags user input, or feels "janky", it's a sign the UI is "dropping frames".

**What is FPS:**

Getting your code to display anything on the screen involves drawing pixels. A single drawing is called a "frame". Most mobile devices have a refresh rate of 60 Hz (60 FPS). As technology advances, users have access to screens that can refresh 120 or even 240 times a second.

> Our target of 16.6 ms to render a frame (1/60 s) is moving, and we should aim for **8.3 ms per frame** (120 FPS).

**React Perf Monitor:**

React Native comes with a built-in React Perf Monitor that displays FPS live as an overlay.

> Open DevMenu by shaking the device or:
> - iOS Simulator: `Ctrl + Cmd + Z`
> - Android emulators: `Cmd/Ctrl + M`

There are two FPS monitors -- one for the UI (Main) thread and another for the JS thread.

> Always disable development mode when measuring performance.

**Flashlight:**

For tracking and measuring FPS over time, tools like Flashlight shine (Android only):

```bash
flashlight measure
```

It produces a lighthouse-like report with overall performance score, average FPS, CPU, and RAM usage.

---

### How to Hunt JS Memory Leaks

**GUIDE**

When a program is executed, it always occupies some space in RAM. When that memory allocation is unexpectedly retained, we deal with memory leaks.

**Anatomy of a memory leak in a JavaScript app:**

JavaScript engines like Hermes implement a garbage collector (GC). Hermes' garbage collector is called **Hades**.

> A memory leak happens when a program fails to release memory that is no longer needed.

**Common examples of memory leaks:**

1. **Listeners that don't stop listening:**

```tsx
const BadEventComponent = () => {
  useEffect(() => {
    const subscription = EventEmitter.addListener('myEvent', handleEvent);
    // Missing cleanup function
  }, []);

  return <Text>Listening for events...</Text>;
};
```

2. **Timers that don't stop counting** (missing cleanup in useEffect)

3. **Closures that retain a reference to large objects:**

```typescript
class BadClosureExample {
  private largeData: string[] = new Array(1000000).fill('some data');

  createLeakyFunction(): () => number {
    // Entire largeData array is captured in closure
    return () => this.largeData.length;
  }
}

// Fixed
class GoodClosureExample {
  private largeData: string[] = new Array(1000000).fill('some data');

  createEfficientFunction(): () => number {
    // Only capture the length, not the entire array
    const length = this.largeData.length;
    return () => length;
  }
}
```

**Hunting memory leaks with React Native DevTools:**

React Native DevTools offers three ways to profile memory:

- **Heap snapshot** -- shows memory distribution among JavaScript objects
- **Allocation instrumentation on the timeline** -- shows instrumented JS memory allocations over time (best for isolating leaks)
- **Allocation sampling** -- records memory allocations using the sampling method

Key indicators:
- **Blue bars** = allocations
- **Grey bars** = deallocated objects
- **Shallow size** = memory held by the object
- **Retained size** = memory that will be freed after the object is deleted

---

### Uncontrolled Components

**BEST PRACTICE**

The React programming model revolves around re-rendering the whole app every time there's a state change. React offers escape hatches like refs, which allow bypassing React's re-rendering logic for "uncontrolled components".

**Controlled TextInput in legacy architecture:**

```tsx
const DummyTextInput = () => {
  const [value, setValue] = useState("Text");
  const onChangeText = (text) => {
    setValue(text);
  };
  return (
    <TextInput
      onChangeText={onChangeText}
      value={value}
    />
  );
};
```

The problem: When updates via `onChangeText` arrive before React Native synchronizes each back, the interface starts flickering and the state can get out of sync with the native input state.

> The problem with controlled TextInput de-synchronization shouldn't exist in New Architecture.

**Uncontrolled TextInput:**

Remove the `value` prop from TextInput entirely:

```tsx
const DummyTextInput = () => {
  const [value, setValue] = useState("Text");
  const onChangeText = (text) => {
    setValue(text);
  };
  return (
    <TextInput
      onChangeText={onChangeText}
      // value={value}  -- removed
    />
  );
};
```

Data flows only one way, from native to JavaScript, eliminating synchronization issues.

---

### Higher-Order Specialized Components

**BEST PRACTICE**

In React Native, primitive components like `Text`, `View`, or `TextInput` are the building blocks. Additionally, the `react-native` package and third-party libraries come with higher-order components optimized for particular purposes.

**Displaying lists -- ScrollView vs FlatList vs FlashList:**

**ScrollView (naive approach):**

```tsx
import { View, Text, ScrollView } from 'react-native';

const App = () => {
  const items = Array.from({ length: 5000 }, (_, index) => `Item ${index + 1}`);
  return (
    <ScrollView>
      {items.map((item, index) => (
        <View key={index}>
          <Text>{item}</Text>
        </View>
      ))}
    </ScrollView>
  );
};
```

With 5000 items, performance drops significantly -- the app becomes unresponsive for around a second.

**FlatList (better):**

```tsx
import { View, Text, FlatList } from 'react-native';

const App = () => {
  const items = Array.from({ length: 5000 }, (_, index) => `Item ${index + 1}`);
  const renderItem = ({ item }) => (
    <View>
      <Text>{item}</Text>
    </View>
  );
  return (
    <FlatList
      data={items}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
    />
  );
};
```

FlatList internally uses VirtualizedList with "windowing" -- only rendering visible items plus a small buffer.

**Optimize with getItemLayout:**

```tsx
const ITEM_HEIGHT = 50;

const getItemLayout = (_, index) => ({
  length: ITEM_HEIGHT,
  offset: ITEM_HEIGHT * index,
  index,
});

<FlatList
  data={items}
  renderItem={renderItem}
  keyExtractor={(item, index) => index.toString()}
  getItemLayout={getItemLayout}
/>
```

**FlashList (best performance):**

```tsx
import { FlashList } from "@shopify/flash-list";

<FlashList
  data={items}
  renderItem={renderItem}
  estimatedItemSize={ITEM_HEIGHT}
/>
```

FlashList recycles views outside the viewport and reuses them. Performance score: **68/100** vs FlatList's **25/100**, with more stable performance at ~56 FPS.

**Keep an eye on Legend List** -- a new alternative leveraging New Architecture, implemented fully in JavaScript (1.0-beta as of early 2025).

---

### Atomic State Management

**BEST PRACTICE**

The higher a re-render occurs in the component tree, the more likely it propagates changes to leaf components unnecessarily. This is common with global app state (React Context, Redux).

**The problem:**

```tsx
const App = () => {
  const [filter, setFilter] = useState('all');
  const [todos, setTodos] = useState(initialState);

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  return (
    <View>
      {['all', 'active', 'completed'].map((filterType, index) => (
        <FilterMenuItem key={index} title={filterType} currentFilter={filter} onChange={setFilter} />
      ))}
      {filteredTodos.map((todo, index) => (
        <TodoItem key={index} item={todo} onChange={setTodos} />
      ))}
    </View>
  );
};
```

Any state change causes ALL components to re-render.

**Atomic state with Jotai:**

```typescript
const filterAtom = atom("all");
const todosAtom = atom(initialState);
```

```tsx
const FilterMenuItem = ({ title, filterType }) => {
  const [filter, setFilter] = useAtom(filterAtom);
  return (
    <TouchableOpacity onPress={() => setFilter(filterType)}>
      <Text>{title}</Text>
    </TouchableOpacity>
  );
};

export const TodoItem = ({ item }) => {
  const setTodos = useSetAtom(todosAtom);
  return (
    <TouchableOpacity
      onPress={() => {
        setTodos(prev => prev.map(todo =>
          todo.id === item.id ? { ...todo, completed: !todo.completed } : todo
        ));
      }}
    >
      {/* ... */}
    </TouchableOpacity>
  );
};
```

> Jotai means "state" in Japanese, while Zustand means "state" in German.

With atomic state, toggling a todo's completion status only re-renders components subscribed to the todos atom -- FilterMenuItems remain unchanged.

---

### Concurrent React

**BEST PRACTICE**

Concurrent React was introduced in React 18 and brought to React Native in version 0.69. Instead of completing updates in a single uninterrupted process, it allows updates to be paused, reprioritized, or even abandoned.

> To use Concurrent React features, you must migrate to the **New Architecture** (default from React Native 0.76).

**Handling slow components with `useDeferredValue`:**

```tsx
function DeferredScreen() {
  const [count, setCount] = useState(0);
  const deferredCount = useDeferredValue(count);

  return (
    <>
      <CounterNumber count={count} />
      <SlowComponent count={deferredCount} />
      {count !== deferredCount ? <ActivityIndicator /> : null}
      <Button onPress={() => setCount(count + 1)} title="Increment" />
    </>
  );
}
```

> Remember to wrap computation-heavy components in `React.memo()` when passing deferred values.

**Presenting stale value while waiting for an update:**

```tsx
function SearchScreen() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;

  return (
    <View>
      <TextInput value={query} onChangeText={setQuery} placeholder="Search items..." />
      <Suspense fallback={<LoadingSpinner />}>
        <View style={[isStale && { opacity: 0.8 }]}>
          <SearchResults query={deferredQuery} />
        </View>
      </Suspense>
    </View>
  );
}
```

**Using transitions for non-critical updates (`useTransition`):**

```tsx
function TransitionScreen() {
  const [count, setCount] = useState(0);
  const [slowCount, setSlowCount] = useState(0);
  const [isPending, startTransition] = useTransition();

  const handleIncrement = () => {
    setCount((prevCount) => prevCount + 1);
    startTransition(() => {
      setSlowCount((prevSlowCount) => prevSlowCount + 1);
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <CounterNumber count={count} />
      <SlowComponent count={slowCount} />
      {isPending ? <LoadingSpinner /> : null}
      <Button onPress={handleIncrement} title="Increment" />
    </SafeAreaView>
  );
}
```

**How to choose:**
- `useDeferredValue` -- best for deferring rendering of a single value
- `useTransition` -- best for deferring entire updates involving multiple states

**Automatic batching (React 18):**

```typescript
// Before: only React events were batched
setTimeout(() => {
  setProductQuantity(quantity => quantity + 1);
  setIsCartOpen(isOpen => !isOpen);
  // React renders twice
}, 1000);

// After: updates inside timeouts, promises etc. are also batched
setTimeout(() => {
  setProductQuantity(quantity => quantity + 1);
  setIsCartOpen(isOpen => !isOpen);
  // React renders only once
}, 1000);
```

---

### React Compiler

**BEST PRACTICE**

React Compiler is a new tool from the React core team that automatically optimizes React applications at build time by applying memoization techniques to reduce unnecessary re-renders.

> At the time of writing (January 2025), React Compiler is still in beta. Companies like Meta are already using it in production.

**Preparing your codebase:**

Install the ESLint plugin:

```bash
npm install -D eslint-plugin-react-compiler@beta
```

```javascript
// eslint.config.js
import reactCompiler from 'eslint-plugin-react-compiler'

export default [
  {
    plugins: {
      'react-compiler': reactCompiler,
    },
    rules: {
      'react-compiler/react-compiler': 'error',
    },
  },
]
```

> React Compiler is compatible with React 17+ applications. It does not optimize class components, outdated patterns, or components that break the Rules of React.

**Running the compiler:**

```bash
npm install -D babel-plugin-react-compiler@beta
```

```javascript
// babel.config.js
const ReactCompilerConfig = {
  target: '19' // pick your 'react' version
};

module.exports = function () {
  return {
    plugins: [
      ['babel-plugin-react-compiler', ReactCompilerConfig],
    ],
  };
};
```

For React Native < 0.78 (pre-React 19), add `react-compiler-runtime@beta` and set target to `"18"`.

**Incremental adoption:**

```javascript
const ReactCompilerConfig = {
  sources: (filename) => {
    return filename.indexOf('src/path/to/dir') !== -1;
  },
};
```

**How the compiler transforms code:**

Before:
```tsx
export default function MyApp() {
  const [value, setValue] = useState('');
  return (
    <TextInput onChangeText={() => { setValue(value); }}>
      Hello World
    </TextInput>
  );
}
```

After:
```tsx
import { c as _c } from 'react/compiler-runtime';
export default function MyApp() {
  const $ = _c(2);
  const [value, setValue] = useState('');
  let t0;
  if ($[0] !== value) {
    t0 = <TextInput onChangeText={() => setValue(value)}>Hello World</TextInput>;
    $[0] = value;
    $[1] = t0;
  } else {
    t0 = $[1];
  }
  return t0;
}
```

> React Compiler uses shallow comparison, just like `React.memo` and `useMemo`.

**Performance improvements:** Testing on the Expensify app showed "Chat Finder Page Time to Interactive" improved by **4.3%**.

**Is it time to remove manual memoization?** Not yet. Keep `React.memo`, `useMemo`, and `useCallback` until the compiler reaches stable release.

---

### High-Performance Animations Without Dropping Frames

**BEST PRACTICE**

Animations play a crucial role in mobile experiences. Ensuring smooth animations at 60+ FPS is essential.

**Understanding the main thread:**

The main thread (UI thread) handles UI rendering and user interactions. This is different from the JavaScript thread where most React Native code runs.

**React Native Reanimated:**

The industry standard for animations (~1 million weekly downloads as of January 2025). Reanimated runs animations directly on the UI thread using **worklets** -- short-running JavaScript functions that run on the UI thread.

```typescript
const style = useAnimatedStyle(() => {
  console.log('Running on the UI thread');
  return { opacity: 0.2 };
});
```

**`runOnUI` and `runOnJS`:**

```typescript
runOnUI(() => {
  console.log('Running on the UI thread');
});

const animatedStyle = useAnimatedStyle(() => {
  if (progress.value >= 1) {
    runOnJS(notifyCompletion)();
  }
  return {
    opacity: progress.value,
    transform: [{ scale: withSpring(progress.value) }],
  };
});
```

**Thread choice guidelines:**

- **UI thread** -- visual animations, transforms, layout changes
- **JavaScript thread** -- complex calculations, data processing, state management

**InteractionManager:**

Allows scheduling long-running work after interactions/animations complete:

```typescript
InteractionManager.runAfterInteractions(() => {
  console.log('Running after interactions');
});
```

**Pairing with React Navigation:**

```typescript
useFocusEffect(
  React.useCallback(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      // Expensive task eventually updating UI
    });
    return () => task.cancel();
  }, [])
);
```

---

## Part 2: Native

*Guides and techniques to improve FPS by optimizing Native side of React Native on iOS, Android, and in C++*

### Native Introduction

At least 20% of performance issues are related to the native side. Part 2 focuses on the native side of the timeline.

**Process (pre-)initialization:**

The OS may perform process initialization fully or partially before the user opens the app (warm/hot startup on Android, prewarming on iOS).

**React Native's threading model:**

- **Main thread / UI thread** -- UI rendering and user interactions
- **JavaScript thread** -- business logic, JS execution via Hermes
- **Native modules thread** -- lazily loaded Turbo Modules
- Background threads for various tasks

**React Native initialization:**

1. Native Kotlin code initializes Hermes JS engine
2. Loads JS bundle in Hermes Bytecode (HBC) format into memory
3. HBC allows skipping expensive interpretation, directly executed on JS thread (`mqt_v_js`)
4. JS thread handles eagerly loaded native modules, then executes JS code
5. Other TurboModules lazily initialized from dedicated thread (`mqt_v_native`)

---

### Understand Platform Differences

**GUIDE**

When working with React Native, you'll need to be comfortable with Android Studio and Xcode. Key features these IDEs provide:

- View Hierarchy Debugger
- Instrumentation & Performance Profiling
- Advanced Debugging Tools (LLDB, GDB, Logcat)
- Seamless Build System Integration (Gradle, Xcode)
- Automated Testing Tools (XCTest, Espresso/JUnit)

> If you are using Expo, you may not need to leave your IDE comfort zone too often.

**Dependency management:**

- **JavaScript** -- npm registry, `package.json`, `node_modules/`
- **iOS** -- CocoaPods (`Podfile`), `Pods/` directory, `.xcworkspace`
- **Android** -- Gradle (`build.gradle`), Maven Central, `gradlew`

**Building a project:**

- **JavaScript** -- Metro bundler transpiles via Babel for Hermes
- **iOS** -- Clang (Objective-C) + LLVM (Swift) compile to machine code, linking, signing, packaging (.ipa)
- **Android** -- Java/Kotlin compiled to .class bytecode, DEX conversion, resource processing, signing, packaging (.apk/.aab)

**Simulator tools:**

- MiniSim
- Android iOS Emulator for VSCode
- Expo Orbit
- Shopify Tophat

---

### How to Profile Native Parts of React Native

**GUIDE**

**iOS -- Xcode:**

Xcode's Debug Navigator shows CPU, memory, disk, and network load. The CPU percentage shows usage relative to a single core, so it can exceed 100%.

**Xcode Instruments (Time Profiler):**

1. Open from Xcode > Open Developer Tool > Instruments
2. Select Time Profiler
3. Choose target device and app
4. Hit record button
5. Use app to reproduce performance regression
6. Stop recording and analyze

Key features:
- **Microhang** -- indicates the UI thread is doing a lot of work
- **Hang** -- indicates the thread was fully blocked (high priority to investigate)
- Call Tree vs Flame Graph views
- Filter by thread, hide system libraries

> You can effectively block the JS thread and users will still be able to interact with native UI elements.

**Android -- Android Studio Profiler:**

1. View > Tool Windows > Profiler
2. Choose "Find CPU Hotspots"
3. Start profiler task
4. Analyze flame graph breakdown

> Pick the lowest-end device available or emulator for profiling.

**Perfetto:**

A system tracing tool at ui.perfetto.dev for loading and analyzing exported traces.

---

### How to Measure TTI

**GUIDE**

TTI tells us how much time elapses from touching the app icon to displaying meaningful, interactive content.

> Time to Interactive is crucial for user experience, satisfaction, retention, and revenue.

**Measuring TTI reliably:**

It only makes sense to measure TTI during **cold boot state** -- excluding prewarm, warm, or hot states.

**Setting up performance markers with `react-native-performance`:**

Performance markers for each stage:

1. **Native Process Init** -- `nativeAppStart` / `nativeAppEnd`
2. **Native App Init** -- `appCreationStart` / `appCreationEnd`
3. **JS Bundle Load** -- `runJSBundleStart` / `runJSBundleEnd`
4. **React Native Root View Render** -- `contentAppeared`
5. **React App Render** -- `screenInteractive`

**Detecting cold start:**

iOS:
```swift
let isColdStart = ProcessInfo.processInfo.environment["ActivePrewarm"] == "1"
```

Android:
```kotlin
class MainApplication : Application(), ReactApplication {
  var isColdStart = false
  override fun onCreate() {
    super.onCreate()
    var firstPostEnqueued = true
    Handler().post { firstPostEnqueued = false }
    registerActivityLifecycleCallbacks(object : ActivityLifecycleCallbacks {
      override fun onActivityCreated(activity: Activity, savedInstanceState: Bundle?) {
        unregisterActivityLifecycleCallbacks(this)
        if (firstPostEnqueued && savedInstanceState == null) {
          isColdStart = true
        }
      }
    })
  }
}
```

**React App screenInteractive marker:**

```tsx
export default HomeScreen() {
  useEffect(() => {}, [])
  return <TabNavigator {...} />
}
```

---

### Understanding Native Memory Management

**GUIDE**

**Memory management patterns:**

1. **Reference Counting** (Swift/Objective-C ARC, Python, PHP) -- increments/decrements reference count; deallocates when count reaches zero. Watch out for reference cycles.

2. **Garbage Collector** (JavaScript, Java, C#) -- periodically scans and frees unreachable objects. No reference cycle problems, but non-deterministic cleanup.

3. **Manual management** (C/C++) -- developer controls allocations/deallocations on stack and heap.

**C++ smart pointers:**

- `std::unique_ptr<T>` -- exclusive ownership, can only be moved
- `std::shared_ptr<T>` -- reference-counted, can be copied
- `std::weak_ptr<T>` -- non-owning reference, doesn't participate in reference counting

**Android (Kotlin):**

Uses GC from JVM. Use `WeakHashMap` and `WeakReference` to help GC deallocate objects.

**iOS (Swift):**

Uses Automatic Reference Counting (ARC). Break reference cycles with `weak` references.

**Common sources of memory leaks:**

- Forgetting to deallocate in manual management (C/C++)
- Reference cycles (C++, Swift)
- Not freeing resources/unregistering listeners (Kotlin, JavaScript)
- Misusing manual overrides (`Unmanaged` in Swift)

---

### Understand the Threading Model of Turbo Modules and Fabric

**GUIDE**

**Available threads:**

- **Main thread / UI thread** -- UI operations
- **JavaScript thread** -- JS code execution
- **Native modules thread** -- shared pool for native modules

**Turbo Modules lifecycle:**

- **iOS init** -- called on main thread (assumes UIKit access)
- **Android init** -- called on JavaScript thread (`mqt_v_js`)
- **Eager init (Android)** -- called on native modules thread (`mqt_v_native`)
- **Synchronous calls** -- executed on JavaScript thread (blocking!)
- **Asynchronous calls** -- offloaded to Turbo Modules thread
- **Invalidation** -- iOS on Turbo Modules thread, Android on ReactHost thread

> Be extra careful with synchronous functions. A `Thread.sleep(20)` would block the JavaScript thread for 20 seconds.

**Native Views (Fabric):**

- **Initialization** -- main thread on both platforms
- **Prop updates** -- main thread (React Native assumes UI manipulation)
- **Yoga tree operations** -- JavaScript thread

> Yoga is a cross-platform layout engine used by React Native for Flexbox layout calculations. It's not tied to React Native and is sometimes faster than native layout systems like auto-layout on iOS.

---

### Use View Flattening

**BEST PRACTICE**

React Native introduced "view flattening" to simplify the view hierarchy where possible. The renderer identifies "layout-only" nodes that can be flattened, reducing the depth of the host elements tree.

> View flattening was first introduced for Android but is now available on iOS too thanks to the C++ renderer in New Architecture.

**Beware of issues:**

If a child view gets flattened inside a native component expecting a specific number of children, you may get more children than expected. Use the `collapsable` prop to prevent this:

```tsx
<MyNativeComponent>
  <Child1 collapsable={false} />
  <Child2 collapsable={false} />
  <Child3 collapsable={false} />
</MyNativeComponent>
```

**Debugging the view hierarchy:**

- **Xcode** -- "Debug View Hierarchy" button in debugging toolbar
- **Android Studio** -- View > Tool Windows > Layout Inspector

---

### Use Dedicated React Native SDKs Over Web

**BEST PRACTICE**

While it's often possible to run the same JavaScript in a mobile React Native app as in the browser, you must be vigilant and check whether platform-specific alternatives exist.

**Internationalization polyfills:**

Hermes now supports many Intl APIs natively (as of January 2025):

| Intl API | Hermes support |
|---|---|
| Intl.Collator | Yes |
| Intl.DateTimeFormat | Yes |
| Intl.NumberFormat | Yes |
| Intl.getCanonicalLocales() | Yes |
| Intl.supportedValuesOf() | Yes |
| Intl.ListFormat | No |
| Intl.DisplayNames | No |
| Intl.Locale | No |
| Intl.RelativeTimeFormat | No |
| Intl.Segmenter | No |
| Intl.PluralRules | No |

Removing unnecessary polyfills shaves off **over 430 kB** from the JS bundle.

**Crypto libraries:**

Replace JavaScript `crypto-js` with `react-native-quick-crypto` from Margelo -- up to **58x faster** due to C++.

**Use native navigation:**

With React Navigation, prefer native-based navigators:

```tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const MyStack = createNativeStackNavigator({
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
  },
});
```

```tsx
import { createNativeBottomTabNavigator } from '@bottom-tabs/react-navigation';

const MyTabs = createNativeBottomTabNavigator({
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
  },
});
```

**Other native component libraries:**

- React Native Screens
- Zeego (native menus)
- React Native Slider
- React Native Date Picker

---

### Make Your Native Modules Faster

**BEST PRACTICE**

**Scaffold with React Native Builder Bob:**

```bash
npx create-react-native-library@latest library-name
```

Use `--local` flag for project-specific modules.

**Use modern languages: Swift and Kotlin:**

Kotlin is fully interoperable with Java. Swift can be used in React Native through Objective-C bridging:

1. Modify Podspec to include `.swift` files
2. Create bridging header
3. Write Swift extension with `@objc` attribute
4. Use `RCT_EXTERN_METHOD()` in `.mm` file

**Leverage background threads:**

iOS with DispatchQueue:

```swift
@objc func multiplyOnBackgroundThread(
  _ a: Double, b: Double,
  resolve: @escaping RCTPromiseResolveBlock,
  reject: RCTPromiseRejectBlock
) {
  DispatchQueue.global().async {
    resolve(a * b)
  }
}
```

Android with Kotlin coroutines:

```kotlin
private val moduleScope = CoroutineScope(Dispatchers.Default + SupervisorJob())

override fun invalidate() {
  super.invalidate()
  moduleScope.cancel()
}

override fun multiplyOnBackgroundThread(a: Double, b: Double, promise: Promise?) {
  moduleScope.launch {
    promise?.resolve(a * b)
  }
}
```

**Replace platform-independent code with C++:**

C++ Turbo Modules provide significant performance boosts but require careful threading and memory management.

**The hidden cost of interfacing C++:**

- **Objective-C++** -- close to zero cost at compile time
- **Swift C++ Interoperability** -- nearly zero cost (Nitro Modules leverage this)
- **JNI (Android)** -- costly function lookups, but C++ Turbo Modules skip JNI at runtime via JSI

---

### How to Hunt Memory Leaks

**GUIDE**

**Xcode -- Leaks Instrument:**

1. Check "Memory Report" from Debug Navigator
2. Product > Profile to open Instruments
3. Choose "Leaks" template
4. Record and follow steps that likely cause leaks
5. Red markers indicate detected leaks
6. Inspect stack trace and source code

**Android Studio Profiler:**

1. Run > Profile
2. Choose "Track Memory Consumption"
3. Monitor memory graph and activity lifecycle
4. Look for allocations without corresponding deallocations

---

## Part 3: Bundling

*Guides and techniques to improve TTI by utilizing ahead-of-time compilation and packaging techniques across JavaScript and Native*

### Bundling Introduction

**JavaScript bundles and bundlers:**

React Native ships with Metro by default. Alternatives include Re.Pack (Webpack/Rspack).

In development, the app fetches JS from the dev server (enabling Hot Module Replacement). In release, the app contains a `.jsbundle` file with Hermes Bytecode.

**Hermes bytecode:**

Hermes moves "loading into memory" and "parse" steps to build time. This means web-style code splitting won't translate directly to React Native.

> Turbo Modules are lazily loaded by default, improving TTI compared to legacy Native Modules.

**Android app bundles:**

- **APK** -- traditional format, not optimized for splitting
- **AAB** -- newer format for Play Store, generates optimized APKs per device

Architectures: `armeabi-v7a`, `arm64-v8a`, `x86`, `x86_64`

**iOS app bundles:**

- **IPA** -- for App Store distribution, supports App Thinning
- **APP** -- for development/simulator

**Dynamic vs static libraries:**

- Static linking: simpler but bigger bundle size
- Dynamic linking: shared across targets, smaller total size
- Switch to dynamic when framework is shared among multiple app targets

---

### How to Analyze JS Bundle Size

**GUIDE**

**source-map-explorer:**

```bash
npx react-native bundle \
  --entry-file index.js \
  --bundle-output output.js \
  --platform ios \
  --sourcemap-output output.js.map \
  --dev false \
  --minify true

npx source-map-explorer output.js --no-border-checks
```

> You may lose up to 30% of information due to invalid Metro mappings.

**Expo Atlas:**

```bash
EXPO_UNSTABLE_ATLAS=true npx expo start --no-dev
npx expo-atlas
```

**Rspack bundle analysis:**

```bash
rspack build --analyze
```

Other tools: `bundle-stats`, `statoscope`, `Rsdoctor`

---

### How to Analyze App Bundle Size

**GUIDE**

> For every 6 MB increase in APK size, installation conversion rate decreases by **1%** (Google).

**Measuring Android app size with Ruler (Spotify):**

Add to `build.gradle`:

```groovy
buildscript {
  dependencies {
    classpath("com.spotify.ruler:ruler-gradle-plugin:2.0.0-beta-3")
  }
}
```

Configure and run:

```groovy
ruler {
  abi.set("arm64-v8a")
  locale.set("en")
  screenDensity.set(480)
  sdkVersion.set(34)
}
```

```bash
cd android
./gradlew analyzeReleaseBundle
```

**Measuring iOS app size:**

Use App Store Connect for most accurate information, or generate an app size report via Xcode's Organizer with App Thinning enabled.

**Emerge Tools:**

Upload IPA, APK, or AAB for X-Ray and Breakdown analysis (paid service with 14-day trial).

---

### Determine True Size of Third-Party Libraries

**BEST PRACTICE**

**Tools:**

- **bundlephobia.com** -- shows minified/compressed size and download time
- **pkg-size.dev** -- backup alternative to Bundlephobia
- **Import Cost (VS Code extension)** -- real-time inline size feedback

> Import Cost uses Webpack and may fail for packages with native code.

---

### Avoid Barrel Exports

**BEST PRACTICE**

A barrel file groups and exports multiple modules from a single `index` file:

```typescript
// components/index.ts
export { Button } from './Button';
export { Card } from './Card';
export { Modal } from './Modal';
```

**Problems:**

1. **Bundle size overhead** -- Metro includes all modules even if you use only one
2. **Runtime overhead** -- all modules must be evaluated before returning requested module
3. **Circular dependencies** -- breaking HMR and forcing full reloads

**Solution -- import from individual files:**

```typescript
// importing from individual files
import Button from './components/Button';
import Card from './components/Card';
import Modal from './components/Modal';
```

Use `eslint-plugin-no-barrel-imports` to enforce this.

**Automatic solutions:**

- Expo SDK 52 -- experimental tree shaking
- `metro-serializer-esbuild` from rnx-kit
- Webpack/Rspack via Re.Pack

**Real-world example: date-fns:**

```typescript
// Instead of:
import { format, addDays, isToday } from 'date-fns';

// Use submodule imports:
import format from 'date-fns/format';
import addDays from 'date-fns/addDays';
import isToday from 'date-fns/isToday';
```

---

### Experiment With Tree Shaking

**BEST PRACTICE**

Tree shaking identifies and removes code that's never used in your application.

**How it works:**

1. Finding dead code -- looks for exported but never imported code
2. Removing dead code -- marks and removes unused code during build

**Support in React Native:**

- **Metro** -- not supported (use `metro-serializer-esbuild` as workaround)
- **Expo** -- experimental from SDK 52
- **Re.Pack** -- full support via Webpack/Rspack

**Expo setup:**

```javascript
// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const config = getDefaultConfig(__dirname);
config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: true,
  },
});
module.exports = config;
```

```
# .env
EXPO_UNSTABLE_METRO_OPTIMIZE_GRAPH=1
EXPO_UNSTABLE_TREE_SHAKING=1
```

**Bundle size comparison (Expensify benchmark):**

| Bundle Type | Metro Size (MB) | Re.Pack Size (MB) | Difference |
|---|---|---|---|
| Development | 38.49 | 49.04 | +27.41% |
| Production | 35.63 | 38.48 | +8.00% |
| Production Minified | 15.54 | 13.36 | **-14.03%** |
| Production (HBC) | 21.79 | 19.35 | **-11.20%** |
| Production Minified (HBC) | 21.62 | 19.05 | **-11.89%** |

Expect about **10-15% reduction** in final bundle size with Re.Pack and all optimizations.

---

### Load Code Remotely When Needed

**BEST PRACTICE**

With Hermes (default engine), code-splitting benefits are minimal due to memory mapping. Consider it when:

- You're not using Hermes
- Your app size is too big (>200 MB for Play Store)
- You're building microfrontend architecture
- You've exhausted other optimization techniques

**Moving to Re.Pack:**

```bash
npx @callstack/repack-init
```

**Splitting the bundle:**

```tsx
// Before
import FeatureComponent from './FeatureComponent';

// After - creating a split point
const FeatureComponent = React.lazy(() =>
  import(/* webpackChunkName: "feature" */ './FeatureComponent')
);
```

**Lazy loading from a remote location:**

```typescript
import { ScriptManager, Script } from '@callstack/repack/client';

ScriptManager.shared.addResolver((scriptId) => ({
  url: __DEV__
    ? Script.getDevServerURL(scriptId)
    : `https://my-cdn.com/assets/${scriptId}`,
}));

AppRegistry.registerComponent(appName, () => App);
```

**Module Federation:**

For complex scenarios with multiple isolated teams, consider microfrontend architecture with Module Federation via Re.Pack.

---

### Shrink Code With R8 Android

**BEST PRACTICE**

R8 replaces ProGuard to shrink, optimize, and obfuscate APKs.

**Enable R8:**

```groovy
// android/app/build.gradle
def enableProguardInReleaseBuilds = true
```

Result: sample app went from **9.5 MB to 6.3 MB** (33% reduction).

**ProGuard rules for R8:**

Define in `app/android/proguard-rules.pro`:

```
# Firebase example
-keep class io.invertase.firebase.** { *; }
-dontwarn io.invertase.firebase.**
```

**Shrinking resources:**

```groovy
android {
  buildTypes {
    release {
      minifyEnabled true
      shrinkResources true
    }
  }
}
```

---

### Use Native Assets Folder

**BEST PRACTICE**

Use size suffixes for images: `@2x`, `@3x`:

```
assets/
  ├── image.jpg        // 1x resolution
  ├── image@2x.jpg     // 2x resolution
  └── image@3x.jpg     // 3x resolution
```

**Android:**

Automatically optimized via AAB format. Play Store generates device-specific APKs with only relevant density assets.

**iOS -- Xcode Asset Catalog:**

1. Create `RNAssets.xcassets` in the `ios` folder
2. Modify Build Phases:

```bash
export EXTRA_PACKAGER_ARGS="--asset-catalog-dest ./"
```

After uploading to App Store, App Thinning selects proper image sizes per device.

> Remember to also optimize your assets using dedicated tools to reduce their size.

---

### Disable JS Bundle Compression

**BEST PRACTICE**

On Android, the build system compresses the Hermes bytecode bundle by default. This prevents Hermes from using memory mapping (mmap), negatively affecting TTI.

> As of February 2025, React Native Core Team is including this behavior by default (likely in React Native 0.79).

**Disable compression:**

```groovy
// app/build.gradle
android {
  androidResources {
    noCompress += ["bundle"]
  }
}
```

**Trade-off:** For an APK of 75.9 MB install size: +6.1 MB size increase (+8%), but **TTI dropped by 450 ms (-16%)**.

---

## Acknowledgements

### About The Authors

The Ultimate Guide to React Native Optimization was brought to you by the Callstack team:

- **Mike Grabowski** -- CTO and Founder at Callstack
- **Oskar Kwasniewski** -- Senior Software Engineer, React Native Core Contributor, creator of React Native visionOS and React Native Bottom Tabs
- **Robert Pasinski** -- Senior Software Engineer, low-level coding enthusiast
- **Michal Pierzchala** -- Principal Engineer, Core React Native Community contributor
- **Jakub Romanczyk** -- Senior Software Engineer, React Native & JS tooling
- **Szymon Rybczak** -- Software Engineer, passionate about universal apps
- **Piotr Tomczewski** -- Expert Software Engineer

### Libraries and Tools Mentioned in This Guide

**Animation and performance optimization:**
- React Native Reanimated
- React Navigation

**State management:**
- Jotai
- Zustand
- Recoil

**Lists and scrolling performance:**
- FlashList (Shopify)
- Legend List
- RecyclerListView

**Profiling and debugging tools:**
- React Native DevTools
- Chrome DevTools
- Flashlight (Android FPS measurement)
- Xcode Instruments
- Android Studio Profiler
- Perfetto

**JavaScript engines and native execution:**
- Hermes
- Yoga (layout engine)

**Code optimization and shrinking:**
- R8 (Android)

**Code splitting and remote loading:**
- Re.Pack
- Module Federation
- Zephyr Cloud

**Tree shaking:**
- Rspack
- Terser
- metro-serializer-esbuild

**JS and app bundle size analysis:**
- source-map-explorer
- Expo Atlas
- webpack-bundle-analyzer
- bundle-stats
- Statoscope
- Rsdoctor
- Emerge Tools
- Ruler (Spotify)

**Third-party library size analysis:**
- Bundlephobia
- pkg-size.dev
- Import Cost (VS Code Extension)

**Native development tools:**
- React Native Builder Bob

**Measuring app performance:**
- react-native-performance
