# types primitive 기획서

> 생성일: 2026-03-03
> 타입: primitive
> 위치: packages/fe-ui/src/display/layout/type.ts

## 역할

`Layout` primitive와 layout shell widget이 공유하는 props/type 계약을 정의합니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| LayoutUserInfo | 공개 계약 요소 |
| BottomNavItem | `icon`을 `AppIconName`으로 제한한 하단 네비게이션 계약 |
| LayoutProps | `desktopVariant`, body/sidebar class slot을 포함한 공개 계약 요소 |
| SidePanelProps | header/footer, 아이콘/설명 renderer를 포함한 공개 계약 요소 |
| HeaderBarProps | leading/context/user menu override를 포함한 공개 계약 요소 |
| BottomNavProps | 공개 계약 요소 |
| ActionFabProps | 공개 계약 요소 |
| OverlayMenuProps | 공개 계약 요소 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-23 | stacked-header 데스크톱 variant와 shell 확장 props를 계약에 추가 | codex |
| 2026-03-22 | nested type 경로를 `primitive/layout/type.ts`로 평탄화 | codex |
| 2026-03-11 | Layout 하단 네비게이션 아이콘 계약을 `AppIconName` 기반으로 정리 | codex |
| 2026-03-06 | 폴더 네이밍을 단수형(feature/control/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-03-04 | Layout 슬롯 기반 계약으로 타입 구조 재정의 | codex |
