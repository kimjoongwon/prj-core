# metro.config 기획서

> 생성일: 2026-04-08
> 타입: config
> 위치: apps/mobile/metro.config.js

## 역할

Expo Metro 설정에 Uniwind를 연결해 `src/global.css`를 React Native 런타임 스타일 엔트리로 사용합니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| `getDefaultConfig` | Expo 기본 Metro 설정 로드 |
| `NODE_PATH` 주입 | pnpm workspace에서 `uniwind`가 `apps/mobile/node_modules`의 Metro 의존성을 해상하도록 보정 |
| `withUniwindConfig` | Uniwind Metro 변환기 적용 |
| `cssEntryFile` | HeroUI Native 스타일이 포함된 `src/global.css` 경로 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-08 | HeroUI Native quick start 대응용 Uniwind Metro 설정 신규 생성 | codex |
| 2026-04-08 | `uniwind@1.6.2` 기준 `withUniwindConfig` export 명으로 설정 보정 | codex |
| 2026-04-13 | pnpm workspace에서 `uniwind`가 `metro-cache`를 찾지 못해 실행이 실패하던 문제를 막기 위해 `apps/mobile/node_modules`를 `NODE_PATH`에 주입하도록 보정 | codex |
