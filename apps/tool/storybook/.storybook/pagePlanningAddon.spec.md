# pagePlanningAddon.jsx Spec

## 목적
- Storybook manager 우측 패널에 page planning addon panel을 등록합니다.

## 핵심 동작
- manager `useParameter("pagePlanningManifest")`를 사용해 preview가 시드한 overview manifest를 읽습니다.
- Storybook panel title은 `Planning`으로 고정합니다.
- panel 본문은 `PagePlanningPanelView`를 사용해 summary/raw spec UI를 렌더링합니다.
- page story가 아닌 경우에도 panel은 유지되며 empty state를 표시합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-15 | Storybook manager 우측 패널에 page planning addon 등록 | codex |
