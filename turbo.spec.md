# Turbo Pipeline Spec

> 생성일: 2026-03-08
> 타입: config
> 위치: turbo.json

## 역할

루트 Turborepo 태스크 파이프라인을 정의합니다.
워크스페이스별 입력/출력 규칙을 통해 캐시 정확도와 빌드 재현성을 관리합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| `build` | 기본 패키지 빌드 파이프라인 |
| `{workspace}#build` | 앱/패키지별 맞춤 입력/출력 규칙 |
| `start:dev` | 개발 서버용 비캐시 지속 태스크 |
| `type-check`, `lint`, `test` | 검사 계열 공통 태스크 |

## 구현 체크리스트

- [x] Next.js 앱은 `.next/**`를 출력으로 사용
- [x] NestJS 앱은 `dist/**`를 출력으로 사용
- [x] source-only 패키지는 빈 출력으로 캐시 일관성만 유지
- [x] `tool-storybook#build`는 Storybook 전용 입력과 `storybook-static/**` 출력을 사용

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-08 | `tool-storybook#build` 전용 입력/출력 규칙을 추가해 Storybook을 표준 Turbo 빌드 그래프에 포함 | codex |
