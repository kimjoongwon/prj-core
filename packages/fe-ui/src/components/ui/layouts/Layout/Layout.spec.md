# Layout ui 기획서

> 생성일: 2026-03-03
> 타입: ui
> 위치: packages/fe-ui/src/components/ui/layouts/Layout/Layout.tsx

## 역할

`App > Layout > Page > Section` 위계에서 Layout 계층의 배치 전용 컴포넌트입니다.
Header/Sidebar/FAB/BottomNav/OverlayMenu는 외부 슬롯으로 주입받고, 내부에서는 구조와 반응형 배치만 담당합니다.

## 위계 책임

| 레벨 | 책임 |
|------|------|
| App | 서비스 루트에서 단일 인스턴스로 전체 앱 컨텍스트를 감쌉니다. |
| Layout | 전역 내비게이션/헤더/모바일 네비게이션 슬롯 배치를 담당합니다. |
| Page | 화면 단위 콘텐츠 구조를 배치합니다. |
| Section | Page 내부 하위 구역 구조를 배치합니다. |

## 공개 계약

| 항목 | 설명 |
|------|------|
| Layout | 슬롯 기반 레이아웃 래퍼 |

## 슬롯

| 슬롯 | 설명 |
|------|------|
| header | 상단 헤더 영역 |
| sidebar | 데스크톱 좌측 패널 영역 |
| mobileBottomNav | 모바일 하단 네비게이션 |
| mobileFab | 모바일 FAB 영역 |
| mobileOverlayMenu | 모바일 오버레이 메뉴 |
| children | 메인 콘텐츠 영역 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-03-04 | Admin 결합형 구조를 슬롯 기반 Layout 구조로 변경 | codex |
| 2026-03-04 | `App > Layout > Page > Section` 위계 책임 정의 추가 | codex |
