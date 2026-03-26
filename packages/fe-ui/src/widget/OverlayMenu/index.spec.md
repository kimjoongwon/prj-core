# OverlayMenu Widget 기획서

> 생성일: 2026-03-22
> 타입: widget
> 위치: packages/fe-ui/src/widget/OverlayMenu/

## 역할

모바일 서브메뉴를 오버레이로 보여주는 layout shell widget입니다.
메뉴 데이터와 선택 상태는 props로 주입받고, 열림/닫힘 상태 제어는 상위 feature가 담당합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| OverlayMenu | 모바일 오버레이 메뉴 widget |
| OverlayMenuProps | `packages/fe-ui/src/display/layout/type.ts`에서 제공하는 props 계약 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-22 | `primitive/layout`에서 `widget/OverlayMenu`로 재배치하고 배럴 sidecar spec을 추가 | codex |
