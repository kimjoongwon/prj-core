# vitest.config config 기획서

> 생성일: 2026-03-26
> 타입: config
> 위치: apps/tool/storybook/vitest.config.js

## 역할

이 파일은 config 성격의 경량 구성/배럴 책임을 가집니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| default export | Storybook browser project와 jsdom ui project의 Vitest 설정 계약 |
- `define.__STORYBOOK_OVERVIEW_MANIFEST_SOURCES__` | Storybook overview manifest 테스트가 raw source map을 `import.meta.glob` 없이 재사용하도록 주입하는 정적 상수 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-16 | overview manifest 테스트가 Storybook과 동일한 raw source map define을 사용하도록 설정 추가 | codex |
| 2026-03-27 | Storybook index/title 정규화로 초기 로딩 비용이 늘어난 환경을 고려해 ui 프로젝트 `testTimeout`을 30초로 상향 | codex |
| 2026-03-26 | 누락된 sidecar spec 신규 생성 | codex |
