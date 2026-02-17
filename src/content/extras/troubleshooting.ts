export function getTroubleshooting(): string {
  return `# Troubleshooting — Типові проблеми та рішення

## Metro Bundler

### "Unable to resolve module"
\`\`\`bash
# Очистити кеш Metro
npx expo start --clear

# Якщо не допомогло
rm -rf node_modules
npm install
npx expo start --clear
\`\`\`

### Metro застряг / не оновлює
\`\`\`bash
# Зупинити Metro (Ctrl+C), потім:
watchman watch-del-all
rm -rf /tmp/metro-*
rm -rf node_modules/.cache
npx expo start --clear
\`\`\`

### "Invariant Violation: Module does not exist"
Зазвичай проблема з нативним модулем:
\`\`\`bash
# Для managed workflow
npx expo start --clear

# Для dev client / prebuild
npx expo prebuild --clean
eas build --profile development --platform <platform>
\`\`\`

## NativeWind / Tailwind

### Стилі не застосовуються
1. Перевірте \`tailwind.config.js\` — content paths мають включати ваші файли
2. Перевірте \`global.css\` імпортований в root layout
3. Перевірте \`metro.config.js\` — \`withNativeWind\` wrapper
4. Перезапустіть: \`npx expo start --clear\`

### "className" prop не працює на сторонньому компоненті
\`\`\`tsx
import { cssInterop } from 'nativewind';
import { Image } from 'expo-image';

// Зареєструйте компонент
cssInterop(Image, { className: 'style' });
\`\`\`

## iOS специфічні

### "No bundle URL present"
\`\`\`bash
# Очистити Xcode кеш
cd ios && pod deintegrate && pod install && cd ..
npx expo start --clear
\`\`\`

### CocoaPods помилки
\`\`\`bash
cd ios
pod deintegrate
pod cache clean --all
pod install
cd ..
\`\`\`

### Xcode build failed
\`\`\`bash
# Очистити Xcode derived data
rm -rf ~/Library/Developer/Xcode/DerivedData
# Або через Xcode: Product → Clean Build Folder (Cmd+Shift+K)
\`\`\`

## Android специфічні

### "Could not connect to development server"
\`\`\`bash
# Для емулятора — перенаправити порт
adb reverse tcp:8081 tcp:8081

# Для фізичного пристрою — переконайтесь що на одній мережі
\`\`\`

### Gradle build failed
\`\`\`bash
cd android
./gradlew clean
cd ..

# Якщо не допомогло
rm -rf android/.gradle
rm -rf android/app/build
\`\`\`

### "SDK location not found"
Перевірте що ANDROID_HOME встановлено:
\`\`\`bash
echo $ANDROID_HOME
# Має бути щось на кшталт: /Users/<user>/Library/Android/sdk

# Додайте до ~/.zshrc якщо немає:
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
\`\`\`

## EAS Build

### Build failed — "Credentials not found"
\`\`\`bash
eas credentials
# Слідуйте інструкціям для створення/оновлення credentials
\`\`\`

### Build takes too long
- Використовуйте кеш: EAS автоматично кешує node_modules
- Перевірте \`.easignore\` — виключіть непотрібні файли
- Для iOS: використовуйте \`resourceClass: "m1-medium"\` або вище

### OTA Update не застосовується
1. Перевірте \`runtimeVersion\` збігається між build та update
2. Перевірте channel збігається
3. Закрийте та відкрийте додаток повністю (не просто swipe)

## Zustand / MMKV

### "Cannot read property 'getString' of undefined" (MMKV)
MMKV потребує нативного модуля → не працює в Expo Go:
\`\`\`bash
# Використовуйте dev client
eas build --profile development
npx expo start --dev-client
\`\`\`

### Store не персиститься
Перевірте:
1. \`persist\` middleware додано
2. \`storage: createJSONStorage(() => zustandStorage)\`
3. MMKV instance створено правильно
4. Запускаєте в dev client (не Expo Go)

## TypeScript

### Path aliases не резолвляться
1. Перевірте \`tsconfig.json\` — \`paths\` та \`baseUrl\`
2. Перевірте \`babel.config.js\` — \`module-resolver\` plugin
3. Перезапустіть Metro: \`npx expo start --clear\`
4. Перезапустіть TypeScript server в IDE

## Загальне "ядерне" рішення

Коли нічого не допомагає:
\`\`\`bash
# Повне очищення
rm -rf node_modules
rm -rf .expo
rm -rf ios/Pods ios/build
rm -rf android/.gradle android/app/build
watchman watch-del-all
npm install
cd ios && pod install && cd ..
npx expo start --clear
\`\`\`
`;
}
