# 메뉴 시스템 역기획서

> 📅 생성일: 2026-01-31
> 📦 대상 앱: admin-web
> 🔄 유형: 역기획 (기존 코드 분석)

---

## L0: 시스템 컨텍스트

### 시스템 개요

관리자 웹 애플리케이션의 **계층화된 메뉴 시스템**으로, 다음 핵심 기능을 제공합니다:

- **반응형 네비게이션**: 데스크톱(사이드바) / 모바일(하단탭 + FAB)
- **권한 기반 메뉴 필터링**: CASL 통합으로 역할별 메뉴 노출 제어
- **URL-메뉴 상태 동기화**: 경로 변경 시 메뉴 활성화 자동 반영
- **3-depth 메뉴 구조**: 1depth(대분류) → 2depth(소분류) → 3depth(탭)

### 시스템 경계

```
┌─────────────────────────────────────────────────────────────┐
│                     Admin Web Application                    │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                    메뉴 시스템                          │  │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌──────────┐  │  │
│  │  │ 상수/설정 │→│  Store  │→│   UI    │→│  Layout  │  │  │
│  │  └─────────┘  └─────────┘  └─────────┘  └──────────┘  │  │
│  │       ↑             ↑            ↑                     │  │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐                │  │
│  │  │  Type   │  │  CASL   │  │  Next   │                │  │
│  │  └─────────┘  └─────────┘  └─────────┘                │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 기술 스택

| 영역 | 기술 |
|------|------|
| 상태관리 | MobX (mobx-react-lite) |
| 권한관리 | CASL (@casl/ability) |
| 라우팅 | Next.js App Router |
| UI | HeroUI + Tailwind CSS |
| 패키지 구조 | Turborepo 모노레포 |

---

## L1: 사용자 (Actor)

### 주요 사용자 유형

| Actor ID | 이름 | 설명 | 권한 수준 |
|----------|------|------|----------|
| `super-admin` | 슈퍼 관리자 | 전체 시스템 관리 | 모든 메뉴 접근 |
| `space-admin` | 스페이스 관리자 | 특정 스페이스 관리 | 할당된 스페이스 메뉴만 |
| `operator` | 운영자 | 일상 운영 업무 | 운영 관련 메뉴만 |
| `viewer` | 조회자 | 데이터 조회 전용 | 읽기 전용 메뉴 |

### 디바이스별 사용 패턴

| 디바이스 | UI 패턴 | 주요 사용 시나리오 |
|----------|---------|-------------------|
| 데스크톱 (md↑) | 사이드바 + 헤더 | 장시간 관리 작업 |
| 모바일 (md↓) | 하단탭 + FAB + 서브메뉴 | 빠른 확인/승인 작업 |

---

## L2: 사용자 목표 (Goal)

### 핵심 목표

| Goal ID | 목표 | Actor | 우선순위 |
|---------|------|-------|----------|
| `G-NAV-01` | 원하는 메뉴로 빠르게 이동 | 모든 사용자 | Critical |
| `G-NAV-02` | 현재 위치 파악 | 모든 사용자 | High |
| `G-NAV-03` | 권한 범위 내 메뉴만 표시 | 모든 사용자 | Critical |
| `G-NAV-04` | 디바이스에 최적화된 UI 사용 | 모든 사용자 | High |
| `G-NAV-05` | 새로고침 후에도 상태 유지 | 모든 사용자 | Medium |

### 상세 시나리오

#### G-NAV-01: 원하는 메뉴로 빠르게 이동

```
사전조건: 로그인 완료, 권한 로드됨
시나리오:
  1. 사용자가 1depth 메뉴 클릭
  2. 2depth 서브메뉴 펼쳐짐
  3. 2depth 아이템 클릭
  4. 해당 페이지로 이동
  5. 메뉴 활성화 상태 반영
성공조건: 3클릭 이내 목적지 도달
```

#### G-NAV-03: 권한 기반 필터링

```
사전조건: 로그인 완료
시나리오:
  1. CASL 권한 규칙 로드
  2. NavigationStore에 abilityChecker 설정
  3. 메뉴 렌더링 시 권한 필터링
  4. 권한 없는 메뉴 비노출
성공조건: 접근 불가 메뉴는 표시되지 않음
```

---

## L3: 기능 (Feature)

### 기능 목록

| Feature ID | 기능명 | 설명 | 우선순위 |
|------------|--------|------|----------|
| `F-SIDE` | 사이드바 네비게이션 | 데스크톱용 좌측 사이드바 | Critical |
| `F-BOTTOM` | 하단 탭 네비게이션 | 모바일용 하단 탭바 | High |
| `F-FAB` | 플로팅 액션 버튼 | 모바일용 빠른 액션 | Medium |
| `F-SUBMENU` | 서브메뉴 오버레이 | 모바일 서브메뉴 표시 | High |
| `F-PERM` | 권한 필터링 | CASL 기반 메뉴 필터링 | Critical |
| `F-SYNC` | 경로 동기화 | URL ↔ 메뉴 상태 동기화 | Critical |

### 기능 의존성

```
F-PERM ─────┬─────────────────────────┐
            ↓                         ↓
F-SIDE ←── F-SYNC ──→ F-BOTTOM ──→ F-SUBMENU
                                      ↑
                                   F-FAB
```

---

## L4: 화면 (Screen)

### 화면 목록

| Screen ID | 화면명 | 경로 패턴 | 레이아웃 |
|-----------|--------|----------|----------|
| `S-DASH` | 대시보드 | `/dashboard` | AdminLayout |
| `S-USER-LIST` | 회원 목록 | `/users` | AdminLayout |
| `S-USER-ACTIVE` | 활성 회원 | `/users/active` | AdminLayout (탭) |
| `S-USER-DORMANT` | 휴면 회원 | `/users/dormant` | AdminLayout (탭) |
| `S-RES-LIST` | 예약 목록 | `/reservations` | AdminLayout |
| `S-ADMIN-LIST` | 관리자 목록 | `/admins` | AdminLayout |
| `S-ROLE-LIST` | 역할/권한 | `/roles` | AdminLayout |

### 메뉴 구조 (3-depth)

```
📁 대시보드 (dashboard)
   └── 대시보드 (/dashboard)

📁 회원 (users)
   ├── 회원 목록 (/users)
   │   ├── [탭] 전체 (/users)
   │   ├── [탭] 활성 (/users/active)
   │   ├── [탭] 휴면 (/users/dormant)
   │   └── [탭] 탈퇴대기 (/users/pending-withdrawal)
   └── 회원 등급 (/users/grades)

📁 예약 (reservations)
   ├── 예약 목록 (/reservations)
   │   ├── [탭] 전체 (/reservations)
   │   ├── [탭] 대기 (/reservations/pending)
   │   ├── [탭] 확정 (/reservations/confirmed)
   │   └── [탭] 취소 (/reservations/cancelled)
   └── 예약 설정 (/reservations/settings)

📁 알림 (notifications)
   └── 알림 목록 (/notifications)

📁 문의 (inquiries)
   └── 문의 목록 (/inquiries)

📁 콘텐츠 (contents)
   ├── 공지사항 (/contents/notices)
   ├── FAQ (/contents/faqs)
   └── 약관 (/contents/terms)

📁 템플릿 (templates)
   ├── 알림 템플릿 (/templates/notifications)
   └── 메시지 템플릿 (/templates/messages)

📁 세션 (sessions)
   ├── 타임라인 (/sessions/timelines)
   └── 세션 관리 (/sessions/manage)

📁 시설 (spaces)
   └── 시설 목록 (/spaces)

📁 관리자 (admins)
   └── 관리자 목록 (/admins)

📁 역할/권한 (roles)
   └── 역할 목록 (/roles)
```

---

## L5: 인터랙션 (Action)

### 사이드바 인터랙션

| Action ID | 액션명 | 트리거 | 결과 |
|-----------|--------|--------|------|
| `A-SIDE-EXPAND` | 1depth 펼침 | 1depth 클릭 | 2depth 표시 + 첫 페이지 이동 |
| `A-SIDE-COLLAPSE` | 1depth 접힘 | 펼쳐진 1depth 클릭 | 2depth 숨김 |
| `A-SIDE-SELECT` | 2depth 선택 | 2depth 클릭 | 페이지 이동 + 활성화 |

### 하단 탭 인터랙션

| Action ID | 액션명 | 트리거 | 결과 |
|-----------|--------|--------|------|
| `A-TAB-SELECT` | 탭 선택 | 탭 아이콘 터치 | 해당 섹션 이동 |
| `A-TAB-MORE` | 더보기 열기 | "더보기" 탭 터치 | 서브메뉴 오버레이 |
| `A-SUBMENU-SELECT` | 서브메뉴 선택 | 서브메뉴 아이템 터치 | 페이지 이동 |
| `A-SUBMENU-CLOSE` | 서브메뉴 닫기 | 바깥 영역 터치 | 오버레이 닫힘 |

### FAB 인터랙션

| Action ID | 액션명 | 트리거 | 결과 |
|-----------|--------|--------|------|
| `A-FAB-TOGGLE` | FAB 열기/닫기 | FAB 버튼 터치 | 액션 목록 표시/숨김 |
| `A-FAB-ACTION` | FAB 액션 실행 | 액션 아이템 터치 | 페이지 이동 또는 모달 |

### 상태 동기화

| Action ID | 액션명 | 트리거 | 결과 |
|-----------|--------|--------|------|
| `A-SYNC-PATH` | 경로 동기화 | URL 변경 | 메뉴 활성화 업데이트 |
| `A-SYNC-TAB` | 탭 동기화 | URL 변경 | 하단탭 활성화 업데이트 |

---

## L6: API

### 내부 API (Store 메서드)

메뉴 시스템은 외부 REST API를 직접 호출하지 않고, Store 메서드를 통해 상태를 관리합니다.

#### NavigationStore API

| 메서드 | 파라미터 | 반환 | 설명 |
|--------|----------|------|------|
| `setCurrentPath` | `path: string` | `void` | 현재 경로 설정 (활성화) |
| `selectNavItem` | `navItemId: string` | `void` | 1depth 선택 + 이동 |
| `selectSubNavItem` | `subNavItemId: string` | `void` | 2depth 선택 + 이동 |
| `toggleNavItem` | `navItemId: string` | `void` | 펼침/접힘 토글 |
| `setAbilityChecker` | `checker: Function` | `void` | 권한 체크 함수 설정 |
| `setNavigator` | `navigator: Navigator` | `void` | 라우터 주입 |

#### BottomTabStore API

| 메서드 | 파라미터 | 반환 | 설명 |
|--------|----------|------|------|
| `selectTab` | `tabId: string` | `void` | 탭 선택 |
| `openSubMenu` | `tabId: string` | `void` | 서브메뉴 열기 |
| `closeSubMenu` | - | `void` | 서브메뉴 닫기 |
| `selectSubMenuItem` | `subNavItemId: string` | `void` | 서브메뉴 아이템 선택 |
| `updateActiveTabFromPath` | `path: string` | `void` | 경로 기반 탭 동기화 |

#### FABStore API

| 메서드 | 파라미터 | 반환 | 설명 |
|--------|----------|------|------|
| `toggle` | - | `void` | 열기/닫기 토글 |
| `open` | - | `void` | 열기 |
| `close` | - | `void` | 닫기 |
| `executeAction` | `actionId: string` | `void` | 액션 실행 |

### 권한 API (CASL)

| 메서드 | 파라미터 | 반환 | 설명 |
|--------|----------|------|------|
| `ability.can` | `action, subject` | `boolean` | 권한 체크 |

권한 Subject 패턴: `menu:{entity}:{sub}`
- 예: `menu:users:list`, `menu:dashboard`

---

## L7: 데이터 모델 (Entity)

### NavItem (메뉴 아이템)

```typescript
class NavItem {
  // 불변 속성
  readonly id: string;           // 고유 식별자
  readonly label: string;        // 표시 라벨
  readonly path?: string;        // 라우팅 경로
  readonly icon?: string;        // 아이콘 이름
  readonly subject: string;      // 권한 subject
  readonly children: NavItem[];  // 하위 메뉴 (재귀)
  readonly tabs: TabConfig[];    // 3depth 탭

  // 반응형 속성 (MobX observable)
  private _active: boolean;      // 활성화 여부

  // 계산 속성
  get active(): boolean;
  get hasChildren(): boolean;
  get hasTabs(): boolean;

  // 메서드
  setActive(value: boolean): void;
  findChildByPath(path: string): NavItem | undefined;
}
```

### TabConfig (탭 설정)

```typescript
interface TabConfig {
  id: string;      // 탭 ID
  label: string;   // 표시 라벨
  href: string;    // 탭 링크
}
```

### NavItemConfig (설정 입력)

```typescript
interface NavItemConfig {
  id: string;
  label: string;
  path?: string;
  icon?: string;
  subject: string;
  children?: NavItemConfig[];
  tabs?: TabConfig[];
}
```

### FABAction (부동 액션)

```typescript
interface FABAction {
  id: string;
  label: string;
  icon: string;
  subject: string;   // 권한 subject
  href?: string;     // 페이지 이동
  modal?: string;    // 모달 ID
}
```

### 데이터 흐름

```
NavItemConfig[] (상수)
       ↓
NavItem[] (Store 인스턴스)
       ↓
UI Props (렌더링)
```

---

## L8: UI 컴포넌트

### 컴포넌트 계층

```
Layout
├── AdminLayout
│   ├── AdminSidebar (데스크톱)
│   │   └── NavTreePanel (Widget)
│   ├── AdminHeader
│   │   └── SubNav (Feature)
│   ├── AdminBottomTab (모바일)
│   ├── AdminFAB (모바일)
│   └── AdminSubMenuList (모바일)
│
Feature
├── SideNav (NavigationStore 연결)
├── SubNav (상위 네비게이션)
├── BottomTab (BottomTabStore 연결)
└── FAB (FABStore 연결)
│
Widget
├── NavTreePanel (순수 트리 UI)
├── TabBar (순수 탭바 UI)
└── MenuList (순수 메뉴 리스트)
```

### 컴포넌트 상세

#### AdminLayout

| 속성 | 타입 | 설명 |
|------|------|------|
| `navItems` | `NavItem[]` | 메뉴 아이템 목록 |
| `selectedNavItem` | `NavItem \| null` | 선택된 1depth |
| `selectedSubNavItem` | `NavItem \| null` | 선택된 2depth |
| `expandedNavItemIds` | `Set<string>` | 펼쳐진 아이템 |
| `bottomTabItems` | `TabItem[]` | 하단 탭 아이템 |
| `activeBottomTabId` | `string` | 활성 탭 ID |
| `isFABOpen` | `boolean` | FAB 열림 상태 |
| `fabActions` | `FABAction[]` | FAB 액션 목록 |
| `onNavItemClick` | `(id) => void` | 1depth 클릭 핸들러 |
| `onSubNavItemClick` | `(id) => void` | 2depth 클릭 핸들러 |
| `onNavItemToggle` | `(id) => void` | 펼침/접힘 핸들러 |
| `onBottomTabClick` | `(id) => void` | 탭 클릭 핸들러 |
| `onFABToggle` | `() => void` | FAB 토글 핸들러 |
| `onFABAction` | `(id) => void` | FAB 액션 핸들러 |

#### NavTreePanel (Widget)

| 속성 | 타입 | 설명 |
|------|------|------|
| `items` | `NavItem[]` | 메뉴 아이템 |
| `expandedKeys` | `Set<string>` | 펼쳐진 키 |
| `onToggle` | `(id) => void` | 토글 핸들러 |
| `onSelectItem` | `(id) => void` | 1depth 선택 |
| `onSelectSubItem` | `(id) => void` | 2depth 선택 |
| `width` | `number` | 너비 |

#### SideNav (Feature)

| 속성 | 타입 | 설명 |
|------|------|------|
| `width` | `number` | 사이드바 너비 (기본 240) |

*내부적으로 `useNavigationStore()` 사용*

### 위치 규칙

| 유형 | 위치 |
|------|------|
| Layout | `packages/fe-ui/src/primitive/layout/Admin/` |
| Feature | `packages/fe-ui/src/feature/` |
| Widget | `packages/fe-ui/src/widget/` |

---

## L9: 비즈니스 로직

### 핵심 로직

#### 1. 권한 필터링 로직

```typescript
// NavigationStore.items getter
get items(): NavItem[] {
  if (!this.abilityChecker) return this._items;

  return this._items
    .filter(item => this.abilityChecker("ACCESS", item.subject))
    .map(item => ({
      ...item,
      children: item.children.filter(
        child => this.abilityChecker("ACCESS", child.subject)
      )
    }))
    .filter(item => item.children.length > 0 || !item.hasChildren);
}
```

#### 2. 경로 매칭 로직

```typescript
// NavItem.findChildByPath
findChildByPath(path: string): NavItem | undefined {
  return this.children.find(
    child => child.path && path.startsWith(child.path)
  );
}

// NavigationStore.setCurrentPath
setCurrentPath(path: string): void {
  this.currentPath = path;

  for (const item of this._items) {
    const child = item.findChildByPath(path);
    if (child) {
      item.setActive(true);
      child.setActive(true);
      this._selectedNavItem = item;
      this._selectedSubNavItem = child;
      return;
    }
  }
}
```

#### 3. 탭 동기화 로직

```typescript
// BottomTabStore.updateActiveTabFromPath
updateActiveTabFromPath(path: string): void {
  const selectedNav = this.navigationStore.selectedNavItem;
  if (!selectedNav) return;

  if (this.tabIds.includes(selectedNav.id)) {
    this._activeTabId = selectedNav.id;
  } else {
    this._activeTabId = this.moreTabId;
  }
}
```

#### 4. 메뉴 선택 로직

```typescript
// NavigationStore.selectNavItem
selectNavItem(navItemId: string): void {
  const item = this._items.find(i => i.id === navItemId);
  if (!item) return;

  item.setActive(true);
  this._expandedNavItemIds.add(navItemId);

  if (item.hasChildren) {
    const firstChild = item.children[0];
    firstChild.setActive(true);
    this._selectedNavItem = item;
    this._selectedSubNavItem = firstChild;
    this.navigator?.push(firstChild.path!);
  } else {
    this._selectedNavItem = item;
    this.navigator?.push(item.path!);
  }
}
```

### 상태 전이 다이어그램

```
[초기 상태]
    │
    ▼ (로그인 + 권한 로드)
[권한 설정됨]
    │
    ▼ (setCurrentPath)
[메뉴 활성화됨]
    │
    ├──▶ (사용자 클릭) ──▶ [메뉴 변경] ──▶ (navigate)
    │                          │
    │                          ▼
    │                    [URL 변경]
    │                          │
    └──────────────────────────┘
              (경로 동기화)
```

---

## L10: 테스트

### 단위 테스트

#### NavItem 테스트

```typescript
describe('NavItem', () => {
  it('활성화 상태를 토글할 수 있다', () => {
    const item = new NavItem(config);
    expect(item.active).toBe(false);
    item.setActive(true);
    expect(item.active).toBe(true);
  });

  it('경로로 자식을 찾을 수 있다', () => {
    const item = new NavItem(configWithChildren);
    const child = item.findChildByPath('/users/active');
    expect(child?.id).toBe('users-list');
  });
});
```

#### NavigationStore 테스트

```typescript
describe('NavigationStore', () => {
  it('경로 설정 시 해당 메뉴가 활성화된다', () => {
    store.setCurrentPath('/users');
    expect(store.selectedNavItem?.id).toBe('users');
    expect(store.selectedSubNavItem?.id).toBe('users-list');
  });

  it('권한 없는 메뉴는 필터링된다', () => {
    store.setAbilityChecker((action, subject) =>
      subject !== 'menu:admins'
    );
    const adminMenu = store.items.find(i => i.id === 'admins');
    expect(adminMenu).toBeUndefined();
  });
});
```

#### BottomTabStore 테스트

```typescript
describe('BottomTabStore', () => {
  it('탭 선택 시 NavigationStore와 동기화된다', () => {
    bottomTabStore.selectTab('users');
    expect(navigationStore.selectedNavItem?.id).toBe('users');
  });

  it('더보기 탭 선택 시 서브메뉴가 열린다', () => {
    bottomTabStore.selectTab('more');
    expect(bottomTabStore.isSubMenuOpen).toBe(true);
  });
});
```

### 통합 테스트

```typescript
describe('메뉴 시스템 통합', () => {
  it('URL 변경 시 전체 상태가 동기화된다', async () => {
    // Given: 초기 상태
    renderWithProvider(<AdminLayout />);

    // When: URL 변경
    await router.push('/reservations');

    // Then: 모든 상태 동기화
    expect(navigationStore.selectedNavItem?.id).toBe('reservations');
    expect(bottomTabStore.activeTabId).toBe('reservations');
    expect(screen.getByTestId('nav-reservations')).toHaveClass('active');
  });
});
```

### 테스트 커버리지 목표

| 영역 | 목표 | 현재 |
|------|------|------|
| NavItem | 90% | 95% |
| NavigationStore | 85% | 90% |
| BottomTabStore | 80% | 85% |
| FABStore | 80% | - |
| UI 컴포넌트 | 70% | - |

---

## 부록: 파일 위치 매핑

### 상수/설정

| 파일 | 역할 |
|------|------|
| `packages/common-constant/src/routing/admin-menu.ts` | ADMIN_PATHS, ADMIN_SUBJECTS, ADMIN_NAV_ITEMS |
| `packages/common-type/src/navigation.ts` | NavItemConfig, TabConfig, FABAction |

### Store

| 파일 | 역할 |
|------|------|
| `packages/fe-store/src/stores/navItem.ts` | NavItem 클래스 |
| `packages/fe-store/src/stores/navigationStore.ts` | NavigationStore |
| `packages/fe-store/src/stores/bottomTabStore.ts` | BottomTabStore |
| `packages/fe-store/src/stores/fabStore.ts` | FABStore |
| `packages/fe-store/src/stores/rootStore.ts` | RootStore |
| `packages/fe-store/src/providers/createAppStoreProvider.tsx` | Provider 팩토리 |

### UI 컴포넌트

| 파일 | 역할 |
|------|------|
| `packages/fe-ui/src/primitive/layout/Admin/AdminLayout.tsx` | 통합 레이아웃 |
| `packages/fe-ui/src/primitive/layout/Admin/AdminSidebar.tsx` | 사이드바 |
| `packages/fe-ui/src/primitive/layout/Admin/AdminBottomTab.tsx` | 하단 탭 |
| `packages/fe-ui/src/primitive/layout/Admin/AdminFAB.tsx` | FAB |
| `packages/fe-ui/src/widget/NavTreePanel/NavTreePanel.tsx` | 트리 패널 |
| `packages/fe-ui/src/feature/SideNav/SideNav.tsx` | 사이드바 Feature |

### 앱

| 파일 | 역할 |
|------|------|
| `apps/admin/src/stores/AppStoreProvider.tsx` | Store Provider 설정 |
| `apps/admin/src/app/(admin)/layout.tsx` | 레이아웃 래퍼 |
| `apps/admin/src/hooks/useAdminLayout.ts` | 레이아웃 훅 |

---

## 변경 이력

| 버전 | 날짜 | 변경 내용 |
|------|------|----------|
| v7.0 | 2026-01-31 | 3depth 탭, BottomTab, FAB 추가 |
| v6.0 | - | 초기 사이드바 메뉴 시스템 |
