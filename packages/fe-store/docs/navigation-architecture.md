# 네비게이션 아키텍처 설계

## 클래스 역할 정의

### 1. Navigator (이동 주체)

**역할**: Next.js router를 받아서 **실제 페이지 이동**만 수행

```typescript
interface NavigatorOptions {
  router: {
    push: (path: string) => void;
    replace: (path: string) => void;
    back: () => void;
  };
  basePath?: string;
}

class Navigator {
  push(path: string): void    // 페이지 이동
  replace(path: string): void // 히스토리 교체
  back(): void                // 뒤로 가기
  forward(): void             // 앞으로 가기
  refresh(): void             // 새로고침
}
```

**특징**:
- 프레임워크(Next.js) 의존성을 캡슐화
- 이동 외의 로직 없음
- 테스트 시 mock router 주입 용이

---

### 2. NavItem (네비게이션 아이템)

**역할**: 네비게이션 항목의 **데이터와 UI 상태** 관리

```typescript
interface NavItemConfig {
  id: string;
  label: string;        // UI 표시용
  path?: string;        // 이동 경로
  icon?: string;        // 아이콘
  subject: string;      // 권한 체크용
  children?: NavItemConfig[];
}

class NavItem {
  // 불변 데이터
  readonly id: string;
  readonly label: string;
  readonly path?: string;
  readonly icon?: string;
  readonly subject: string;
  readonly children: NavItem[];

  // UI 상태 (observable)
  active: boolean;

  // 메서드
  setActive(value: boolean): void;
  findChildById(id: string): NavItem | undefined;
  findChildByPath(path: string): NavItem | undefined;
}
```

---

### 3. NavigationStore (네비게이션 관리자)

**역할**: 네비게이션 아이템 컬렉션의 **상태 관리 및 네비게이션 로직**

```typescript
class NavigationStore {
  // 의존성
  private navigator: Navigator;

  // 상태
  private items: NavItem[];
  private selectedNavItem: NavItem | null;
  private selectedSubNavItem: NavItem | null;
  private expandedNavItemIds: Set<string>;
  private currentPath: string;

  // 권한
  private abilityChecker: AbilityChecker | null;

  // 주요 기능
  setCurrentPath(path: string): void;         // 경로 기반 활성화
  selectNavItem(navItemId: string): void;     // 아이템 선택 + 이동
  selectSubNavItem(subNavItemId: string): void; // 하위 아이템 선택 + 이동
  navigateTo(path: string): void;             // 직접 이동

  // 권한 필터링
  get items(): NavItem[];  // 필터링된 아이템 반환
}
```

---

## 클래스 다이어그램

```
┌─────────────────────────────────────────────────────────────────┐
│                         RootStore                                │
│  ┌─────────────┐  ┌──────────────────┐  ┌───────────────────┐   │
│  │  Navigator  │  │  NavigationStore │  │  기타 Store...     │   │
│  │             │  │                  │  │                    │   │
│  │ - router    │◄─│ - navigator      │  │                    │   │
│  │             │  │ - items[]        │  │                    │   │
│  │ push()      │  │ - selectedNavItem│  │                    │   │
│  │ replace()   │  │                  │  │                    │   │
│  │ back()      │  │ selectNavItem()  │  │                    │   │
│  └─────────────┘  └────────┬─────────┘  └───────────────────┘   │
│                            │                                     │
│                            ▼                                     │
│                      ┌──────────┐                                │
│                      │ NavItem[]│                                │
│                      │          │                                │
│                      │ - id     │                                │
│                      │ - label  │                                │
│                      │ - path   │                                │
│                      │ - active │                                │
│                      │ - children[]                              │
│                      └──────────┘                                │
└─────────────────────────────────────────────────────────────────┘
```

---

## 사용 예시

### 앱 초기화

```typescript
// stores/index.ts
import { Navigator, NavigationStore } from '@cocrepo/store';
import { useRouter } from 'next/navigation';
import { ADMIN_NAV_CONFIG } from '@cocrepo/constant';

export function initializeStores() {
  const router = useRouter();

  // Navigator 생성 - router 주입
  const navigator = new Navigator({ router });

  // NavigationStore 생성 - Navigator 주입
  const navigationStore = new NavigationStore(ADMIN_NAV_CONFIG, {
    navigator,
    abilityChecker: (action, subject) => ability.can(action, subject),
  });

  return { navigator, navigationStore };
}
```

### 아이템 선택

```typescript
// 사용자가 네비게이션 아이템 클릭
navigationStore.selectNavItem('members');
// → NavigationStore가 활성 상태 업데이트
// → Navigator.push('/members/list') 호출
// → 실제 페이지 이동
```

### 경로 변경 감지

```typescript
// 라우터 변경 시 (useEffect)
useEffect(() => {
  navigationStore.setCurrentPath(pathname);
}, [pathname]);
```

---

## 하위 호환성

기존 `MenuStore`를 사용하는 코드는 계속 동작합니다:

```typescript
// 기존 코드 (deprecated)
import { MenuStore } from '@cocrepo/store';

// 새 코드 (권장)
import { NavigationStore } from '@cocrepo/store';
```

기존 메서드명도 호환됩니다:

```typescript
// 기존 (deprecated)
navigationStore.selectMenu('members');
navigationStore.selectedMenu;

// 새 API (권장)
navigationStore.selectNavItem('members');
navigationStore.selectedNavItem;
```
