# 03. 인터랙션 (역기획)

> 이 문서는 기존 코드를 분석하여 자동 생성되었습니다.

## 인터랙션 (L5 Action)

### 네비게이션 상태 관리

| ID | 액션명 | 설명 | 트리거 | Store 메서드 |
|----|--------|------|--------|--------------|
| L5-ACT-001 | 현재 경로 설정 | URL 경로 기반으로 활성 메뉴 설정 | URL 변경 | `setCurrentPath(path)` |
| L5-ACT-002 | 주요 아이템 선택 | 1depth 메뉴 선택 및 첫 번째 자식으로 이동 | 메뉴 클릭 | `selectNavItem(id)` |
| L5-ACT-003 | 하위 아이템 선택 | 2depth 메뉴 선택 및 페이지 이동 | 서브메뉴 클릭 | `selectSubNavItem(id)` |
| L5-ACT-004 | 아이템 펼침/접힘 | 메뉴 Accordion 토글 | 아이콘 클릭 | `toggleNavItem(id)` |
| L5-ACT-005 | 아이템 펼치기 | 특정 메뉴 펼치기 | 프로그래밍 | `expandNavItem(id)` |
| L5-ACT-006 | 아이템 접기 | 특정 메뉴 접기 | 프로그래밍 | `collapseNavItem(id)` |
| L5-ACT-007 | 직접 이동 | 경로로 직접 페이지 이동 | 프로그래밍 | `navigateTo(path)` |

### 모바일 하단 탭 (BottomTabStore)

| ID | 액션명 | 설명 | 트리거 | Store 메서드 |
|----|--------|------|--------|--------------|
| L5-ACT-008 | 탭 선택 | 하단 탭 선택 | 탭 터치 | `selectTab(tabId)` |
| L5-ACT-009 | 서브메뉴 열기 | 서브메뉴 리스트 열기 | children 있는 탭 선택 | `openSubMenu(tabId)` |
| L5-ACT-010 | 서브메뉴 닫기 | 서브메뉴 리스트 닫기 | 닫기 버튼/배경 터치 | `closeSubMenu()` |
| L5-ACT-011 | 서브메뉴 아이템 선택 | 서브메뉴 내 아이템 선택 | 아이템 터치 | `selectSubMenuItem(id)` |
| L5-ACT-012 | 경로 기반 탭 업데이트 | 현재 경로로 활성 탭 업데이트 | URL 변경 | `updateActiveTabFromPath(path)` |

### FAB (FABStore)

| ID | 액션명 | 설명 | 트리거 | Store 메서드 |
|----|--------|------|--------|--------------|
| L5-ACT-013 | FAB 토글 | FAB 열기/닫기 | FAB 버튼 터치 | `toggle()` |
| L5-ACT-014 | FAB 열기 | FAB 펼치기 | 프로그래밍 | `open()` |
| L5-ACT-015 | FAB 닫기 | FAB 접기 | 배경 터치/액션 실행 | `close()` |
| L5-ACT-016 | FAB 액션 실행 | 빠른 액션 실행 (이동/모달) | 액션 버튼 터치 | `executeAction(actionId)` |

---

## 액션 흐름 다이어그램

### 데스크톱 메뉴 선택 흐름

```
[User] 
   │
   ├──▶ 1depth 메뉴 클릭
   │         │
   │         ▼
   │    SideNav.handleSelectItem(id)
   │         │
   │         ▼
   │    NavigationStore.selectNavItem(id)
   │         │
   │         ├──▶ resetAllActive()
   │         ├──▶ navItem.setActive(true)
   │         ├──▶ expandedNavItemIds.add(id)
   │         └──▶ navigate(firstChildPath)
   │                    │
   │                    ▼
   │              Navigator.push(path)
   │                    │
   │                    ▼
   │              Next.js Router
   │
   └──▶ 2depth 메뉴 클릭
             │
             ▼
        SideNav.handleSelectSubItem(id)
             │
             ▼
        NavigationStore.selectSubNavItem(id)
             │
             ├──▶ find parentNavItem
             ├──▶ resetAllActive()
             ├──▶ parent.setActive(true)
             ├──▶ subItem.setActive(true)
             └──▶ navigate(subItem.path)
```

### 모바일 하단 탭 흐름

```
[User]
   │
   ├──▶ BottomTab 터치 (children 없음)
   │         │
   │         ▼
   │    BottomTabStore.selectTab(id)
   │         │
   │         ├──▶ _activeTabId = id
   │         ├──▶ _isSubMenuOpen = false
   │         └──▶ NavigationStore.selectNavItem(id)
   │                    │
   │                    ▼
   │              페이지 이동
   │
   └──▶ BottomTab 터치 (children 있음)
             │
             ▼
        BottomTabStore.selectTab(id)
             │
             ├──▶ _activeTabId = id
             └──▶ _isSubMenuOpen = true
                       │
                       ▼
                  SubMenuList 표시
                       │
                       ▼
                  [User] 아이템 터치
                       │
                       ▼
              selectSubMenuItem(subId)
                       │
                       ├──▶ NavigationStore.selectSubNavItem(subId)
                       └──▶ closeSubMenu()
```

### FAB 액션 흐름

```
[User]
   │
   └──▶ FAB 버튼 터치
             │
             ▼
        FABStore.toggle()
             │
             ▼
        _isOpen = !_isOpen
             │
             ▼
        FAB Actions 표시
             │
             ├──▶ [href 있는 액션]
             │         │
             │         ▼
             │    executeAction(id)
             │         │
             │         ├──▶ abilityChecker("ACCESS", subject)
             │         ├──▶ Navigator.push(href)
             │         └──▶ close()
             │
             └──▶ [modal 있는 액션]
                       │
                       ▼
                  executeAction(id)
                       │
                       ├──▶ abilityChecker("ACCESS", subject)
                       ├──▶ onModalOpen(modalId)
                       └──▶ close()
```

---

## API 레이어 (L6)

> 네비게이션 시스템은 백엔드 API를 직접 호출하지 않습니다.
> 메뉴 설정은 프론트엔드 상수로 관리됩니다.

### 권한 관련 (간접 의존)

| 항목 | 설명 |
|------|------|
| 권한 소스 | AbilityStore에서 CASL ability 제공 |
| 권한 체크 | `ability.can("ACCESS", "menu:users")` |
| API 연동 | 로그인 시 백엔드에서 abilities 목록 수신 |

### 관련 Store 의존성

```typescript
// RootStore에서 Store 주입
rootStore.navigationStore = new NavigationStore(ADMIN_NAV_ITEMS, {
  navigator: rootStore.navigator,
  abilityChecker: (action, subject) => 
    rootStore.abilityStore?.ability.can(action, subject) ?? false,
});

rootStore.bottomTabStore = new BottomTabStore(
  { tabIds: BOTTOM_TAB_IDS, moreTabId: "more" },
  { navigationStore: rootStore.navigationStore }
);

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

## 이벤트 핸들러 매핑

### SideNav (Feature)

| 이벤트 | 핸들러 | 호출 Store 메서드 |
|--------|--------|------------------|
| 아이템 토글 | `handleToggle(id)` | `navigationStore.toggleNavItem(id)` |
| 단독 아이템 선택 | `handleSelectItem(id)` | `navigationStore.selectNavItem(id)` |
| 하위 아이템 선택 | `handleSelectSubItem(id)` | `navigationStore.selectSubNavItem(id)` |

### Nav (Feature)

| 이벤트 | 핸들러 | 호출 Store 메서드 |
|--------|--------|------------------|
| 메뉴 클릭 | `handleClickNavItem(id)` | `navigationStore.selectNavItem(id)` |

### SubNav (Feature)

| 이벤트 | 핸들러 | 호출 Store 메서드 |
|--------|--------|------------------|
| 서브메뉴 클릭 | `handleClickSubNavItem(id)` | `navigationStore.selectSubNavItem(id)` |

### BottomTab (Feature)

| 이벤트 | 핸들러 | 호출 Store 메서드 |
|--------|--------|------------------|
| 탭 선택 변경 | `handleSelectionChange(key)` | `navigationStore.selectNavItem(id)` |

### SubMenuList (Feature)

| 이벤트 | 핸들러 | 호출 Store 메서드 |
|--------|--------|------------------|
| 아이템 클릭 | `handleClickSubNavItem(id)` | `navigationStore.selectSubNavItem(id)` |
