# Fix: MMKV crash, AuthGuard navigation, startup commands

## MMKV — lazy initialization (crash fix)
- `new MMKV()` was called at module top-level, causing `TypeError: Cannot read property 'prototype' of undefined` when native module isn't ready yet
- Replaced with lazy `getStorage()` function — MMKV instance is created only on first access

## AuthGuard — navigation readiness check
- `router.replace()` was called in `useEffect` before navigation state was initialized, causing `TypeError`
- Added `useRootNavigationState()` hook and `if (!navigationState?.key) return;` guard
- Added `navigationState?.key` to useEffect dependency array

## Startup commands — Expo Go incompatibility
- `react-native-mmkv` is a native module not supported in Expo Go
- Changed startup instructions from `npx expo start --clear` to `npx expo prebuild --clean` + `npx expo run:ios`
- Added a note explaining why `expo prebuild` is required
