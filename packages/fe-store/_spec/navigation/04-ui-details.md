# 04. UI 상세 (역기획)

> 이 문서는 기존 코드를 분석하여 자동 생성되었습니다.

## 데이터 모델 (L7 Entity)

> 네비게이션 시스템은 백엔드 DB 엔티티를 사용하지 않습니다.
> 모든 데이터는 프론트엔드 클래스와 상수로 관리됩니다.

### NavItem 클래스

```typescript
// packages/fe-store/src/stores/navItem.ts

class NavItem {
  readonly id: string;           // 아이템 고유 ID
  readonly label: string;        // 표시 라벨
  readonly path: string | undefined;  // 이동 경로 (children 있으면 undefined)
  readonly icon: string | undefined;  // Lucide 아이콘 이름
  readonly subject: string;      // 권한 체크용 subject
  readonly children: NavItem[];  // 하위 아이템
  readonly tabs: TabConfig[];    // v7.0: 3depth 탭 목록
  private _active: boolean;      // 활성화 상태

  // Getters
  get active(): boolean;
  get hasChildren(): boolean;
  get hasTabs(): boolean;
  get firstChildPath(): string | undefined;
  get activeChild(): NavItem | undefined;

  // Methods
  setActive(value: boolean): void;
  resetChildrenActive(): void;
  findChildById(id: string): NavItem | undefined;
  findChildByPath(path: string): NavItem | undefined;
  findTabByPath(path: string): TabConfig | undefined;
}
```

### 타입 정의

```typescript
// packages/common-type/src/navigation.ts

// 탭 설정 (v7.0 신규)
interface TabConfig {
  id: string;
  label: string;
  href: string;
}

// 네비게이션 아이템 설정
interface NavItemConfig {
  id: string;
  label: string;
  path?: string;
  icon?: string;
  subject: string;
  children?: NavItemConfig[];
  tabs?: TabConfig[];  // v7.0 신규
}

// FAB 액션
interface FABAction {
  id: string;
  label: string;
  icon: string;
  subject: string;
  href?: string;       // 페이지 이동 (modal과 택1)
  modal?: string;      // 모달 열기 (href와 택1)
}
```

### BottomTab 타입

```typescript
// packages/fe-store/src/stores/bottomTabStore.ts

interface BottomTabItem {
  id: string;
  label: string;
  icon: string;
  hasSubMenu: boolean;  // children 유무
}

interface BottomTabConfig {
  tabIds: string[];     // 표시할 1depth 메뉴 ID
  moreTabId?: string;   // "더보기" 탭 ID
}
```

---

## UI 컴포넌트 (L8 Component)

### AdminLayout Props

```typescript
interface AdminLayoutProps {
  // 네비게이션 데이터
  navItems: NavItem[];
  selectedNavItem: NavItem | null;
  selectedSubNavItem: NavItem | null;
  expandedNavItemIds: Set<string>;
  
  // 모바일 데이터
  bottomTabItems: BottomTabItem[];
  activeBottomTabId: string | null;
  isSubMenuOpen: boolean;
  subMenuTitle: string;
  subMenuItems: NavItem[];
  isFABOpen: boolean;
  fabActions: FABAction[];
  
  // 핸들러
  onNavItemClick: (navItemId: string) => void;
  onSubNavItemClick: (subNavItemId: string) => void;
  onNavItemToggle: (navItemId: string) => void;
  onBottomTabClick: (tabId: string) => void;
  onSubMenuClose: () => void;
  onFABToggle: () => void;
  onFABActionClick: (actionId: string) => void;
  
  // 기타
  userInfo?: AdminUserInfo;
  logo?: ReactNode;
  headerActions?: ReactNode;
  onLogout?: () => void;
  children: ReactNode;
}
```

### NavTreePanel Props (Widget)

```typescript
interface NavTreePanelProps {
  items: NavTreeItem[];              // 메뉴 아이템 목록
  expandedKeys: Set<string>;         // 펼쳐진 아이템 ID
  onToggle: (id: string) => void;    // 펼침/접힘 토글
  onSelectItem: (id: string) => void;     // 단독 아이템 선택
  onSelectSubItem: (id: string) => void;  // 하위 아이템 선택
  width?: number;                    // 사이드바 너비 (기본 240px)
  className?: string;
}
```

### SideNav Props (Feature)

```typescript
interface SideNavProps {
  width?: number;      // 사이드바 너비 (기본 240px)
  className?: string;
}
```

---

## 컴포넌트 스타일

### 사이드바 스타일

| 요소 | 스타일 |
|------|--------|
| 컨테이너 | `flex h-full flex-col border-r border-divider bg-content1` |
| 내부 영역 | `flex-1 overflow-y-auto p-3` |
| 단독 아이템 (기본) | `flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/70` |
| 단독 아이템 (활성) | `bg-primary/10 text-primary` |
| Accordion 트리거 | `rounded-lg px-3 py-2.5 data-[hover=true]:bg-default-100` |
| 하위 아이템 (기본) | `flex w-full items-center rounded-md py-2 pl-11 pr-3 text-sm text-foreground/60` |
| 하위 아이템 (활성) | `bg-primary/10 font-medium text-primary` |

### 하단 탭 스타일 (Mobile)

| 요소 | 스타일 |
|------|--------|
| 컨테이너 | `fixed bottom-0 left-0 right-0 z-50 border-t border-divider bg-content1` |
| 탭 리스트 | `w-full grid grid-cols-5 gap-0 p-0` |
| 탭 아이템 | `h-16 px-2` |
| 아이콘 (기본) | `h-6 w-6 text-foreground/60` |
| 아이콘 (활성) | `text-primary` |
| 라벨 (기본) | `text-xs text-foreground/60` |
| 라벨 (활성) | `font-medium text-primary` |

### SubMenuList 스타일 (Mobile)

| 요소 | 스타일 |
|------|--------|
| 컨테이너 | `fixed inset-0 z-40 bg-content1 pt-16` |
| 아이템 (기본) | `flex w-full items-center rounded-lg px-4 py-3 text-left text-foreground/70` |
| 아이템 (활성) | `bg-primary/10 font-medium text-primary` |

### FAB 스타일 (Mobile)

| 요소 | 스타일 |
|------|--------|
| 위치 | `fixed bottom-20 right-4 z-50` |
| 버튼 크기 | `h-14 w-14 rounded-full` |
| 액션 아이템 | 버튼 위에 세로로 펼쳐짐 |

---

## 반응형 브레이크포인트

| 클래스 | 크기 | 레이아웃 |
|--------|------|----------|
| 기본 (< md) | < 768px | Mobile: Header + Main + BottomTab + FAB |
| md 이상 | >= 768px | Desktop: Sidebar + Header + Main |

### CSS 클래스 패턴

```typescript
// 데스크톱 전용
<div className="hidden md:block">...</div>

// 모바일 전용
<div className="md:hidden">...</div>

// 모바일에서 하단 여백 (BottomTab 높이만큼)
<main className="pb-20 md:pb-6">...</main>
```

---

## 아이콘 시스템

### 사용 라이브러리

- **Lucide React**: 메뉴 아이콘 렌더링

### 아이콘 렌더링 유틸

```typescript
// packages/fe-ui/src/utils/iconUtils.ts

export function renderLucideIcon(
  iconName: string,      // Lucide 아이콘 이름 (예: "Users", "Bell")
  className: string,     // 적용할 CSS 클래스
  size: number          // 아이콘 크기
): ReactNode;
```

### 메뉴별 아이콘 매핑

| 메뉴 | 아이콘 |
|------|--------|
| 대시보드 | LayoutDashboard |
| 회원 | Users |
| 예약 | CalendarCheck |
| 알림 | Bell |
| 문의 | MessageSquare |
| 콘텐츠 | FileText |
| 템플릿 | LayoutTemplate |
| 세션 | Clock |
| 시설 | Building |
| 관리자 | UserCog |
| 역할/권한 | Shield |
| 더보기 | Ellipsis |

### FAB 액션 아이콘

| 액션 | 아이콘 |
|------|--------|
| 오늘 예약 | CalendarCheck |
| 빠른 예약 | CalendarPlus |
| 회원 검색 | Search |

---

## SSR 대응

### isMounted 패턴

```typescript
function useIsMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,   // 클라이언트: true
    () => false,  // 서버: false
  );
}
```

### 적용 컴포넌트

| 컴포넌트 | 이유 |
|----------|------|
| SubNav | subNavItems가 Store에서 동적 계산 |
| SubMenuList | subNavItems가 Store에서 동적 계산 |
| BottomTab | navItems가 Store에서 동적 계산 |