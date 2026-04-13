# fe-mo-ui tsconfig 기획서

> 생성일: 2026-04-08
> 타입: config
> 위치: packages/fe-mo-ui/tsconfig.json

## 역할

모바일 UI 패키지의 TypeScript 타입 검사 기준을 정의합니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| `moduleResolution: bundler` | Expo / Metro 친화적인 모듈 해석 |
| `noEmit: true` | source-direct 패키지 정책 유지 |
| `include` | 루트 엔트리와 `src` 전체 코드 포함 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-08 | 모바일 UI 패키지용 TypeScript 설정 신규 생성 | codex |
