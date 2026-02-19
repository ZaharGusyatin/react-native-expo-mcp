import { PatternSections, resolvePattern } from './pattern-helper';

// ─── Full sections (with code examples) ─────────────────────────────

const sections: Record<string, string> = {
  'useeffect-cleanup': `## useEffect Cleanup — Always Return a Cleanup Function

Every \`useEffect\` that creates a side effect must return a cleanup function:

\`\`\`tsx
// GOOD — cleanup prevents memory leaks
useEffect(() => {
  const subscription = eventEmitter.addListener('event', handler);
  return () => subscription.remove();
}, []);

// BAD — listener leaks after component unmounts
useEffect(() => {
  eventEmitter.addListener('event', handler); // never cleaned up
}, []);
\`\`\``,

  'event-listeners': `## Event Listener Cleanup

\`\`\`tsx
import { AppState, AppStateStatus, Keyboard } from 'react-native';

function MyComponent() {
  useEffect(() => {
    const appStateSub = AppState.addEventListener('change', (state: AppStateStatus) => {
      if (state === 'active') syncData();
    });

    const keyboardShowSub = Keyboard.addListener('keyboardDidShow', handleKeyboardShow);
    const keyboardHideSub = Keyboard.addListener('keyboardDidHide', handleKeyboardHide);

    return () => {
      appStateSub.remove();
      keyboardShowSub.remove();
      keyboardHideSub.remove();
    };
  }, []);
}
\`\`\``,

  timers: `## Timer Cleanup

\`\`\`tsx
function PollingComponent() {
  useEffect(() => {
    const interval = setInterval(() => {
      fetchLatestData();
    }, 5000);

    return () => clearInterval(interval); // stop polling on unmount
  }, []);
}

function DelayedAction() {
  useEffect(() => {
    const timeout = setTimeout(() => {
      performAction();
    }, 2000);

    return () => clearTimeout(timeout); // cancel if component unmounts first
  }, []);
}
\`\`\``,

  closures: `## Closure Memory Leaks

Closures capture references. Capture only the specific values you need:

\`\`\`tsx
// BAD — captures entire user object; keeps stale reference alive
useEffect(() => {
  analytics.identify(user); // holds reference to entire user
}, [user]);

// GOOD — capture only the specific value needed
const userId = user.id;
useEffect(() => {
  analytics.identify(userId);
}, [userId]);
\`\`\``,

  'devtools-profiler': `## React Native DevTools Memory Profiler

Use React Native DevTools to identify memory leaks:

1. Open DevTools via Expo dev menu → "Open JS Debugger"
2. Go to the **Memory** tab
3. Take a **heap snapshot** — this is your baseline
4. Reproduce the suspected leak (navigate to screen, perform actions, navigate away)
5. Take another heap snapshot
6. Compare: look for objects that should have been garbage collected

**Key indicators:**
- **Blue bars** — currently allocated memory
- **Grey bars** — freed (garbage collected) memory
- **Shallow size** — memory held by the object itself
- **Retained size** — memory that would be freed if this object were collected

**Red flag:** Objects from a screen still present in memory after navigating away.`,

  'frame-budget': `## 16ms Frame Budget (60 FPS)

Each frame must render in 16ms for 60 FPS (8ms for 120 FPS ProMotion). Exceeding this causes dropped frames.

- **JS thread**: business logic, state updates, React reconciliation
- **UI thread**: layout, painting, touch handling
- **Reanimated worklets**: run on UI thread, never block JS

Keep heavy synchronous work off both threads.

> Defer heavy work after animations with InteractionManager — see \`get-performance-patterns\` (topic: interaction-manager).`,

  'view-flattening': `## View Flattening

React Native automatically flattens "layout-only" nodes in the view hierarchy (New Architecture). This reduces depth and improves render performance.

When a child view gets unexpectedly flattened inside a native component expecting a specific number of children, use \`collapsable={false}\` to prevent flattening:

\`\`\`tsx
<MyNativeComponent>
  <Child1 collapsable={false} />
  <Child2 collapsable={false} />
  <Child3 collapsable={false} />
</MyNativeComponent>
\`\`\`

**Debug view hierarchy:**
- **iOS**: Xcode → "Debug View Hierarchy" button in debug toolbar
- **Android**: Android Studio → View > Tool Windows > Layout Inspector`,

  r8: `## R8 Shrinking on Android

R8 shrinks, optimizes, and obfuscates your APK. Enable in production:

\`\`\`groovy
// android/app/build.gradle
def enableProguardInReleaseBuilds = true

android {
  buildTypes {
    release {
      minifyEnabled true
      shrinkResources true
    }
  }
}
\`\`\`

**Result:** Sample app shrank from 9.5 MB to 6.3 MB (33% reduction).

Add ProGuard rules for libraries using reflection:
\`\`\`
# android/app/proguard-rules.pro
-keep class io.invertase.firebase.** { *; }
-dontwarn io.invertase.firebase.**
\`\`\``,

  checklist: `## Common Memory Leak Sources Checklist

- [ ] \`useEffect\` with event listeners missing cleanup
- [ ] \`setInterval\`/\`setTimeout\` not cleared on unmount
- [ ] Promises continuing after component unmount (use AbortController)
- [ ] Closures capturing entire objects instead of specific values
- [ ] Image cache growing unbounded (configure \`cachePolicy\` on expo-image)
- [ ] Animation shared values holding references to large data structures
- [ ] Native event subscriptions not removed (AppState, Keyboard, Dimensions)`,
};

// ─── Compact sections (rules only, no code) ─────────────────────────

const compactSections: Record<string, string> = {
  'useeffect-cleanup': `## useEffect Cleanup
- EVERY useEffect with side effects MUST return a cleanup function
- Cleanup runs on unmount and before re-running the effect`,

  'event-listeners': `## Event Listeners
- Always \`.remove()\` subscriptions in cleanup: AppState, Keyboard, Dimensions
- Store subscription reference: \`const sub = addEventListener(...)\``,

  timers: `## Timers
- \`clearInterval(id)\` and \`clearTimeout(id)\` in cleanup
- Never leave timers running after unmount`,

  closures: `## Closures
- Capture specific values, not entire objects: \`const userId = user.id\`
- Prevents keeping stale references alive`,

  'devtools-profiler': `## Memory Profiler
- React Native DevTools → Memory tab → Heap snapshots
- Compare snapshots before/after navigation
- Red flag: objects from unmounted screens still in memory`,

  'frame-budget': `## Frame Budget
- 16ms per frame (60 FPS) / 8ms (120 FPS)
- JS thread: logic, state, reconciliation
- UI thread: layout, painting, touch
- Defer heavy work with InteractionManager — see \`get-performance-patterns\``,

  'view-flattening': `## View Flattening
- RN auto-flattens layout-only views (New Architecture)
- Use \`collapsable={false}\` to prevent unwanted flattening
- Debug: Xcode View Hierarchy (iOS), Layout Inspector (Android)`,

  r8: `## R8 (Android)
- Enable \`minifyEnabled true\` + \`shrinkResources true\` for release builds
- Add ProGuard keep rules for reflection-using libraries
- ~33% APK size reduction`,

  checklist: `## Leak Checklist
- [ ] useEffect cleanup for listeners/timers
- [ ] AbortController for async operations
- [ ] Specific value captures in closures
- [ ] expo-image cachePolicy configured
- [ ] Native subscriptions removed`,
};

// ─── Export ──────────────────────────────────────────────────────────

const pattern: PatternSections = {
  title: 'Memory Optimization',
  sections,
  compactSections,
};

export const getMemoryOptimization = (topic?: string, compact?: boolean): string =>
  resolvePattern(pattern, topic, compact);
