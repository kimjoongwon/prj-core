# fe-mo-ui Jest Expo 런타임 setup 기획서

## 대상 파일

- `jestExpoRuntimeSetup.js`

## 목적

React Native UI 패키지의 Jest 테스트에서 Expo 런타임이 기대하는 전역 API를 Node 환경에 보강해 테스트 초기화 실패를 방지합니다.

## 핵심 동작

- Node의 `TextEncoder`, `TextDecoder`, `URL`, `URLSearchParams`를 `globalThis`에 주입합니다.
- stream encoder/decoder와 `structuredClone`의 최소 shim을 제공합니다.
- Expo import meta 접근을 위한 `__ExpoImportMetaRegistry` shim을 제공합니다.

## 변경 이력

| 날짜 | 변경 내용 |
| --- | --- |
| 2026-04-29 | fe-mo-ui Jest 테스트 통과를 위한 Expo 런타임 shim 파일의 역할을 문서화했습니다. |
