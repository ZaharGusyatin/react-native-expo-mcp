interface ClaudeMdOptions {
  appName: string;
  router?: string; // kept for API compatibility, always uses Expo Router
  appDescription?: string;
  features?: string[];
}

export function generateClaudeMd(options: ClaudeMdOptions): string {
  const { appName, appDescription, features } = options;

  const descriptionSection = appDescription
    ? `\n## Description\n${appDescription}\n`
    : "";

  const featuresSection =
    features && features.length > 0
      ? `\n## Features\n${features.map((f) => `- ${f}`).join("\n")}\n`
      : "";

  return `# ${appName}
${descriptionSection}${featuresSection}
## Tech Stack

- **Framework**: Expo (Managed Workflow)
- **Navigation**: Expo Router (file-based routing)
- **Language**: TypeScript (strict mode)
- **Styling**: NativeWind v4 (Tailwind CSS)
- **State Management**: Zustand + MMKV (persist)
- **API**: Axios + TanStack Query
- **Build**: EAS Build + OTA Updates

## Architecture

### File-based Routing (Expo Router)
- Files in \`app/\` = routes
- \`app/_layout.tsx\` = root layout (providers, auth guard)
- \`app/(tabs)/\` = tab navigator group
- \`app/(auth)/\` = auth screens group

### Logic/UI Separation — THE CORE RULE
- **Route file** (\`app/*.tsx\`) = logic container (hooks, store access, handlers, navigation)
- **Screen UI** (\`src/screens/*UI.tsx\`) = pure UI (props-driven, no store/API/navigation)
- UI components do NOT import router, store, or API — everything via props

### Project Structure
\`\`\`
app/                    # Expo Router routes
├── _layout.tsx         # Root layout (providers + auth guard)
├── (auth)/
│   ├── _layout.tsx     # Auth stack
│   └── login.tsx       # LoginRoute (logic only)
└── (tabs)/
    ├── _layout.tsx     # Tab bar
    ├── index.tsx       # HomeRoute
    └── catalog.tsx     # CatalogRoute

src/
├── screens/            # Screen UI components (pure UI)
│   ├── LoginScreenUI.tsx
│   └── CatalogScreenUI.tsx
├── components/
│   └── ui/             # Button, TextInput, Card, Avatar
├── store/              # Zustand stores (auth.ts, cart.ts)
├── services/
│   ├── api/            # Axios client + domain services
│   └── storage/        # MMKV adapter (mmkv.ts)
├── hooks/              # TanStack Query hooks (useProducts, useAuth)
├── constants/          # colors.ts, layout.ts, config.ts
├── types/              # TypeScript types (models.ts, api.ts)
└── utils/              # Pure helpers (validators, formatters)
\`\`\`

## MCP Tool Usage

This project uses the \`react-native-expo-mcp\` server. Claude should call these tools automatically:

| When you are... | Call this tool |
|---|---|
| Creating a component, button, card, list item | \`get-component-patterns\` |
| Creating a new screen or route | \`get-screen-architecture\` |
| Working with navigation, routes, or auth guard | \`get-navigation-patterns\` |
| Creating a Zustand store or working with global state | \`get-state-patterns\` |
| Creating API services or data fetching hooks | \`get-api-patterns\` |
| Styling components with NativeWind | \`get-styling-patterns\` |
| Optimizing lists, images, bundle, or animations | \`get-performance-patterns\` |
| Deciding where to place a new file | \`get-project-structure\` |
| Writing TypeScript types or interfaces | \`get-typescript-patterns\` |
| Debugging memory leaks or performance issues | \`get-memory-optimization\` |

## Code Rules

### Components
- Use \`Pressable\` instead of \`TouchableOpacity\`
- Use \`expo-image\` instead of \`Image\`
- Use \`className\` (NativeWind) for styles
- \`React.memo\` for list item components
- Composable pattern for complex components (ProductCard.Image, ProductCard.Title)

### State Management
- **Zustand** for client state (auth, cart, preferences)
- **TanStack Query** for server state (products, orders, profiles)
- Always use **selectors**: \`useStore((s) => s.field)\` — never destructure the whole store
- \`useShallow\` for multiple values from one store
- MMKV persistence for auth and user preferences

### API
- Axios instance with interceptors (auth token injection, 401 auto-logout)
- Domain-grouped services: \`authService\`, \`productService\`
- Custom TanStack Query hooks: \`useProducts\`, \`useLogin\` — never call \`useQuery\` directly in components
- Query key convention: \`['entity', ...params]\`

### Navigation
- \`router.push()\` / \`router.replace()\` for navigation
- \`useLocalSearchParams<T>()\` for typed route params
- AuthGuard in root \`_layout.tsx\` — wait for \`navigationRef.isReady()\`
- Deep linking works automatically via file structure

### TypeScript
- Strict mode always enabled
- No \`any\` (use \`unknown\` with type guard if needed)
- Typed route params with \`useLocalSearchParams<T>()\`
- Path aliases: \`@/\` → \`./src/\`

### Styling
- NativeWind (Tailwind CSS) for 95% of styles
- Colors via Tailwind theme (\`tailwind.config.js\`) + JS constants (\`src/constants/colors.ts\`)
- \`cssInterop\` to enable className on third-party components
- Rule: if a value is used in 2+ files → move it to \`constants/\`

### Performance
- \`FlashList\` or \`FlatList\` for lists (NEVER ScrollView + map)
- \`getItemLayout\` for FlatList when item height is fixed
- \`expo-image\` with \`cachePolicy="memory-disk"\`
- WebP format for all images
- Direct submodule imports to enable tree-shaking (avoid barrel exports)
- Reanimated worklets for 60+ FPS animations
`;
}
