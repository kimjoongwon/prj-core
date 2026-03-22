# ActionFab Widget 기획서

> 생성일: 2026-03-22
> 타입: widget
> 위치: packages/fe-ui/src/widget/ActionFab/

## 역할

모바일에서 퀵 액션 목록을 노출하는 layout shell widget입니다.
동작 상태와 액션 데이터는 모두 props로 주입받고, store 연결은 feature 계층에서 담당합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| ActionFab | 모바일 FAB widget |
| ActionFabProps | `packages/fe-ui/src/primitive/layout/type.ts`에서 제공하는 props 계약 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-22 | `primitive/layout`에서 `widget/ActionFab`로 재배치하고 배럴 sidecar spec을 추가 | codex |
