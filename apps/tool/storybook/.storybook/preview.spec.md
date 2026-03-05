# preview.jsx Spec

## 목적
- Storybook Preview 전역 데코레이터와 파라미터를 정의합니다.
- Plate 소유권 배지와 기본 배경/정렬 규칙을 제공합니다.

## 핵심 동작
- 모든 스토리에 `NuqsAdapter`, `ToastProvider`를 적용합니다.
- 우측 상단에 `Plate Proprietary` 배지를 고정 표시합니다.
- 기본 배경을 `plate-dark`로 설정하고 Plate 색상 팔레트를 제공합니다.
- 스토리 정렬 우선순위를 `Auto > Inputs > Ui > Widget > Feature > Layouts > Page > Widgets`로 고정합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-05 | Plate 소유권 배지, 배경 팔레트, 스토리 정렬 규칙 추가 | codex |
