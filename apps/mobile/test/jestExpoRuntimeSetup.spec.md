# 모바일 Jest Expo 런타임 setup 기획서

## 대상 파일

- `jestExpoRuntimeSetup.js`

## 목적

Expo/Jest 테스트 환경에서 React Native 및 Expo 런타임이 기대하는 전역 API가 Node 테스트 프로세스에 없을 때 발생하는 초기화 오류를 방지합니다.

## 핵심 동작

- Node의 `TextEncoder`, `TextDecoder`, `URL`, `URLSearchParams`를 `globalThis`에 주입합니다.
- stream encoder/decoder와 `structuredClone`의 최소 shim을 제공합니다.
- Expo import meta 접근을 위한 `__ExpoImportMetaRegistry` shim을 제공합니다.