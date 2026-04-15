# manager.js Spec

## 목적
- Storybook Manager UI의 브랜드 테마를 정의합니다.
- Plate 소유권이 명확히 보이도록 브랜드 제목/이미지/색상을 통일합니다.
- page story의 기획을 우측 panel에서 볼 수 있는 manager addon 진입점을 포함합니다.

## 핵심 동작
- 다크 기반 Plate 테마를 적용합니다.
- 사이드바 헤더 브랜드명을 `PLATE`로 고정하고 Storybook 로고를 제거합니다.
- 사이드바 루트 표시와 패널 우측 배치를 설정하고, Planning 패널을 기본 선택/오픈 상태로 시작합니다.
- addon panel 기본 노출은 Storybook UI 옵션(`showAddonPanel`, `addonPanelInRight`)으로 강제합니다.
- manager 런타임에서 `pagePlanningAddon`을 함께 로드해 `Planning` panel을 등록합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-15 | Storybook addon panel을 기본 노출(`showAddonPanel`)로 강제해 Planning 패널이 숨겨지지 않도록 보강 | codex |
| 2026-04-15 | page story 진입 시 Planning 패널이 기본으로 펼쳐지도록 manager 기본 panel 선택/오픈 규칙 추가 | codex |
| 2026-04-15 | Storybook manager에 page planning addon import 계약 추가 | codex |
| 2026-03-05 | Plate 브랜딩 테마(manager) 신규 추가 | codex |
| 2026-03-05 | 사이드바 헤더 Storybook 텍스트/로고 제거 규칙 반영 | codex |
| 2026-03-05 | 상단 브랜드명을 PLATE로 고정(Storybook 문자열 제거) | codex |
