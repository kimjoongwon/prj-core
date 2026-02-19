# 05. 기술 설계 (역기획)

> 이 문서는 기존 코드를 분석하여 자동 생성되었습니다.

## 비즈니스 로직 (L9 Logic)

### NavigationStore 로직

| ID | 로직명 | 설명 | 메서드 |
|----|--------|------|--------|
| L9-LOG-001 | 권한 기반 필터링 | AbilityChecker로 메뉴 접근 권한 체크 | `get items()` |
| L9-LOG-002 | 경로 매칭 | URL 경로로 활성 메뉴 자동 설정 | `setCurrentPath()` |
| L9-LOG-003 | 중첩 경로 매칭 | 하위 경로도 상위 메뉴 활성화 | `findChildByPath()` |
| L9-LOG-004 | 첫 번째 자식 이동 | 1depth 선택 시 첫 번째 2depth로 이동 | `selectNavItem()` |
| L9-LOG-005 | 부모 자동 활성화 | 2depth 선택 시 부모도 활성화 | `selectSubNavItem()` |

### 권한 필터링 상세

```typescript
// NavigationStore.items getter
get items(): NavItem[] {
  if (!this._abilityChecker) {
    return this._items;  // 권한 체커 없으면 전체 반환
  }

  return this._items
    // 1. 1depth 권한 체크
    .filter((navItem) => this._abilityChecker!("ACCESS", navItem.subject))
    // 2. 2depth 권한 체크
    .map((navItem) => {
      const filteredChildren = navItem.children.filter((child) =>
        this._abilityChecker!("ACCESS", child.subject),
      );
      return { ...navItem, children: filteredChildren, hasChildren: filteredChildren.length > 0 };
    })
    // 3. children 없는데 hasChildren인 경우 제거
    .filter((navItem) => !navItem.hasChildren || navItem.children.length > 0);
}
```

### 경로 매칭 상세

```typescript
// NavigationStore.setCurrentPath()
setCurrentPath(path: string): void {
  if (this._currentPath === path) return;  // 동일 경로 무시
  
  this._currentPath = path;
  this.resetAllActive();  // 모든 활성 상태 초기화

  for (const navItem of this._items) {
    // 1. 하위 아이템에서 경로 매칭 시도
    const matchedChild = navItem.findChildByPath(path);
    if (matchedChild) {
      navItem.setActive(true);
      matchedChild.setActive(true);
      this._selectedNavItem = navItem;
      this._selectedSubNavItem = matchedChild;
      return;
    }

    // 2. 직접 경로 매칭 (children 없는 경우)
    if (navItem.path && path.startsWith(navItem.path)) {
      navItem.setActive(true);
      this._selectedNavItem = navItem;
      this._selectedSubNavItem = null;
      return;
    }
  }

  // 3. 매칭 실패
  this._selectedNavItem = null;
  this._selectedSubNavItem = null;
}
```

### BottomTabStore 로직

| ID | 로직명 | 설명 | 메서드 |
|----|--------|------|--------|
| L9-LOG-006 | 더보기 메뉴 분리 | tabIds에 없는 메뉴를 더보기로 | `get moreMenuItems()` |
| L9-LOG-007 | 탭 선택 분기 | hasSubMenu 여부로 동작 분기 | `selectTab()` |
| L9-LOG-008 | 경로 기반 탭 활성화 | 현재 경로로 활성 탭 결정 | `updateActiveTabFromPath()` |

### FABStore 로직

| ID | 로직명 | 설명 | 메서드 |
|----|--------|------|--------|
| L9-LOG-009 | 권한 기반 액션 필터링 | AbilityChecker로 액션 필터 | `get visibleActions()` |
| L9-LOG-010 | 액션 타입 분기 | href/modal 여부로 동작 분기 | `executeAction()` |

### Navigator 로직

| ID | 로직명 | 설명 | 메서드 |
|----|--------|------|--------|
| L9-LOG-011 | basePath 적용 | 기본 경로 자동 추가 | `resolvePath()` |

```typescript
private resolvePath(path: string): string {
  if (!this.basePath) return path;
  if (path.startsWith(this.basePath)) return path;  // 이미 포함된 경우
  return `${this.basePath}${path}`;
}
```

---

## 테스트 케이스 (L10 Test)

### 기존 테스트 파일

- `packages/fe-store/src/stores/__tests__/navigationStore.test.ts`
- `packages/fe-store/src/stores/__tests__/navigator.test.ts`

### NavItem 테스트

| ID | 테스트명 | 분류 |
|----|----------|------|
| L10-TST-001 | 아이템을 올바르게 생성해야 한다 | Happy |
| L10-TST-002 | 하위 아이템을 재귀적으로 생성해야 한다 | Happy |
| L10-TST-003 | 초기 active 상태는 false여야 한다 | Happy |
| L10-TST-004 | setActive로 상태를 변경할 수 있어야 한다 | Happy |
| L10-TST-005 | 자식이 있으면 hasChildren이 true | Happy |
| L10-TST-006 | 자식이 없으면 hasChildren이 false | Happy |
| L10-TST-007 | 자식이 있으면 첫 번째 자식 path 반환 | Happy |
| L10-TST-008 | 자식이 없으면 자신의 path 반환 | Happy |
| L10-TST-009 | ID로 자식 아이템 찾기 | Happy |
| L10-TST-010 | 없는 ID면 undefined 반환 | Error |
| L10-TST-011 | 경로로 자식 아이템 찾기 | Happy |
| L10-TST-012 | 모든 자식 active 상태 초기화 | Happy |

### NavigationStore 테스트

| ID | 테스트명 | 분류 |
|----|----------|------|
| L10-TST-013 | 아이템을 올바르게 초기화해야 한다 | Happy |
| L10-TST-014 | abilityChecker가 없으면 모든 아이템 반환 | Happy |
| L10-TST-015 | abilityChecker로 아이템 필터링 | Happy |
| L10-TST-016 | 경로 기반으로 활성 아이템 설정 | Happy |
| L10-TST-017 | 중첩 경로도 매칭 | Happy |
| L10-TST-018 | children 없는 아이템도 매칭 | Happy |
| L10-TST-019 | 동일 경로로 재호출하면 무시 | Happy |
| L10-TST-020 | 아이템 선택하고 첫 번째 자식으로 이동 | Happy |
| L10-TST-021 | 하위 아이템 선택하고 이동 | Happy |
| L10-TST-022 | 부모 아이템도 자동으로 선택 | Happy |
| L10-TST-023 | 아이템 펼침/접힘 토글 | Happy |
| L10-TST-024 | 아이템 펼치기 | Happy |
| L10-TST-025 | ID로 아이템 찾기 | Happy |
| L10-TST-026 | ID로 하위 아이템 찾기 | Happy |
| L10-TST-027 | 선택된 아이템의 하위 아이템 반환 | Happy |
| L10-TST-028 | 선택 없으면 빈 배열 반환 | Happy |
| L10-TST-029 | 직접 경로로 이동 | Happy |

### 추가 필요 테스트 (제안)

| ID | 테스트명 | 대상 Store |
|----|----------|-----------|
| L10-TST-030 | 탭 선택 시 SubMenu 열림 | BottomTabStore |
| L10-TST-031 | 탭 선택 시 바로 이동 (children 없음) | BottomTabStore |
| L10-TST-032 | 더보기 메뉴 아이템 필터링 | BottomTabStore |
| L10-TST-033 | 서브메뉴 닫기 | BottomTabStore |
| L10-TST-034 | FAB 토글 | FABStore |
| L10-TST-035 | FAB 액션 권한 필터링 | FABStore |
| L10-TST-036 | FAB href 액션 실행 | FABStore |
| L10-TST-037 | FAB modal 액션 실행 | FABStore |
| L10-TST-038 | basePath 적용 | Navigator |

---

## 의존성 그래프

```
@cocrepo/type
    └─▶ NavItemConfig, TabConfig, FABAction (인터페이스)
          │
          ▼
@cocrepo/constant
    └─▶ ADMIN_NAV_ITEMS, ADMIN_FAB_ACTIONS, BOTTOM_TAB_IDS (상수)
          │
          ▼
@cocrepo/store
    ├─▶ NavItem (클래스)
    ├─▶ Navigator (클래스)
    ├─▶ NavigationStore (MobX Store)
    ├─▶ BottomTabStore (MobX Store)
    ├─▶ FABStore (MobX Store)
    └─▶ RootStore (Store 컨테이너)
          │
          ▼
@cocrepo/ui
    ├─▶ NavTreePanel (Widget)
    ├─▶ SideNav, Nav, SubNav (Feature)
    ├─▶ BottomTab, SubMenuList (Feature)
    └─▶ AdminLayout (Layout)
```

---

## 메뉴 설정 데이터 위치

### 상수 파일

```
packages/common-constant/src/routing/admin-menu.ts
├── ADMIN_PATHS          // 경로 상수
├── ADMIN_SUBJECTS       // Subject 상수
├── ADMIN_NAV_ITEMS      // 메뉴 설정 (NavItemConfig[])
├── ADMIN_FAB_ACTIONS    // FAB 액션 설정
└── BOTTOM_TAB_IDS       // 하단 탭 표시 ID
```

### 메뉴 추가 방법

1. `ADMIN_PATHS`에 경로 상수 추가
2. `ADMIN_SUBJECTS`에 Subject 상수 추가
3. `ADMIN_NAV_ITEMS`에 메뉴 아이템 추가
4. 권한 설정 (CASL Ability)에 Subject 추가

---

## Store 초기화 패턴

```typescript
// 앱에서 Store 생성 및 주입 예시
// apps/admin/src/providers/StoreProvider.tsx

const rootStore = new RootStore();

// Navigator 설정
rootStore.navigator = new Navigator({ router });

// NavigationStore 설정
rootStore.navigationStore = new NavigationStore(ADMIN_NAV_ITEMS, {
  navigator: rootStore.navigator,
  abilityChecker: (action, subject) =>
    rootStore.abilityStore?.ability.can(action, subject) ?? false,
});

// BottomTabStore 설정 (v7.0)
rootStore.bottomTabStore = new BottomTabStore(
  { tabIds: BOTTOM_TAB_IDS, moreTabId: "more" },
  { navigationStore: rootStore.navigationStore }
);

// FABStore 설정 (v7.0)
rootStore.fabStore = new FABStore(
  { actions: ADMIN_FAB_ACTIONS },
  {
    navigator: rootStore.navigator,
    abilityChecker: (action, subject) =>
      rootStore.abilityStore?.ability.can(action, subject) ?? false,
  }
);
```

---

## 기술 스택 요약

| 영역 | 기술 |
|------|------|
| 상태 관리 | MobX (makeAutoObservable) |
| 반응형 바인딩 | mobx-react-lite (observer) |
| UI 프레임워크 | HeroUI (Accordion, Tabs) |
| 아이콘 | Lucide React |
| 라우팅 | Next.js App Router |
| 스타일링 | Tailwind CSS |
| 권한 관리 | CASL (AbilityChecker 패턴) |
