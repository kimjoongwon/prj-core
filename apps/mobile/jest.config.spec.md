# mobile-app jest.config 기획서

> 생성일: 2026-04-14
> 타입: config
> 위치: apps/mobile/jest.config.js

## 역할

모바일 앱의 Jest unit test 실행 기준을 정의합니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| `preset: jest-expo` | Expo/RN 친화적 테스트 런타임 |
| `testMatch` | `apps/mobile/src/**/*.test.ts(x)` unit test 탐색 |
| `moduleNameMapper` | `@/` alias 와 CSS stub 해석 |
| preset 기본 transform | `jest-expo` preset 이 제공하는 Expo/RN transform 규칙을 그대로 사용 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-14 | 모바일 Jest unit test baseline 설정 신규 추가 | codex |
| 2026-04-14 | pnpm 환경에서 React Native setup 변환이 깨지지 않도록 preset 기본 transform 정책을 유지하도록 정리 | codex |
