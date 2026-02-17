export function getRecommendations(): string {
  return `# Best Practice: Рекомендації

## Навчання

### Офіційна документація
- **Expo**: https://docs.expo.dev/
- **React Native**: https://reactnative.dev/
- **NativeWind**: https://www.nativewind.dev/
- **Zustand**: https://zustand-demo.pmnd.rs/
- **TanStack Query**: https://tanstack.com/query/latest

### Рекомендовані ресурси
- Expo blog для оновлень та best practices
- React Native Community на GitHub
- Callstack blog (автори React Navigation)

## Робота в команді

### Code Style

\`\`\`bash
# ESLint + Prettier
npx expo lint
\`\`\`

Рекомендований набір:
- \`eslint-config-expo\` — базова конфігурація для Expo
- \`prettier\` — форматування коду
- \`@typescript-eslint\` — правила для TypeScript

### Naming Conventions

| Тип | Convention | Приклад |
|---|---|---|
| Компоненти | PascalCase | \`ProductCard.tsx\` |
| Hooks | camelCase з use | \`useAuth.ts\`, \`useProducts.ts\` |
| Store | camelCase з use | \`useAuthStore\`, \`useCartStore\` |
| API service | camelCase | \`productsApi.ts\` |
| Types/Interfaces | PascalCase | \`Product\`, \`AuthState\` |
| Constants | UPPER_SNAKE | \`API_URL\`, \`MAX_RETRIES\` |
| Файли | kebab-case або PascalCase | \`api-client.ts\` або \`ApiClient.ts\` |

### Git Workflow

\`\`\`bash
# Branch naming
feature/add-cart-functionality
fix/login-error-handling
refactor/auth-store-simplification

# Commit messages (Conventional Commits)
feat: add product search functionality
fix: resolve login redirect loop
refactor: simplify cart store logic
chore: update expo sdk to v52
docs: add api integration guide
\`\`\`

### PR Checklist
- [ ] TypeScript — немає \`any\` (або мінімум з коментарем)
- [ ] Немає console.log (окрім dev-only)
- [ ] UI компоненти — чисті (props-driven)
- [ ] Нові store — з селекторами
- [ ] API — через TanStack Query hooks
- [ ] Тест на iOS та Android

## Баланс

### Коли NOT to optimize

1. **Premature optimization** — не оптимізуйте поки немає проблеми
2. **Over-engineering** — не створюйте абстракції для одного use case
3. **Chasing trends** — не мігруйте на нову бібліотеку заради нової бібліотеки

### Коли TO optimize

1. **Помітний лаг** — список лагає при скролі → FlashList, memo
2. **Великий бандл** — > 10MB → tree shaking, code splitting
3. **Повільний старт** — > 3с → lazy loading, reduce initial imports

### Практичні поради

- **Починайте просто** — додавайте складність коли потрібно
- **Вимірюйте** — React DevTools Profiler, Flipper
- **Автоматизуйте** — CI/CD, linting, type checking
- **Документуйте рішення** — CLAUDE.md, ADR (Architecture Decision Records)
- **Регулярно оновлюйте** — Expo SDK updates кожні ~3 місяці

## Безпека

### Основні правила

1. **Ніколи не зберігайте секрети в коді** — використовуйте env variables
2. **HTTPS тільки** — для всіх API calls
3. **Token storage** — MMKV (не AsyncStorage, не plain text)
4. **Certificate pinning** — для production API
5. **Input validation** — Zod на клієнті + серверна валідація
6. **Obfuscation** — \`react-native-obfuscating-transformer\` для production

### Expo SecureStore (альтернатива MMKV для секретів)

\`\`\`bash
npx expo install expo-secure-store
\`\`\`

\`\`\`tsx
import * as SecureStore from 'expo-secure-store';

// Для найбільш чутливих даних (tokens, keys)
await SecureStore.setItemAsync('auth_token', token);
const token = await SecureStore.getItemAsync('auth_token');
\`\`\`

> MMKV швидший, але SecureStore використовує Keychain (iOS) / Keystore (Android) — більш безпечний для токенів.
`;
}
