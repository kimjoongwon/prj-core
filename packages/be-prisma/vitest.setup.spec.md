# vitest.setup setup 기획서

> 생성일: 2026-04-06
> 타입: setup
> 위치: packages/be-prisma/vitest.setup.ts

## 역할

`@cocrepo/prisma` 패키지의 Vitest 실행 시 공통 초기화 포인트를 제공합니다.

## 규칙

- 현재는 package-local 테스트가 config 오류 없이 실행될 수 있도록 no-op placeholder를 유지합니다.
- 향후 전역 mock, fake timer, custom matcher가 필요하면 이 파일에 추가합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-06 | 누락된 Vitest setup 파일과 sidecar를 신규 추가 | codex |
