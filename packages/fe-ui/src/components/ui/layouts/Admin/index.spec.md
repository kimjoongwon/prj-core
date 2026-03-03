# Admin Layout UI 컴포넌트 기획서

> 생성일: 2026-02-18
> 타입: ui
> 위치: packages/fe-ui/src/components/ui/layouts/Admin/

## 역할

관리자 페이지의 반응형 레이아웃 컴포넌트 (v7.0). 데스크톱에서는 Header + Sidebar + Main, 모바일에서는 Header + Main + BottomTab + FAB + SubMenuList 구조를 제공한다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
[데스크톱 레이아웃 (>= md, 768px 이상)]
┌─────────────────────────────────────────────────────────────────┐
│ [LOGO]   관리자 시스템          [알림] [사용자: 홍길동] [로그아웃] │  ← AdminHeader
├────────────────┬────────────────────────────────────────────────┤
│                │                                                │
│  대시보드      │                                                │
│  회원 관리   > │   [페이지 콘텐츠 영역 - children]              │
│    ├ 회원 목록 │                                                │
│    └ 회원 등록 │   페이지 헤더 영역, 섹션 영역 등               │
│  역할 관리     │                                                │
│  설정          │                                                │
│                │                                                │
│  (항상 펼침)   │                                                │
│                │                                                │
│ AdminSidebar   │              Main                              │
└────────────────┴────────────────────────────────────────────────┘

[모바일 레이아웃 (< md, 768px 미만)]
┌──────────────────────────────────────────┐
│ [LOGO]  관리자 시스템          [사용자]  │  ← AdminHeader (간소화)
├──────────────────────────────────────────┤
│                                          │
│  [페이지 콘텐츠 영역 - children]         │  ← Main (전체 너비)
│                                          │
│                                          │
│                                          │
├──────────────────────────────────────────┤
│  [대시보드]  [회원]  [역할]  [+]  [설정] │  ← AdminBottomTab
└──────────────────────────────────────────┘
       [+] 탭 클릭 → AdminFAB (플로팅 버튼)
       [회원] 탭 클릭 → AdminSubMenuList (서브메뉴 오버레이)

[AdminFAB - 모바일 플로팅 액션 버튼 (FAB 열림)]
┌──────────────────────────────────────────┐
│                          [ 회원 등록  ] │  ← FAB 액션 1
│                          [ 역할 생성  ] │  ← FAB 액션 2
│                                   [x]  │  ← FAB 닫기 버튼
├──────────────────────────────────────────┤
│  [대시보드]  [회원]  [역할]  [x]  [설정] │  ← BottomTab (FAB 열림 상태)
└──────────────────────────────────────────┘

[AdminSubMenuList - 모바일 서브메뉴 오버레이]
┌──────────────────────────────────────────┐
│  회원 관리                        [닫기] │  ← subMenuTitle
│  ─────────────────────────────────────  │
│  회원 목록                              │
│  회원 등록                              │
│  회원 상세                              │
└──────────────────────────────────────────┘
  하단에서 슬라이드업 또는 오버레이
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| 데스크톱 (>= md) | Header + 고정 Sidebar(왼쪽) + Main(오른쪽) |
| 모바일 (< md) | Header + Main(전체) + BottomTab(하단) |
| FAB 열림 | 플로팅 액션 버튼 목록 표시 |
| SubMenu 열림 | 서브메뉴 오버레이 표시 |

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
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
| 2026-03-03 | Scaffold 제거 및 페이지 헤더 영역/섹션 영역 용어 정리 | codex |
