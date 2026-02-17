export function getStep10(): string {
  return `# Крок 10 — OTA Updates (expo-updates)

## 10.1 Що таке OTA Updates?

**Over-The-Air (OTA) Updates** дозволяють оновлювати JavaScript-бандл БЕЗ перевидання через App Store / Google Play.

Користувач відкриває додаток → завантажується новий бандл → наступний запуск вже з оновленням.

**Обмеження**: OTA НЕ може оновити нативний код (нові нативні модулі потребують нової збірки).

## 10.2 Встановлення

\`\`\`bash
npx expo install expo-updates
\`\`\`

## 10.3 Конфігурація app.json

\`\`\`json
{
  "expo": {
    "updates": {
      "enabled": true,
      "checkAutomatically": "ON_LOAD"
    },
    "runtimeVersion": {
      "policy": "appVersion"
    }
  }
}
\`\`\`

**Runtime Version** — визначає сумісність оновлень:
- \`"appVersion"\` — прив'язка до версії додатку
- Оновлення застосовується тільки якщо runtime version збігається

## 10.4 Публікація оновлень

\`\`\`bash
# Публікація OTA оновлення
eas update --branch production --message "Fix checkout bug"

# Для staging
eas update --branch preview --message "New feature: filters"
\`\`\`

## 10.5 Канали (channels) та гілки (branches)

\`\`\`
Channel         → Branch
─────────────────────────
production      → production
preview         → preview
development     → development
\`\`\`

Зв'яжіть channel з EAS build profile в \`eas.json\`:

\`\`\`json
{
  "build": {
    "production": {
      "channel": "production"
    },
    "preview": {
      "channel": "preview"
    }
  }
}
\`\`\`

## 10.6 Програмна перевірка оновлень

### Рекомендований підхід: useUpdates() hook

\`\`\`tsx
import { useUpdates } from 'expo-updates';

function UpdateChecker() {
  const {
    currentlyRunning,
    isUpdateAvailable,
    isUpdatePending,
    isChecking,
    isDownloading,
    availableUpdate,
    checkError,
    downloadError,
  } = useUpdates();

  useEffect(() => {
    if (isUpdatePending) {
      // Оновлення завантажено — перезапуск
      Updates.reloadAsync();
    }
  }, [isUpdatePending]);

  const handleCheckUpdate = () => {
    Updates.checkForUpdateAsync();
  };

  const handleDownload = () => {
    if (isUpdateAvailable) {
      Updates.fetchUpdateAsync();
    }
  };

  return null; // або UI для показу статусу оновлення
}
\`\`\`

### Альтернатива: imperative API

\`\`\`tsx
import * as Updates from 'expo-updates';

async function checkForUpdates() {
  if (__DEV__) return; // Не перевіряти в dev mode

  try {
    const update = await Updates.checkForUpdateAsync();
    if (update.isAvailable) {
      await Updates.fetchUpdateAsync();
      // Перезапуск з новим оновленням
      await Updates.reloadAsync();
    }
  } catch (error) {
    console.log('Error checking for updates:', error);
  }
}
\`\`\`

Можна викликати при:
- Запуску додатку
- Поверненні з фону (AppState)
- Pull-to-refresh

## 10.7 Rollback

Якщо оновлення зламало додаток:

\`\`\`bash
# Подивитись історію оновлень
eas update:list --branch production

# Откотити — опублікувати попередню версію
eas update:republish --group <update-group-id>
\`\`\`

## 10.8 Best Practices

1. **Завжди тестуйте OTA на preview** перед production
2. **Runtime version** — змінюйте при зміні нативного коду
3. **useUpdates() hook** — рекомендований підхід для реактивного відстеження оновлень
4. **Моніторинг** — відстежуйте adoption rate через EAS dashboard

✅ **Checkpoint**: expo-updates налаштовано, OTA публікація працює через \`eas update\`
`;
}
