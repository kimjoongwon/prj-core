# BottomNav Widget 기획서

> 생성일: 2026-03-22
> 타입: widget
> 위치: packages/fe-ui/src/widget/BottomNav/

## 역할

모바일 하단 탭을 표시하는 layout shell widget입니다.
활성 탭 계산과 네비게이션 상태 연결은 feature 계층이 담당하고, 이 위젯은 순수 렌더링만 수행합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| BottomNav | 모바일 하단 탭 widget |
| BottomNavProps | `packages/fe-ui/src/primitive/layout/type.ts`에서 제공하는 props 계약 |
| BottomNavItem | `packages/fe-ui/src/primitive/layout/type.ts`에서 제공하는 아이템 계약 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-22 | `primitive/layout`에서 `widget/BottomNav`로 재배치하고 배럴 sidecar spec을 추가 | codex |
