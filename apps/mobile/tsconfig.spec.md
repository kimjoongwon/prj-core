# mobile-app tsconfig 기획서

> 생성일: 2026-04-14
> 타입: config
> 위치: apps/mobile/tsconfig.json

## 역할

모바일 앱의 기본 TypeScript 타입 검사 범위를 정의합니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| `extends: expo/tsconfig.base` | Expo 기본 TS 설정 재사용 |
| `paths` | `@/` alias 를 `src/` 기준으로 해석 |
| `exclude` | Jest unit test 파일을 기본 app type-check 범위에서 제외 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-14 | Jest unit test 파일을 app 기본 type-check 범위에서 제외하는 규칙 추가 | codex |
