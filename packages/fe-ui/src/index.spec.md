# index 배럴 기획서

> 생성일: 2026-03-03
> 타입: index
> 위치: packages/fe-ui/src/index.ts

## 역할

이 파일은 `@cocrepo/ui` 컴포넌트 공개 진입점에서 `src/*` 계층 배럴 export를 구성합니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| `./feature` | Feature 계층 export |
| `./input` | Input 계층 export |
| `./layout` | Layout 계층 export |
| `./page` | Page 계층 export |
| `./primitive` | Primitive 계층 export |
| `./widget` | Widget 계층 통합 export |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-06 | `./ui` 배럴 export를 `./primitive`로 변경 | codex |
| 2026-03-06 | 폴더 네이밍을 단수형(feature/input/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-03-06 | feature 디렉토리를 features로 이관하고 경로 표기를 동기화 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-03-06 | `widget` 배럴 제거 후 `widgets` 단일 진입점으로 통합 | codex |
| 2026-03-06 | widget 경로를 widgets로 통합 | codex |
| 2026-03-06 | feature 배럴 경로를 features로 통합 | codex |
