import { PatternSections, resolvePattern } from './pattern-helper';

// ─── Full sections (with code examples) ─────────────────────────────

const sections: Record<string, string> = {
  'folder-tree': `## Full Folder Tree

\`\`\`
my-app/
├── app/                          # Expo Router — file-based routes
│   ├── _layout.tsx               # Root layout (providers, auth guard)
│   ├── index.tsx                 # Entry point (redirect to tabs or auth)
│   ├── +not-found.tsx            # 404 screen
│   ├── (auth)/
│   │   ├── _layout.tsx           # Auth stack layout
│   │   ├── login.tsx             # /login route
│   │   └── register.tsx          # /register route
│   └── (tabs)/
│       ├── _layout.tsx           # Tab bar layout
│       ├── index.tsx             # Home tab
│       ├── catalog.tsx           # Catalog tab
│       └── profile.tsx           # Profile tab
│
├── src/
│   ├── screens/                  # Screen UI components (pure UI, props-driven)
│   │   ├── LoginScreenUI.tsx
│   │   ├── CatalogScreenUI.tsx
│   │   └── ProfileScreenUI.tsx
│   │
│   ├── components/               # Reusable UI components
│   │   └── ui/                   # Core design system
│   │       ├── Button.tsx
│   │       ├── TextInput.tsx
│   │       └── Card.tsx
│   │
│   ├── hooks/                    # Custom hooks (TanStack Query hooks)
│   │   ├── useProducts.ts
│   │   └── useAuth.ts
│   │
│   ├── store/                    # Zustand stores
│   │   ├── auth.ts               # Auth store with MMKV persistence
│   │   └── index.ts
│   │
│   ├── services/
│   │   ├── api/                  # API services
│   │   │   ├── client.ts         # Axios instance + interceptors
│   │   │   ├── auth.ts           # Auth API calls
│   │   │   └── products.ts       # Product API calls
│   │   └── storage/
│   │       └── mmkv.ts           # Zustand MMKV storage adapter
│   │
│   ├── types/                    # TypeScript type definitions
│   │   ├── auth.ts
│   │   └── product.ts
│   │
│   └── constants/                # App-wide constants
│       ├── colors.ts             # Color palette (JS values)
│       ├── layout.ts             # Screen dimensions, spacing
│       └── config.ts             # Environment config accessor
│
├── assets/                       # Static assets
├── env/                          # Environment configs (dev/staging/prod)
├── scripts/                      # Build scripts
├── app.json
├── babel.config.js
├── metro.config.js
├── tailwind.config.js
├── tsconfig.json
└── global.css
\`\`\``,

  'file-placement': `## Where to Place New Files

| What you're creating | Where it goes | Naming |
|---|---|---|
| New screen/route | \`app/(tabs)/name.tsx\` or \`app/(auth)/name.tsx\` | \`kebab-case.tsx\` |
| Screen UI component | \`src/screens/NameScreenUI.tsx\` | \`PascalCaseScreenUI.tsx\` |
| Reusable component | \`src/components/ui/Name.tsx\` | \`PascalCase.tsx\` |
| Custom hook | \`src/hooks/useName.ts\` | \`useCamelCase.ts\` |
| Zustand store | \`src/store/domain.ts\` | \`camelCase.ts\` |
| API service | \`src/services/api/domain.ts\` | \`camelCase.ts\` |
| Type definitions | \`src/types/domain.ts\` | \`camelCase.ts\` |
| Shared constant | \`src/constants/name.ts\` | \`camelCase.ts\` |`,

  naming: `## Naming Conventions

| Item | Convention | Example |
|---|---|---|
| Components | PascalCase | \`ProductCard.tsx\` |
| Screen UI | PascalCase + ScreenUI suffix | \`CatalogScreenUI.tsx\` |
| Hooks | camelCase with \`use\` prefix | \`useProducts.ts\` |
| Stores | camelCase (exports \`useXStore\`) | \`auth.ts\` → \`useAuthStore\` |
| API services | camelCase + Service suffix | \`productService\` |
| Props interfaces | PascalCase + Props suffix | \`ButtonProps\`, \`CatalogScreenUIProps\` |
| Constants (values) | UPPER_SNAKE_CASE | \`SCREEN_WIDTH\`, \`API_TIMEOUT\` |
| Config objects | camelCase | \`colors\`, \`spacing\` |
| Route files | kebab-case | \`login.tsx\`, \`product-detail.tsx\` |`,

  'import-aliases': `## Import Aliases

\`\`\`json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@screens/*": ["./src/screens/*"],
      "@hooks/*": ["./src/hooks/*"],
      "@store/*": ["./src/store/*"],
      "@services/*": ["./src/services/*"],
      "@constants/*": ["./src/constants/*"]
    }
  }
}
\`\`\`

\`\`\`js
// babel.config.js — module-resolver for runtime alias resolution
plugins: [
  ['module-resolver', {
    alias: {
      '@': './src',
      '@components': './src/components',
      '@screens': './src/screens',
      '@hooks': './src/hooks',
      '@store': './src/store',
      '@services': './src/services',
      '@constants': './src/constants',
    },
  }],
]
\`\`\`

Usage:
\`\`\`tsx
import { Button } from '@components/ui/Button';
import { useAuthStore } from '@store/auth';
import { useProducts } from '@hooks/useProducts';
import { colors } from '@constants/colors';
\`\`\``,
};

// ─── Compact sections (rules only, no code) ─────────────────────────

const compactSections: Record<string, string> = {
  'folder-tree': `## Folder Tree
- \`app/\` — Expo Router file-based routes (layouts, tabs, auth, dynamic routes)
- \`src/screens/\` — Screen UI components (pure UI, props-driven)
- \`src/components/ui/\` — Reusable design system components
- \`src/hooks/\` — Custom hooks (TanStack Query wrappers)
- \`src/store/\` — Zustand stores
- \`src/services/api/\` — Axios client + domain services
- \`src/services/storage/\` — MMKV adapter
- \`src/types/\` — TypeScript type definitions
- \`src/constants/\` — Colors, layout, config`,

  'file-placement': `## File Placement
- Routes → \`app/(group)/name.tsx\`
- Screen UI → \`src/screens/NameScreenUI.tsx\`
- Components → \`src/components/ui/Name.tsx\`
- Hooks → \`src/hooks/useName.ts\`
- Stores → \`src/store/domain.ts\`
- API → \`src/services/api/domain.ts\`
- Types → \`src/types/domain.ts\`
- Constants → \`src/constants/name.ts\``,

  naming: `## Naming
- Components: PascalCase (\`ProductCard.tsx\`)
- Screen UI: PascalCase + ScreenUI (\`CatalogScreenUI.tsx\`)
- Hooks: \`use\` prefix (\`useProducts.ts\`)
- Stores: camelCase, exports \`useXStore\`
- Services: camelCase + Service (\`productService\`)
- Props: PascalCase + Props (\`ButtonProps\`)
- Constants: UPPER_SNAKE_CASE
- Routes: kebab-case`,

  'import-aliases': `## Import Aliases
- \`@/*\` → \`./src/*\` (main alias)
- Also: \`@components\`, \`@screens\`, \`@hooks\`, \`@store\`, \`@services\`, \`@constants\`
- Configured in both \`tsconfig.json\` (paths) and \`babel.config.js\` (module-resolver)`,
};

// ─── Export ──────────────────────────────────────────────────────────

const pattern: PatternSections = {
  title: 'Project Structure',
  sections,
  compactSections,
};

export const getProjectStructure = (topic?: string, compact?: boolean): string =>
  resolvePattern(pattern, topic, compact);
