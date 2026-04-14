# @cocrepo/mo-ui jest.config 기획서

> 생성일: 2026-04-14
> 타입: config
> 위치: packages/fe-mo-ui/jest.config.js

## 역할

모바일 공용 UI 패키지의 Jest unit test 실행 기준을 정의합니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| `preset: jest-expo` | Expo/RN 친화적 테스트 런타임 |
| `testMatch` | `packages/fe-mo-ui/src/**/*.test.ts(x)` 탐색 |
| preset 기본 transform | `jest-expo` preset 이 제공하는 Expo/RN transform 규칙을 그대로 사용 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-14 | `@cocrepo/mo-ui` Jest baseline 설정 신규 추가 | codex |
| 2026-04-14 | pnpm 경로에서 React Native setup 파일이 변환되도록 preset 기본 transform 정책 기준으로 정리 | codex |
