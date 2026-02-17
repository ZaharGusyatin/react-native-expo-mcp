export function getStep11(): string {
  return `# Крок 11 — CI/CD (GitHub Actions) [OPTIONAL]

## 11.1 Навіщо CI/CD?

Автоматизація збірки та публікації:
- Push в \`main\` → production build
- Push в \`develop\` → preview build
- Pull Request → lint + type check

## 11.2 GitHub Actions Workflow

Створіть \`.github/workflows/eas-build.yml\`:

\`\`\`yaml
name: EAS Build & Update

on:
  push:
    branches:
      - main
      - develop
  pull_request:
    branches:
      - main

jobs:
  lint-and-typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npx tsc --noEmit
      - run: npx eslint . --max-warnings 0

  build-preview:
    if: github.ref == 'refs/heads/develop'
    needs: lint-and-typecheck
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          token: \${{ secrets.EXPO_TOKEN }}
      - run: npm ci
      - run: eas build --profile preview --platform all --non-interactive

  build-production:
    if: github.ref == 'refs/heads/main'
    needs: lint-and-typecheck
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          token: \${{ secrets.EXPO_TOKEN }}
      - run: npm ci
      - run: eas build --profile production --platform all --non-interactive

  ota-update:
    if: github.ref == 'refs/heads/main'
    needs: lint-and-typecheck
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          token: \${{ secrets.EXPO_TOKEN }}
      - run: npm ci
      - run: eas update --branch production --message "\${{ github.event.head_commit.message }}"
\`\`\`

## 11.3 Налаштування secrets

В GitHub → Settings → Secrets → Actions:

1. \`EXPO_TOKEN\` — токен з https://expo.dev/accounts/[your-account]/settings/access-tokens

\`\`\`bash
# Створити токен:
eas login
# Перейдіть на expo.dev → Settings → Access Tokens → Create
\`\`\`

## 11.4 OTA Update Workflow (окремий, для швидших оновлень)

\`\`\`yaml
# .github/workflows/eas-update.yml
name: OTA Update

on:
  workflow_dispatch:
    inputs:
      branch:
        description: 'Update branch'
        required: true
        default: 'production'
        type: choice
        options:
          - production
          - preview
      message:
        description: 'Update message'
        required: true

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          token: \${{ secrets.EXPO_TOKEN }}
      - run: npm ci
      - run: eas update --branch \${{ inputs.branch }} --message "\${{ inputs.message }}"
\`\`\`

## 11.5 PR Preview

Додайте коментар з QR-кодом до PR:

\`\`\`yaml
# Додайте до lint-and-typecheck job або створіть окремий
- name: EAS Update for PR
  if: github.event_name == 'pull_request'
  run: |
    eas update --branch pr-\${{ github.event.pull_request.number }} --message "PR #\${{ github.event.pull_request.number }}"
\`\`\`

✅ **Checkpoint**: GitHub Actions налаштовано, автоматичні збірки при push в main/develop
`;
}
