# Admin Layout UI 컴포넌트 기획서

> 생성일: 2026-02-18
> 타입: ui
> 위치: packages/fe-ui/src/components/ui/layouts/Admin/

## 역할

관리자 페이지의 반응형 레이아웃 컴포넌트 (v7.0). 데스크톱에서는 Header + Sidebar + Main, 모바일에서는 Header + Main + BottomTab + FAB + SubMenuList 구조를 제공한다.

## 하위 컴포넌트

| 컴포넌트 | 파일 | 역할 |
|----------|------|------|
| AdminLayout | AdminLayout.tsx | 메인 레이아웃 래퍼 |
| AdminHeader | AdminHeader.tsx | 상단 헤더 (사용자 정보, 액션) |
| AdminSidebar | AdminSidebar.tsx | 좌측 사이드바 (데스크톱 전용, md 이상) |
| AdminBottomTab | AdminBottomTab.tsx | 하단 탭 바 (모바일 전용, md 미만) |
| AdminFAB | AdminFAB.tsx | 플로팅 액션 버튼 (모바일 전용) |
| AdminSubMenuList | AdminSubMenuList.tsx | 서브메뉴 오버레이 (모바일 전용) |

## AdminLayout Props

```typescript
interface AdminLayoutProps {
  navItems: NavItem[];
  selectedNavItem: NavItem | null;
  selectedSubNavItem: NavItem | null;
  expandedNavItemIds: Set<string>;
  bottomTabItems: BottomTabItem[];
  activeBottomTabId: string | null;
  isSubMenuOpen: boolean;
  subMenuTitle: string;
  subMenuItems: NavItem[];
  isFABOpen: boolean;
  fabActions: FABAction[];
  onNavItemClick: (navItemId: string) => void;
  onSubNavItemClick: (subNavItemId: string) => void;
  onNavItemToggle: (navItemId: string) => void;
  onBottomTabClick: (tabId: string) => void;
  onSubMenuClose: () => void;
  onFABToggle: () => void;
  onFABActionClick: (actionId: string) => void;
  userInfo?: AdminUserInfo;
  logo?: ReactNode;
  headerActions?: ReactNode;
  onLogout?: () => void;
  children: ReactNode;
}
```

## 반응형 브레이크포인트

| 크기 | 레이아웃 |
|------|----------|
| >= md (768px) | Header + Sidebar(항상 펼침) + Main |
| < md | Header + Main + BottomTab + FAB + SubMenuList |

## 타입 정의

types.ts에 모든 Props 인터페이스 정의:
- `AdminUserInfo` - 사용자 정보
- `BottomTabItem` - 하단 탭 아이템
- `SubMenuItem` - 서브메뉴 아이템
- `AdminLayoutProps`, `AdminSidebarProps`, `AdminHeaderProps`
- `AdminBottomTabProps`, `AdminFABProps`, `AdminSubMenuListProps`

## 외부 타입 의존성

- `NavItem` from `@cocrepo/store`
- `FABAction`, `TabConfig` from `@cocrepo/type`

## HeroUI 매핑

순수 구현. observer로 감싸져 있음.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
