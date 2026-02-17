# react-native-expo-mcp

MCP-сервер для React Native + Expo розробки з Claude Code.

Дає Claude глибокі знання про:
- Expo, NativeWind, Zustand+MMKV, Axios, TanStack Query
- Feature-based архітектуру, Logic/UI separation, SOLID
- EAS Build, OTA Updates, CI/CD
- Expo Router та React Navigation (адаптивний контент)

## Встановлення

```bash
git clone https://github.com/zahargusyatin/react-native-expo-mcp.git
cd react-native-expo-mcp
npm install
npm run build
```

## Підключення до Claude Code

```bash
claude mcp add --global react-native-expo -- node /path/to/react-native-expo-mcp/dist/index.js
```

Після цього в **будь-якому проекті** Claude бачить 6 tools з MCP.

## Tools

| Tool | Опис |
|---|---|
| `get-setup-guide` | Покроковий гайд (13 кроків), адаптований під роутер |
| `get-best-practices` | SOLID, архітектура, стилі, компоненти, state, навігація, performance |
| `generate-project-files` | Starter файли для нового проекту (2 варіанти по роутеру) |
| `generate-claude-md` | CLAUDE.md з правилами проекту |
| `get-troubleshooting` | Типові проблеми та рішення |
| `get-cheat-sheet` | Шпаргалка команд (Expo CLI, EAS CLI, debugging) |

## Параметр `router`

Tools адаптуються під вибір навігації:

- `expo-router` — file-based routing (як Next.js)
- `react-navigation` — component-based routing

## Сценарії використання

### Новий проект
```
"Створи мобільний додаток для доставки"
→ Claude спитає: Expo Router чи React Navigation?
→ Викличе generate-project-files + generate-claude-md
→ Створить повний scaffold + правила
```

### Існуючий проект
```
"Як організувати екрани?"
→ Claude викличе get-best-practices(category: "architecture")
→ Адаптує під стек проекту (CLAUDE.md має пріоритет)
```

### Точкове питання
```
"Як настроїти OTA?" → get-setup-guide(step: 10)
"Metro не працює"   → get-troubleshooting()
"Команди EAS?"      → get-cheat-sheet()
```

## Prompt

`init-mobile-project` — інтерактивний помічник для створення нового проекту.

## Ліцензія

MIT
