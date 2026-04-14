# mobile-app e2e jest.config 기획서

> 생성일: 2026-04-14
> 타입: config
> 위치: apps/mobile/e2e/jest.config.js

## 역할

Detox E2E 실행용 Jest runner 설정을 정의합니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| `testMatch` | `apps/mobile/e2e/**/*.e2e.js` 탐색 |
| `setupFilesAfterEnv` | Detox init/cleanup 지원 파일 연결 |
| `testTimeout` | Detox app launch / simulator 지연 흡수 |
| `maxWorkers: 1` | 기기 자원 충돌 방지 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-14 | Detox init 파일과 jest-circus runner 연결 규칙을 추가 | codex |
| 2026-04-14 | 모바일 Detox Jest runner 설정 신규 추가 | codex |
