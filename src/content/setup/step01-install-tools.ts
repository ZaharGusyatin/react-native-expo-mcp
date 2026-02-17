export function getStep01(): string {
  return `# Крок 1 — Встановлення необхідних інструментів

## 1.1 Перевірка Node.js та npm

React Native потребує **Node.js 18+** та **npm 9+**:

\`\`\`bash
node --version   # Очікується: v18.x.x або вище
npm --version    # Очікується: 9.x.x або вище
\`\`\`

Якщо не встановлено — завантажте з https://nodejs.org/ (рекомендовано LTS версію).

Або через nvm:
\`\`\`bash
nvm install 20
nvm use 20
nvm alias default 20
\`\`\`

## 1.2 Встановлення Expo CLI та EAS CLI

\`\`\`bash
npm install -g expo-cli eas-cli
\`\`\`

Перевірка:
\`\`\`bash
expo --version
eas --version
\`\`\`

> Починаючи з Expo SDK 46+, глобальна установка \`expo-cli\` опціональна — більшість команд доступні через \`npx expo\`. Але EAS CLI потребує глобальної установки.

Авторизуйтесь в Expo:
\`\`\`bash
eas login
\`\`\`

## 1.3 Встановлення Watchman (лише macOS)

Watchman покращує продуктивність hot-reload:

\`\`\`bash
brew install watchman
watchman --version
\`\`\`

> Windows/Linux — пропустіть цей крок.

## 1.4 Додаткові інструменти

**iOS (лише macOS):**
\`\`\`bash
# Xcode — через App Store
sudo xcodebuild -license accept
xcode-select --install
\`\`\`

**Android:**
\`\`\`bash
# Встановіть Android Studio з https://developer.android.com/studio
# Додайте до ~/.zshrc:
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
\`\`\`

✅ **Checkpoint**: Node.js 18+, Expo CLI, EAS CLI встановлені
`;
}
