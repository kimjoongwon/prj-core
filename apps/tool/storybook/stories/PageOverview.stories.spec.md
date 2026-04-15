# PageOverview.stories.tsx Spec

## 목적
- Storybook 사이드바의 `overview` 루트에서 page catalog와 React Flow workspace 진입 스토리를 제공합니다.

## 핵심 동작
- `buildOverviewManifest()` 결과를 사용해 repo 실제 상태를 반영한 overview screen을 렌더링합니다.
- layout은 `fullscreen`으로 고정해 Storybook 전용 정보 밀도를 확보합니다.
- docs description에 이 스토리가 admin/idp page coverage, flow review, page planning deep-link를 위한 entry point임을 명시합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| default export | `overview/Page Overview` story meta |
| `Default` | page overview canonical story |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-15 | overview story 설명을 React Flow workspace와 planning deep-link 중심으로 갱신 | codex |
| 2026-04-08 | page catalog/flow map 진입용 Storybook overview 스토리 신규 추가 | codex |
