# NavigationStore 기획서

> 생성일: 2026-02-18
> 수정일: 2026-02-18
> 타입: store
> 위치: packages/fe-store/src/stores/navigationStore.ts

## 역할

네비게이션 시스템을 관리하는 MobX Store. NavItem 트리 구조 관리, 권한 기반 아이템 필터링, 현재 경로 기반 활성 아이템 추적, 아이템 펼침/접힘 상태 관리, Navigator를 통한 페이지 이동을 담당합니다.

## 타입 정의

| 타입명 | 종류 | 설명 |
|--------|------|------|
| `AbilityChecker` | function type | `@cocrepo/type`의 공용 권한 체크 함수 계약 |
| `NavigationStoreOptions` | interface | `@cocrepo/type`의 NavigationStore 생성 옵션 계약 |

## 상태 (Observable)

| 속성 | 타입 | 초기값 | 설명 |
|------|------|--------|------|
| _items | `NavItem[]` (readonly) | navItems를 NavItem으로 변환 | 전체 네비게이션 아이템 목록 |
| _selectedNavItem | `NavItem \| null` | `null` | 현재 선택된 주요 아이템 (1depth) |
| _selectedSubNavItem | `NavItem \| null` | `null` | 현재 선택된 하위 아이템 (2depth) |
| _abilityChecker | `AbilityChecker \| null` | options?.abilityChecker ?? `null` | 권한 체크 함수 |
| _navigator | `Navigator \| null` | options?.navigator ?? `null` | 페이지 이동 담당 |
| _onNavigate | `((path: string) => void) \| null` | options?.onNavigate ?? `null` | (deprecated) 이동 콜백 |
| _expandedNavItemIds | `Set<string>` | `new Set()` | 펼쳐진 아이템 ID 집합 |
| _currentPath | `string` | `""` | 현재 경로 |

## 계산된 값 (Computed)

| 속성 | 타입 | 계산 로직 |
|------|------|----------|
| allItems | `NavItem[]` | `_items` 전체 반환 (필터링 없음) |
| items | `NavItem[]` | `_abilityChecker`가 있으면 `"view"` 액션으로 1depth/2depth 모두 필터링, 없으면 전체 반환 |
| selectedNavItem | `NavItem \| null` | `_selectedNavItem` 반환 |
| selectedSubNavItem | `NavItem \| null` | `_selectedSubNavItem` 반환 |
| subNavItems | `NavItem[]` | 선택된 주요 아이템의 children (권한 필터링 적용) |
| expandedNavItemIds | `Set<string>` | `_expandedNavItemIds` 반환 |
| currentPath | `string` | `_currentPath` 반환 |

## 액션 (Action)

| 메서드 | 파라미터 | 동작 |
|--------|----------|------|
| `setNavigator` | `navigator: Navigator` | Navigator 설정 |
| `setAbilityChecker` | `checker: AbilityChecker` | 권한 체크 함수 설정 |
| `setNavigateHandler` | `handler: (path: string) => void` | (deprecated) 이동 핸들러 설정 |
| `toggleNavItem` | `navItemId: string` | 아이템 펼침/접힘 토글 |
| `isNavItemExpanded` | `navItemId: string` | 아이템 펼침 상태 확인 |
| `expandNavItem` | `navItemId: string` | 특정 아이템 펼치기 |
| `collapseNavItem` | `navItemId: string` | 특정 아이템 접기 |
| `setCurrentPath` | `path: string` | 경로 기반 활성 아이템 설정 (동일 경로면 스킵) |
| `selectNavItem` | `navItemId: string` | 주요 아이템 선택 + 첫 번째 child로 이동 + 펼치기 |
| `selectSubNavItem` | `subNavItemId: string` | 하위 아이템 선택 + 부모 활성화 + 페이지 이동 |
| `navigateTo` | `path: string` | 경로로 직접 이동 (Navigator 사용) |
| `findNavItemById` | `navItemId: string` | ID로 1depth 아이템 찾기 |
| `findSubNavItemById` | `subNavItemId: string` | ID로 2depth 아이템 찾기 (전체 탐색) |
| `findNavItemByPath` | `path: string` | 경로로 아이템 찾기 (1depth + 2depth 탐색) |

## 비동기 액션 (Flow)

없음

## 의존 Store

| Store | 사용 방식 |
|-------|----------|
| Navigator | `push` 메서드로 페이지 이동 수행 |
| NavItem | 내부 아이템으로 관리 |

## RootStore 연결

| 속성명 | 타입 |
|--------|------|
| navigationStore | NavigationStore |

## 외부 의존성

| 패키지 | 사용 |
|--------|------|
| `@cocrepo/type` | `NavItemConfig`, `AbilityChecker`, `NavigationStoreOptions`, `NavigatorLike` 타입 |

## 주요 동작 흐름

### 경로 기반 활성화 (setCurrentPath)
1. 동일 경로면 조기 반환
2. 모든 아이템 활성 상태 초기화 (`resetAllActive`)
3. 각 1depth 아이템에서 `findChildByPath`로 2depth 매칭 시도
4. 매칭되면 1depth/2depth 모두 활성화하고 selected 설정
5. 2depth 매칭 실패 시 1depth 직접 경로 매칭 시도 (경로 경계 체크)
6. 매칭 없으면 selected를 null로 설정

### 아이템 선택 (selectNavItem)
1. ID로 아이템 찾기
2. 모든 아이템 초기화
3. 해당 아이템 활성화 + expanded 추가
4. 첫 번째 child path로 이동

### 하위 아이템 선택 (selectSubNavItem)
1. 전체 아이템에서 subNavItemId 탐색
2. 부모/자식 모두 활성화
3. 부모 expanded 추가
4. 자식 path로 이동

### 내부 이동 (navigate)
- Navigator가 있으면 `navigator.push(path)` 사용
- 없으면 `_onNavigate` 콜백 사용 (deprecated)

## 사용 예시

```typescript
const navigator = new Navigator({ router });
const navigationStore = new NavigationStore(ADMIN_NAV_CONFIG, {
  navigator,
  abilityChecker: (action, subject) => ability.can(action, subject),
});

navigationStore.setCurrentPath('/members/list');
navigationStore.selectNavItem('members');
```

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-06 | AbilityChecker/NavigationStoreOptions를 로컬 선언에서 @cocrepo/type 공용 계약 import로 전환 | codex |
| 2026-03-06 | AbilityChecker를 AppAction/AppSubject 기반으로 타입 강화하고 메뉴 필터 액션을 view(소문자)로 통일 | codex |
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
