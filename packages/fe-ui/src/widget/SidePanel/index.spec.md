# SidePanel Widget 기획서

> 생성일: 2026-03-22
> 타입: widget
> 위치: packages/fe-ui/src/widget/SidePanel/

## 역할

데스크톱 네비게이션 패널을 표시하는 layout shell widget입니다.
네비게이션 트리 데이터와 확장 상태는 props로 주입받고, store 연결은 feature 계층에서 담당합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| SidePanel | 데스크톱 사이드 패널 widget |
| SidePanelProps | `packages/fe-ui/src/primitive/layout/type.ts`에서 제공하는 props 계약 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-22 | `primitive/layout`에서 `widget/SidePanel`로 재배치하고 배럴 sidecar spec을 추가 | codex |
