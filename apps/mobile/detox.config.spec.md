# mobile-app detox.config 기획서

> 생성일: 2026-04-14
> 타입: config
> 위치: apps/mobile/detox.config.js

## 역할

모바일 앱의 Detox E2E 실행 기준과 iOS/Android debug build 경로를 정의합니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| `apps` | iOS/Android debug binary 와 build 명령 |
| `devices` | 기본 simulator/emulator 설정 |
| `configurations` | Detox 실행 대상 조합 |
| `testRunner` | `apps/mobile/e2e/jest.config.js` 기반 Jest runner |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-14 | 모바일 Detox baseline 설정 신규 추가 | codex |
