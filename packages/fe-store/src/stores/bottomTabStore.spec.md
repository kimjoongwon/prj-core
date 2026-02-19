# BottomTabStore 기획서

> 생성일: 2026-02-18
> 수정일: 2026-02-18
> 타입: store
> 위치: packages/fe-store/src/stores/bottomTabStore.ts

## 역할

모바일 하단 탭(BottomTab) 상태를 관리하는 MobX Store. 탭 활성 상태, 서브메뉴 열림/닫힘, NavigationStore와의 연동을 담당합니다. "더보기(more)" 탭을 지원하여 탭에 표시되지 않는 나머지 메뉴를 관리합니다.

## 타입 정의

| 타입명 | 종류 | 설명 |
|--------|------|------|
| `BottomTabItem` | interface | `id`, `label`, `icon`, `hasSubMenu` 속성을 가진 탭 아이템 |
| `BottomTabConfig` | interface | `tabIds: string[]` (표시할 메뉴 ID 목록), `moreTabId?: string` ("더보기" 탭 ID) |

## 상태 (Observable)

| 속성 | 타입 | 초기값 | 설명 |
|------|------|--------|------|
| _tabIds | `string[]` (readonly) | config.tabIds | BottomTab에 표시할 1depth 메뉴 ID 목록 |
| _moreTabId | `string` (readonly) | config.moreTabId ?? `"more"` | "더보기" 탭 ID |
| _activeTabId | `string \| null` | `null` | 현재 활성 탭 ID |
| _isSubMenuOpen | `boolean` | `false` | SubMenuList 열림 상태 |
| _navigationStore | `NavigationStore \| null` | options?.navigationStore ?? `null` | NavigationStore 참조 |

## 계산된 값 (Computed)

| 속성 | 타입 | 계산 로직 |
|------|------|----------|
| activeTabId | `string \| null` | `_activeTabId` 반환 |
| isSubMenuOpen | `boolean` | `_isSubMenuOpen` 반환 |
| tabItems | `BottomTabItem[]` | NavigationStore의 items에서 `_tabIds` 순서대로 추출하여 BottomTabItem으로 변환. "더보기" 탭은 특수 처리 |
| moreMenuItems | `NavItem[]` | NavigationStore items 중 `_tabIds`에 포함되지 않은 나머지 1depth 메뉴들 |
| activeSubMenu | `NavItem \| null` | 현재 열린 서브메뉴의 NavItem 반환 ("더보기" 탭이면 null) |
| subMenuItems | `NavItem[]` | 현재 열린 서브메뉴의 아이템 목록 ("더보기" 탭이면 moreMenuItems 반환) |
| subMenuTitle | `string` | 현재 열린 서브메뉴의 제목 ("더보기" 탭이면 "더보기") |

## 액션 (Action)

| 메서드 | 파라미터 | 동작 |
|--------|----------|------|
| `setNavigationStore` | `store: NavigationStore` | NavigationStore 참조 설정 |
| `selectTab` | `tabId: string` | 탭 선택. hasSubMenu가 있으면 서브메뉴 열기, 없으면 NavigationStore로 직접 이동 |
| `openSubMenu` | `tabId: string` | 특정 탭의 SubMenuList 열기 |
| `closeSubMenu` | 없음 | SubMenuList 닫기 |
| `selectSubMenuItem` | `subNavItemId: string` | 서브메뉴 아이템 선택 후 SubMenuList 닫기. NavigationStore의 selectSubNavItem 호출 |
| `updateActiveTabFromPath` | `_path: string` | 현재 경로 기반으로 활성 탭 업데이트. tabIds에 없으면 "더보기" 탭 활성화 |

## 비동기 액션 (Flow)

없음

## 의존 Store

| Store | 사용 방식 |
|-------|----------|
| NavigationStore | items, selectedNavItem 접근 및 selectNavItem/selectSubNavItem 호출 |

## RootStore 연결

| 속성명 | 타입 |
|--------|------|
| bottomTabStore | BottomTabStore |

## 사용 예시

```typescript
const bottomTabStore = new BottomTabStore(
  { tabIds: ['dashboard', 'reservations', 'users', 'notifications', 'more'], moreTabId: 'more' },
  { navigationStore }
);

bottomTabStore.selectTab('reservations'); // 탭 선택
bottomTabStore.closeSubMenu();            // SubMenuList 닫기
```

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
