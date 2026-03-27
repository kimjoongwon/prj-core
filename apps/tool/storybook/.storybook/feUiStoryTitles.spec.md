# feUiStoryTitles util 기획서

> 생성일: 2026-03-27
> 타입: util
> 위치: apps/tool/storybook/.storybook/feUiStoryTitles.js

## 역할

`packages/fe-ui/src` 아래 Storybook story title을 실제 폴더 구조와 일치하도록 정규화합니다.
Storybook index 생성 시점과 Vite 브라우저 transform 시점 모두 같은 규칙을 사용합니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| `isFeUiStoryFile` | 대상 파일이 `packages/fe-ui/src/**/*.stories.*` 범위인지 판별 |
| `getFeUiStoryTitle` | `packages/fe-ui/src` 상대 경로를 sidebar title로 변환 |
| `applyFeUiStoryTitleTransform` | Story module의 meta `title`을 정규화된 경로로 교체/주입 |
| `createFeUiStoryIndexer` | 기존 CSF indexer를 감싸 index entry title도 동일 규칙으로 덮어씀 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-27 | fe-ui 실제 폴더 구조를 Storybook sidebar title에 강제 적용하는 중앙 유틸 신규 추가 | codex |
