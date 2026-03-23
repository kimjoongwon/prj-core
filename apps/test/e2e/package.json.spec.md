# apps/test/e2e package.json 기획서

> 생성일: 2026-03-23
> 타입: config
> 위치: apps/test/e2e/package.json

## 역할

Playwright E2E 워크스페이스의 실행 스크립트를 정의합니다.

## 공개 계약

| 스크립트 | 설명 |
|------|------|
| `test:admin`, `test:idp` | 기본 로컬 E2E 실행 alias |
| `test:admin:local`, `test:idp:local` | local base URL + local webServer 전략으로 실행 |
| `test:admin:prod`, `test:idp:prod` | prod base URL 주입 기반으로 실행 |
| `test:admin:mobile:*`, `test:idp:mobile:*` | 모바일 프로젝트 실행 |
| `test:ui`, `test:headed`, `test:debug` | Playwright 보조 실행 모드 |

## 메모

- 환경 선택은 `E2E_ENV=local|prod`로 고정합니다.
- `prod` 실행은 `playwright.config.ts`가 요구하는 base URL 환경 변수를 함께 주입해야 합니다.
- 기본 `test:admin`, `test:idp`는 팀의 기존 로컬 사용 흐름을 유지하도록 `:local` alias로 둡니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-23 | local/prod 선택 실행 스크립트를 추가하고 기본 스크립트를 local alias로 정리 | codex |
