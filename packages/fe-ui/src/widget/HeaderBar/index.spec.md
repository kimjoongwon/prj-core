# HeaderBar Widget 기획서

> 생성일: 2026-03-22
> 타입: widget
> 위치: packages/fe-ui/src/widget/HeaderBar/

## 역할

상단 헤더를 표시하는 layout shell widget입니다.
로그아웃, 사용자 메뉴, 보조 액션은 모두 props 슬롯으로 주입받고, 이 위젯은 시각 구조만 담당합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| HeaderBar | 콘솔 상단 헤더 widget |
| HeaderBarProps | `packages/fe-ui/src/display/layout/type.ts`에서 제공하는 props 계약 |
| LayoutUserInfo | `packages/fe-ui/src/display/layout/type.ts`에서 제공하는 사용자 정보 계약 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-22 | `primitive/layout`에서 `widget/HeaderBar`로 재배치하고 배럴 sidecar spec을 추가 | codex |
