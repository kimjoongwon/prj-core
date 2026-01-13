# AdminLayout & MenuSystem v7.0 기술 설계서

**기획서:** [README.md](./2025-12-30-AdminLayoutAndMenuSystem/README.md)
**작성일:** 2026-01-13
**Stage:** 1 - 데이터 설계

---

## 1. 개요

Admin 앱의 레이아웃 및 메뉴 시스템을 v7.0 기획에 맞게 재구현합니다.

### 주요 변경사항

| 항목 | 기존 (v6.0) | 변경 (v7.0) |
|------|-------------|-------------|
| 데스크톱 Sidebar | Accordion 토글 | 항상 펼침 (모든 2depth 표시) |
| 모바일 레이아웃 | 슬라이드 사이드바 | BottomTab + FAB + SubMenuList |
| 메뉴 구조 | 2depth | 3depth (페이지 내 탭) |
| 메뉴 데이터 | MenuGroup/MenuItem | NavItem 확장 (tabs 추가) |
| 설정 메뉴 | 통합 설정 | 시설/관리자/역할권한 분리 |
| 신규 메뉴 | - | 세션 도메인 추가 |

---

## 2. 컴포넌트 계층 구조

```
packages/ui/src/components/
├── ui/layouts/Admin/              # Pure UI (Widget 수준)
│   ├── AdminLayout.tsx            # 반응형 레이아웃 컨테이너
│   ├── AdminHeader.tsx            # 헤더 (Desktop/Mobile 공용)
│   ├── AdminSidebar.tsx           # 데스크톱 사이드바 (항상 펼침)
│   ├── AdminBottomTab.tsx         # 모바일 하단 탭 (신규)
│   ├── AdminFAB.tsx               # 모바일 FAB (신규)
│   ├── AdminSubMenuList.tsx       # 모바일 서브메뉴 리스트 (신규)
│   ├── types.ts                   # 타입 정의
│   └── index.ts
│
packages/store/src/stores/
├── navigationStore.ts             # NavigationStore (수정)
├── navItem.ts                     # NavItem 클래스 (수정 - tabs 추가)
├── fabStore.ts                    # FAB 상태 관리 (신규)
└── bottomTabStore.ts              # BottomTab 상태 관리 (신규)

apps/admin/src/
├── config/
│   └── admin-menu.ts              # 메뉴 설정 데이터 (수정)
├── stores/
│   └── AppStoreProvider.tsx       # Store 주입 (수정)
└── components/feature/
    ├── AdminLayoutFeature.tsx     # AdminLayout + Store 연결 (신규)
    └── hooks/
        └── useAdminLayout.ts      # 레이아웃 훅 (신규)
```

---

## 3. 데이터 구조

### 3.1 NavItemConfig (확장)

```typescript
// packages/store/src/stores/navItem.ts

export interface TabConfig {
  id: string;
  label: string;
  href: string;
}

export interface NavItemConfig {
  id: string;
  label: string;
  path?: string;
  icon?: string;
  subject: string;
  children?: NavItemConfig[];
  tabs?: TabConfig[];  // v7.0 신규: 3depth 탭 정보
}
```

### 3.2 NavItem 클래스 (확장)

```typescript
// packages/store/src/stores/navItem.ts

export class NavItem {
  readonly id: string;
  readonly label: string;
  readonly path: string | undefined;
  readonly icon: string | undefined;
  readonly subject: string;
  readonly children: NavItem[];
  readonly tabs: TabConfig[];  // v7.0 신규
  private _active: boolean = false;

  // 탭이 있는지 확인
  get hasTabs(): boolean {
    return this.tabs.length > 0;
  }

  // 현재 경로에 해당하는 탭 찾기
  findTabByPath(path: string): TabConfig | undefined {
    return this.tabs.find(tab => tab.href === path);
  }
}
```

### 3.3 NavigationStore (확장)

```typescript
// packages/store/src/stores/navigationStore.ts

export class NavigationStore {
  // 기존 필드
  private readonly _items: NavItem[];
  private _selectedNavItem: NavItem | null = null;
  private _selectedSubNavItem: NavItem | null = null;
  private _currentPath: string = "";

  // v7.0 신규: 모바일 상태
  private _isSubMenuOpen: boolean = false;
  private _activeBottomTabId: string | null = null;

  // v7.0: 항상 펼침 모드 (expandedNavItemIds 제거 또는 무시)

  // 모바일 SubMenu 열기/닫기
  openSubMenu(navItemId: string): void;
  closeSubMenu(): void;

  // BottomTab 관련
  get bottomTabItems(): NavItem[];  // 하단 탭에 표시할 아이템 (5개)
  get moreMenuItems(): NavItem[];   // "더보기"에 표시할 아이템 (나머지)
}
```

### 3.4 FABStore (신규)

```typescript
// packages/store/src/stores/fabStore.ts

export interface FABAction {
  id: string;
  label: string;
  icon: string;
  subject: string;  // 권한 체크용
  href?: string;    // 페이지 이동
  modal?: string;   // 모달 열기
}

export class FABStore {
  private _isOpen: boolean = false;
  private _actions: FABAction[] = [];
  private _abilityChecker: AbilityChecker | null = null;

  get isOpen(): boolean;
  get visibleActions(): FABAction[];  // 권한 필터링된 액션

  toggle(): void;
  open(): void;
  close(): void;

  executeAction(actionId: string): void;
}
```

---

## 4. 컴포넌트 설계

### 4.1 AdminLayout (수정)

```typescript
// packages/ui/src/components/ui/layouts/Admin/AdminLayout.tsx

interface AdminLayoutProps {
  // 메뉴 데이터
  navItems: NavItem[];

  // 현재 상태
  currentPath: string;
  selectedNavItem: NavItem | null;
  selectedSubNavItem: NavItem | null;

  // 모바일 상태
  isSubMenuOpen: boolean;
  activeBottomTabId: string | null;
  isFABOpen: boolean;
  fabActions: FABAction[];

  // 핸들러
  onNavItemClick: (navItemId: string) => void;
  onSubNavItemClick: (subNavItemId: string) => void;
  onBottomTabClick: (tabId: string) => void;
  onSubMenuClose: () => void;
  onFABToggle: () => void;
  onFABActionClick: (actionId: string) => void;

  // 헤더 정보
  userInfo?: AdminUserInfo;
  logo?: ReactNode;
  headerActions?: ReactNode;
  onLogout?: () => void;

  // 메인 콘텐츠
  children: ReactNode;
}
```

### 4.2 AdminSidebar (수정 - 항상 펼침)

```typescript
// packages/ui/src/components/ui/layouts/Admin/AdminSidebar.tsx

interface AdminSidebarProps {
  navItems: NavItem[];
  selectedNavItem: NavItem | null;
  selectedSubNavItem: NavItem | null;
  onNavItemClick: (navItemId: string) => void;
  onSubNavItemClick: (subNavItemId: string) => void;
  logo?: ReactNode;
}

// 변경사항:
// - collapsed 속성 제거 (항상 펼침)
// - Accordion 토글 로직 제거
// - 모든 2depth 메뉴 항상 표시
```

### 4.3 AdminBottomTab (신규)

```typescript
// packages/ui/src/components/ui/layouts/Admin/AdminBottomTab.tsx

interface AdminBottomTabProps {
  items: BottomTabItem[];
  activeTabId: string | null;
  onTabClick: (tabId: string) => void;
}

interface BottomTabItem {
  id: string;
  label: string;
  icon: string;
  hasSubMenu: boolean;  // SubMenuList 표시 여부
}

// 탭 구성 (고정):
// 1. dashboard (대시보드) - 바로 이동
// 2. reservations (예약) - SubMenuList
// 3. users (회원) - SubMenuList
// 4. notifications (알림) - SubMenuList
// 5. more (더보기) - 나머지 1depth 표시
```

### 4.4 AdminFAB (신규)

```typescript
// packages/ui/src/components/ui/layouts/Admin/AdminFAB.tsx

interface AdminFABProps {
  isOpen: boolean;
  actions: FABAction[];
  onToggle: () => void;
  onActionClick: (actionId: string) => void;
}

// FAB 액션 (고정):
// 1. todayReservation (오늘 예약) - 페이지 이동
// 2. quickReservation (빠른 예약) - 모달
// 3. userSearch (회원 검색) - 모달
```

### 4.5 AdminSubMenuList (신규)

```typescript
// packages/ui/src/components/ui/layouts/Admin/AdminSubMenuList.tsx

interface AdminSubMenuListProps {
  title: string;
  items: SubMenuItem[];
  activeItemId: string | null;
  onItemClick: (itemId: string) => void;
  onClose: () => void;
}

interface SubMenuItem {
  id: string;
  label: string;
  path: string;
}

// 전체 화면 모달 형태
// Header 아래 ~ BottomTab 위 영역 사용
```

---

## 5. 메뉴 설정 데이터

### 5.1 admin-menu.ts (수정)

```typescript
// apps/admin/src/config/admin-menu.ts

import { NavItemConfig } from "@cocrepo/store";

export const ADMIN_NAV_CONFIG: NavItemConfig[] = [
  // 1. 대시보드
  {
    id: "dashboard",
    label: "대시보드",
    icon: "LayoutDashboard",
    path: "/dashboard",
    subject: "menu:dashboard",
  },

  // 2. 회원
  {
    id: "users",
    label: "회원",
    icon: "Users",
    subject: "menu:users",
    children: [
      {
        id: "users-list",
        label: "회원 목록",
        path: "/users",
        subject: "menu:users:list",
        tabs: [
          { id: "all", label: "전체", href: "/users" },
          { id: "active", label: "활성", href: "/users/active" },
          { id: "dormant", label: "휴면", href: "/users/dormant" },
          { id: "pending-withdrawal", label: "탈퇴대기", href: "/users/pending-withdrawal" },
        ],
      },
      {
        id: "users-grades",
        label: "등급 관리",
        path: "/users/grades",
        subject: "menu:users:grades",
      },
      {
        id: "users-withdrawn",
        label: "탈퇴 회원",
        path: "/users/withdrawn",
        subject: "menu:users:withdrawn",
      },
    ],
  },

  // 3. 예약
  {
    id: "reservations",
    label: "예약",
    icon: "CalendarCheck",
    subject: "menu:reservations",
    children: [
      {
        id: "reservations-today",
        label: "오늘 예약",
        path: "/reservations/today",
        subject: "menu:reservations:today",
      },
      {
        id: "reservations-list",
        label: "예약 목록",
        path: "/reservations",
        subject: "menu:reservations:list",
        tabs: [
          { id: "all", label: "전체", href: "/reservations" },
          { id: "pending", label: "대기중", href: "/reservations/pending" },
          { id: "confirmed", label: "확정", href: "/reservations/confirmed" },
          { id: "cancelled", label: "취소", href: "/reservations/cancelled" },
        ],
      },
      {
        id: "reservations-calendar",
        label: "캘린더",
        path: "/reservations/calendar",
        subject: "menu:reservations:calendar",
      },
      {
        id: "reservations-stats",
        label: "통계",
        path: "/reservations/stats",
        subject: "menu:reservations:stats",
      },
    ],
  },

  // 4. 알림
  {
    id: "notifications",
    label: "알림",
    icon: "Bell",
    subject: "menu:notifications",
    children: [
      {
        id: "notifications-send",
        label: "알림 발송",
        path: "/notifications/send",
        subject: "menu:notifications:send",
      },
      {
        id: "notifications-history",
        label: "발송 내역",
        path: "/notifications/history",
        subject: "menu:notifications:history",
        tabs: [
          { id: "all", label: "전체", href: "/notifications/history" },
          { id: "sms", label: "SMS", href: "/notifications/history/sms" },
          { id: "email", label: "이메일", href: "/notifications/history/email" },
          { id: "push", label: "푸시", href: "/notifications/history/push" },
        ],
      },
      {
        id: "notifications-templates",
        label: "알림 템플릿",
        path: "/notifications/templates",
        subject: "menu:notifications:templates",
      },
      {
        id: "notifications-settings",
        label: "알림 설정",
        path: "/notifications/settings",
        subject: "menu:notifications:settings",
      },
    ],
  },

  // 5. 문의
  {
    id: "inquiries",
    label: "문의",
    icon: "MessageSquare",
    subject: "menu:inquiries",
    children: [
      {
        id: "inquiries-list",
        label: "문의 목록",
        path: "/inquiries",
        subject: "menu:inquiries:list",
        tabs: [
          { id: "all", label: "전체", href: "/inquiries" },
          { id: "pending", label: "대기중", href: "/inquiries/pending" },
          { id: "completed", label: "답변완료", href: "/inquiries/completed" },
        ],
      },
      {
        id: "inquiries-direct",
        label: "1:1 문의",
        path: "/inquiries/direct",
        subject: "menu:inquiries:direct",
      },
      {
        id: "inquiries-answered",
        label: "답변 완료",
        path: "/inquiries/answered",
        subject: "menu:inquiries:answered",
      },
      {
        id: "inquiries-faq",
        label: "FAQ",
        path: "/inquiries/faq",
        subject: "menu:inquiries:faq",
      },
    ],
  },

  // 6. 콘텐츠
  {
    id: "contents",
    label: "콘텐츠",
    icon: "FileText",
    subject: "menu:contents",
    children: [
      {
        id: "contents-notices",
        label: "공지사항",
        path: "/notices",
        subject: "menu:contents:notices",
      },
      {
        id: "contents-banners",
        label: "배너",
        path: "/banners",
        subject: "menu:contents:banners",
      },
      {
        id: "contents-events",
        label: "이벤트",
        path: "/events",
        subject: "menu:contents:events",
        tabs: [
          { id: "all", label: "전체", href: "/events" },
          { id: "ongoing", label: "진행중", href: "/events/ongoing" },
          { id: "upcoming", label: "예정", href: "/events/upcoming" },
          { id: "ended", label: "종료", href: "/events/ended" },
        ],
      },
      {
        id: "contents-terms",
        label: "이용약관",
        path: "/terms",
        subject: "menu:contents:terms",
      },
    ],
  },

  // 7. 템플릿
  {
    id: "templates",
    label: "템플릿",
    icon: "LayoutTemplate",
    subject: "menu:templates",
    children: [
      {
        id: "templates-sms",
        label: "SMS",
        path: "/templates/sms",
        subject: "menu:templates:sms",
      },
      {
        id: "templates-email",
        label: "이메일",
        path: "/templates/email",
        subject: "menu:templates:email",
      },
      {
        id: "templates-push",
        label: "푸시",
        path: "/templates/push",
        subject: "menu:templates:push",
      },
      {
        id: "templates-html",
        label: "HTML",
        path: "/templates/html",
        subject: "menu:templates:html",
      },
    ],
  },

  // 8. 세션 (v7.0 신규)
  {
    id: "sessions",
    label: "세션",
    icon: "Clock",
    subject: "menu:sessions",
    children: [
      {
        id: "sessions-timelines",
        label: "타임라인",
        path: "/sessions/timelines",
        subject: "menu:sessions:timelines",
        tabs: [
          { id: "all", label: "전체", href: "/sessions/timelines" },
          { id: "active", label: "활성", href: "/sessions/timelines/active" },
          { id: "archived", label: "보관됨", href: "/sessions/timelines/archived" },
        ],
      },
      {
        id: "sessions-list",
        label: "세션 목록",
        path: "/sessions",
        subject: "menu:sessions:list",
        tabs: [
          { id: "all", label: "전체", href: "/sessions" },
          { id: "one-time", label: "일회성", href: "/sessions/one-time" },
          { id: "recurring", label: "반복", href: "/sessions/recurring" },
          { id: "upcoming", label: "예정", href: "/sessions/upcoming" },
          { id: "past", label: "지난", href: "/sessions/past" },
        ],
      },
      {
        id: "sessions-programs",
        label: "프로그램 배정",
        path: "/sessions/programs",
        subject: "menu:sessions:programs",
        tabs: [
          { id: "all", label: "전체", href: "/sessions/programs" },
          { id: "active", label: "진행중", href: "/sessions/programs/active" },
          { id: "full", label: "정원마감", href: "/sessions/programs/full" },
          { id: "available", label: "예약가능", href: "/sessions/programs/available" },
        ],
      },
      {
        id: "sessions-routines",
        label: "루틴",
        path: "/sessions/routines",
        subject: "menu:sessions:routines",
        tabs: [
          { id: "all", label: "전체", href: "/sessions/routines" },
          { id: "exercise", label: "운동", href: "/sessions/routines/exercise" },
        ],
      },
    ],
  },

  // 9. 시설 (v7.0 - 설정에서 분리)
  {
    id: "grounds",
    label: "시설",
    icon: "Building",
    subject: "menu:grounds",
    children: [
      {
        id: "grounds-info",
        label: "시설 정보",
        path: "/grounds",
        subject: "menu:grounds:info",
      },
      {
        id: "grounds-programs",
        label: "프로그램 정의",
        path: "/grounds/programs",
        subject: "menu:grounds:programs",
      },
      {
        id: "grounds-equipment",
        label: "장비/시설물",
        path: "/grounds/equipment",
        subject: "menu:grounds:equipment",
      },
    ],
  },

  // 10. 관리자 (v7.0 - 설정에서 분리)
  {
    id: "admins",
    label: "관리자",
    icon: "UserCog",
    subject: "menu:admins",
    children: [
      {
        id: "admins-list",
        label: "관리자 목록",
        path: "/admins",
        subject: "menu:admins:list",
        tabs: [
          { id: "all", label: "전체", href: "/admins" },
          { id: "active", label: "활성", href: "/admins/active" },
          { id: "inactive", label: "비활성", href: "/admins/inactive" },
        ],
      },
      {
        id: "admins-invitations",
        label: "초대 관리",
        path: "/admins/invitations",
        subject: "menu:admins:invitations",
        tabs: [
          { id: "all", label: "전체", href: "/admins/invitations" },
          { id: "pending", label: "대기중", href: "/admins/invitations/pending" },
          { id: "expired", label: "만료됨", href: "/admins/invitations/expired" },
        ],
      },
    ],
  },

  // 11. 역할/권한 (v7.0 - 설정에서 분리)
  {
    id: "roles",
    label: "역할/권한",
    icon: "Shield",
    subject: "menu:roles",
    children: [
      {
        id: "roles-list",
        label: "역할 목록",
        path: "/roles",
        subject: "menu:roles:list",
      },
      {
        id: "roles-abilities",
        label: "권한 설정",
        path: "/roles/abilities",
        subject: "menu:roles:abilities",
      },
    ],
  },
];
```

### 5.2 FAB 설정

```typescript
// apps/admin/src/config/admin-fab.ts

import { FABAction } from "@cocrepo/store";

export const ADMIN_FAB_ACTIONS: FABAction[] = [
  {
    id: "todayReservation",
    label: "오늘 예약",
    icon: "CalendarCheck",
    subject: "quickAction:todayReservation",
    href: "/reservations/today",
  },
  {
    id: "quickReservation",
    label: "빠른 예약",
    icon: "CalendarPlus",
    subject: "quickAction:quickReservation",
    modal: "quickReservation",
  },
  {
    id: "userSearch",
    label: "회원 검색",
    icon: "Search",
    subject: "quickAction:userSearch",
    modal: "userSearch",
  },
];
```

### 5.3 BottomTab 설정

```typescript
// apps/admin/src/config/admin-bottom-tab.ts

export const BOTTOM_TAB_IDS = [
  "dashboard",
  "reservations",
  "users",
  "notifications",
  "more",
] as const;

export type BottomTabId = typeof BOTTOM_TAB_IDS[number];

// "more"는 특수 처리 (나머지 1depth 메뉴 표시)
```

---

## 6. 반응형 브레이크포인트

| 브레이크포인트 | 범위 | 레이아웃 |
|---------------|------|----------|
| 데스크톱 | >= 768px (md) | Header + Sidebar + Main |
| 모바일 | < 768px | Header + Main + BottomTab + FAB |

```typescript
// Tailwind CSS 클래스 사용
// 데스크톱: md:block, md:hidden
// 모바일: block md:hidden, hidden md:block
```

---

## 7. 구현 순서 (Stage 4)

### Phase 1: Store 확장
1. `navItem.ts` 수정 (tabs 추가)
2. `navigationStore.ts` 수정 (모바일 상태, 항상 펼침)
3. `fabStore.ts` 생성

### Phase 2: Pure UI 컴포넌트
1. `AdminBottomTab.tsx` 생성
2. `AdminFAB.tsx` 생성
3. `AdminSubMenuList.tsx` 생성
4. `AdminSidebar.tsx` 수정 (항상 펼침)
5. `AdminLayout.tsx` 수정 (반응형 통합)

### Phase 3: 메뉴 설정
1. `admin-menu.ts` 수정 (v7.0 구조)
2. `admin-fab.ts` 생성
3. `admin-bottom-tab.ts` 생성

### Phase 4: Feature 컴포넌트
1. `AdminLayoutFeature.tsx` 생성 (Store 연결)
2. `useAdminLayout.ts` 생성 (통합 훅)

---

## 8. 테스트 체크리스트

### 데스크톱
- [ ] 모든 2depth 메뉴 항상 표시
- [ ] 1depth 클릭 시 첫 번째 2depth로 이동
- [ ] 2depth 클릭 시 페이지 이동
- [ ] 3depth 탭 표시 및 전환

### 모바일
- [ ] BottomTab 5개 탭 표시
- [ ] FAB 클릭 시 3개 액션 표시
- [ ] SubMenuList 전체 화면 표시
- [ ] 권한 기반 메뉴/FAB 필터링

### 반응형
- [ ] 768px 이상에서 데스크톱 레이아웃
- [ ] 768px 미만에서 모바일 레이아웃
- [ ] 전환 시 상태 유지

---

## 9. 관련 문서

- 기획서: `.claude/plans/2025-12-30-AdminLayoutAndMenuSystem/`
- 권한 체계: `04-permissions.md`
- 메뉴 트리: `03-menu-tree.md`
