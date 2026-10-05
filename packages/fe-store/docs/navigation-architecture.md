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

### 3. NavigationStore (네비게이션 상태 owner)

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
RootStore
└── app: AppStore
    └── navigation: NavigationStore
        ├── owns NavItem[]
        └── uses Navigator
                 └── wraps runtime router
```

`RootStore`가 `NavigationStore`를 생성하고 런타임 router로 만든 `Navigator`를
연결합니다. `NavItem`은 `NavigationStore`만 소유하므로 모두 `stores/navigation/`
아래에 함께 둡니다.

---

## 사용 예시

### 앱 초기화

```typescript
import { browserPersistStorageAdapter, RootStore } from '@cocrepo/store';
import { useRouter } from 'next/navigation';
import { ADMIN_NAV_CONFIG } from '@cocrepo/constant';

const root = new RootStore({
  appName: 'ADMIN',
  navItems: ADMIN_NAV_CONFIG,
  persistStorageKey: 'admin-persist',
  storageAdapter: browserPersistStorageAdapter,
});
root.initialize({
  sessionScopeBinders: [],
  languageBinders: [],
});

export function NavigationInitializer() {
  const router = useRouter();

  useEffect(() => {
    root.start();
    root.setRouter(router);
  }, [router]);

  return null;
}
```

### 아이템 선택

```typescript
// 사용자가 네비게이션 아이템 클릭
navigation.selectNavItem('members');
// → NavigationStore가 활성 상태 업데이트
// → Navigator.push('/members/list') 호출
// → 실제 페이지 이동
```

### 경로 변경 감지

```typescript
// 라우터 변경 시 (useEffect)
useEffect(() => {
  root.setCurrentPath(pathname);
}, [pathname]);
```

---

## 공개 API

NavigationStore는 `app.navigation` namespace를 총괄하는 상태 객체입니다:

```typescript
import { NavigationStore } from '@cocrepo/store';

navigation.selectNavItem('members');
navigation.selectedNavItem;
```
