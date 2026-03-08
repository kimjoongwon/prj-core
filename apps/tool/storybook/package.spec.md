# Storybook Package Spec

> 생성일: 2026-03-08
> 타입: package
> 위치: apps/tool/storybook/package.json

## 역할

`tool-storybook` 워크스페이스의 실행 스크립트를 정의합니다.
Turbo 표준 `build`/`start:dev` 계약에 맞춰 Storybook 개발 서버와 정적 빌드를 연결합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| `build` | Turbo `build` 태스크에서 호출되는 Storybook 정적 빌드 |
| `build-storybook` | Storybook CLI 직접 호출용 별칭 |
| `start:dev` | 로컬 Storybook 개발 서버 실행 |
| `type-check` | Storybook 앱 TypeScript 무출력 검사 |
| `test*` | Storybook 앱 Vitest 계열 실행 |

## 구현 체크리스트

- [x] Turbo가 인식하는 표준 `build` 스크립트를 제공
- [x] Storybook 정적 빌드 명령이 `storybook build`로 고정
- [x] 개발 서버는 `STORYBOOK_PORT` 환경 변수로 포트를 오버라이드 가능
- [x] 테스트와 타입 검사가 앱 루트에서 독립 실행 가능

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-08 | Turbo 표준 빌드 파이프라인에 포함되도록 `build` 스크립트 계약을 문서화 | codex |
