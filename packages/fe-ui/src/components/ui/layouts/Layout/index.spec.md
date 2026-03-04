# Layout UI 컴포넌트 기획서

> 생성일: 2026-02-18
> 타입: ui
> 위치: packages/fe-ui/src/components/ui/layouts/Layout/

## 역할

공용 콘솔 레이아웃 UI 세트입니다.
`Layout`은 배치 전용이며, 나머지 컴포넌트(`HeaderBar`, `SidePanel`, `BottomNav`, `ActionFab`, `OverlayMenu`)는 슬롯 주입 대상으로 사용됩니다.

## 표준 위계

```text
App (서비스별 단일)
└── Layout
    └── Page
        └── Section
```

- 이 폴더의 `Layout`은 표준 위계에서 `App`과 `Page` 사이의 배치 계층을 담당합니다.
- `Page`/`Section`은 `packages/fe-ui/src/components/layouts`에서 제공되며 `Layout` 내부 콘텐츠로 사용됩니다.

## 구성 요소

| 컴포넌트 | 파일 | 역할 |
|----------|------|------|
| Layout | Layout.tsx | 슬롯 기반 레이아웃 배치 |
| HeaderBar | HeaderBar.tsx | 상단 헤더 |
| SidePanel | SidePanel.tsx | 데스크톱 사이드 패널 |
| BottomNav | BottomNav.tsx | 모바일 하단 네비게이션 |
| ActionFab | ActionFab.tsx | 모바일 플로팅 액션 버튼 |
| OverlayMenu | OverlayMenu.tsx | 모바일 서브메뉴 오버레이 |

## Layout Props

```typescript
interface LayoutProps {
  header?: ReactNode;
  sidebar?: ReactNode;
  mobileBottomNav?: ReactNode;
  mobileFab?: ReactNode;
  mobileOverlayMenu?: ReactNode;
  className?: string;
  mainClassName?: string;
  children: ReactNode;
}
```

## 타입 정의

- `LayoutUserInfo`
- `BottomNavItem`
- `LayoutProps`
- `SidePanelProps`
- `HeaderBarProps`
- `BottomNavProps`
- `ActionFabProps`
- `OverlayMenuProps`

## 반응형 배치 원칙

- 데스크톱(`md` 이상): `sidebar + header + main`
- 모바일(`md` 미만): `header + main + mobileBottomNav + mobileFab + mobileOverlayMenu`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
| 2026-03-03 | Scaffold 제거 및 페이지 헤더 영역/섹션 영역 용어 정리 | codex |
| 2026-03-04 | Admin 접두사 컴포넌트를 Layout 공용 구조로 전면 개편 | codex |
| 2026-03-04 | `App > Layout > Page > Section` 위계 및 서비스별 단일 App 규칙 반영 | codex |
