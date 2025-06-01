# Navigation Services Migration Guide

## 개요

기존에 분리되어 있던 `NavigationService`와 `RouteNavigator`를 `UnifiedNavigationService`로 통합했습니다. 새로운 서비스는 두 서비스의 모든 기능을 포함하며, 추가적인 유용한 기능들을 제공합니다.

## 주요 개선사항

### 1. 통합된 API
- 라우트 관리, 네비게이션, 활성 상태 추적을 하나의 서비스에서 처리
- 일관된 메서드명과 구조

### 2. 강화된 기능
- **이름 기반 네비게이션**: 라우트 이름으로 직접 네비게이션 가능
- **조건부 네비게이션**: 조건에 따른 라우팅 로직 지원
- **브레드크럼 생성**: 현재 경로의 브레드크럼 자동 생성
- **활성 라우트 추적**: 현재 활성화된 모든 라우트 추적
- **디버깅 지원**: 플랫 라우트 맵 디버깅 기능

### 3. 타입 안전성
- 완전한 TypeScript 지원
- 명확한 인터페이스와 타입 정의

## 마이그레이션 가이드

### 기존 NavigationService 사용자

```typescript
// 기존 코드
import { NavigationService } from '@shared/frontend';

const navigationService = new NavigationService(routeBuilders);
navigationService.setNavigateFunction(navigate);
navigationService.push('/path', params, searchParams);

// 새로운 코드
import { UnifiedNavigationService } from '@shared/frontend';

const navigationService = new UnifiedNavigationService(routeBuilders);
navigationService.setNavigateFunction(navigate);
navigationService.push('/path', params, searchParams);
```

### 기존 RouteNavigator 사용자

```typescript
// 기존 코드
import { routeNavigator } from '@shared/frontend';

routeNavigator.setRoutes(routeBuilders);
const path = routeNavigator.getPathByName('routeName');

// 새로운 코드
import { unifiedNavigationService } from '@shared/frontend';

unifiedNavigationService.setRoutes(routeBuilders);
const path = unifiedNavigationService.getPathByName('routeName');
```

## 새로운 기능 사용법

### 1. 이름 기반 네비게이션

```typescript
// 라우트 이름으로 직접 네비게이션
navigationService.pushByName('GROUND_DETAIL', { id: '123' });

// 조건부 네비게이션 실행
navigationService.pushConditional(
  user.isAdmin,
  'ADMIN_DASHBOARD',
  'USER_DASHBOARD',
  { userId: user.id }
);
```

### 2. 브레드크럼 생성

```typescript
// 현재 경로의 브레드크럼 가져오기
const breadcrumbs = navigationService.getBreadcrumbPath('/admin/spaces/123/dashboard');
console.log(breadcrumbs); // [{ name: '관리자', pathname: '/admin' }, ...]
```

### 3. 활성 라우트 추적

```typescript
// 현재 활성화된 모든 라우트 가져오기
const activeRoutes = navigationService.getActiveRoutes();

// 활성화된 서비스 라우트 가져오기
const activeService = navigationService.activeServiceRoute;
```

### 4. 디버깅

```typescript
// 플랫 라우트 맵 확인 (개발 환경에서 유용)
console.log(navigationService.debugFlatRoutes());
```

## React 컴포넌트 사용법

### 1. Hook 사용 예제

```typescript
import { useUnifiedNavigation, useGlobalNavigation } from '@shared/frontend';

// 로컬 인스턴스 사용 (라우트 빌더 제공)
function MyComponent() {
  const { navigateByName, breadcrumbs } = useUnifiedNavigation(routeBuilders);
  
  return (
    <div>
      <Breadcrumb items={breadcrumbs} />
      <button onClick={() => navigateByName('GROUND_DETAIL', { id: '123' })}>
        그라운드 상세
      </button>
    </div>
  );
}

// 글로벌 인스턴스 사용 (더 간단함)
function AnotherComponent() {
  const { navigateByName, activeRoutes } = useGlobalNavigation();
  
  return (
    <div>
      <p>활성 라우트: {activeRoutes.length}개</p>
      <button onClick={() => navigateByName('LOGIN')}>
        로그인
      </button>
    </div>
  );
}
```

### 2. 네비게이션 컴포넌트 사용

```typescript
import {
  NavigationRouteButton,
  NavigationConditionalButton,
  RouteNavigationLink,
  Breadcrumb,
  RouteDebugger
} from '@shared/frontend';

function Navigation() {
  return (
    <div>
      {/* 라우트 이름으로 네비게이션하는 버튼 */}
      <NavigationRouteButton
        routeName="GROUND_LIST"
        className="btn btn-primary"
      >
        그라운드 목록
      </NavigationRouteButton>

      {/* 조건부 네비게이션 버튼 */}
      <NavigationConditionalButton
        condition={user.isAdmin}
        routeNameIfTrue="ADMIN_DASHBOARD"
        routeNameIfFalse="LOGIN"
        className="btn btn-secondary"
      >
        {user.isAdmin ? '관리자 대시보드' : '로그인'}
      </NavigationConditionalButton>

      {/* 네비게이션 링크 */}
      <RouteNavigationLink
        routeName="HOME"
        className="nav-link"
        activeClassName="active"
      >
        홈
      </RouteNavigationLink>

      {/* 자동 브레드크럼 */}
      <Breadcrumb showHomeIcon={true} />

      {/* 개발 환경에서만 표시되는 라우트 디버거 */}
      <RouteDebugger />
    </div>
  );
}
```

## 새로운 기능 상세 가이드

### 1. 이름 기반 네비게이션

라우트 경로 대신 이름을 사용하여 네비게이션할 수 있습니다:

```typescript
// 기존 방식 (경로 기반)
navigationService.push('/admin/spaces/123/dashboard');

// 새로운 방식 (이름 기반)
navigationService.pushByName('DASHBOARD', { spaceId: '123' });
```

### 2. 조건부 라우팅

조건에 따라 다른 라우트로 이동할 수 있습니다:

```typescript
// 사용자 권한에 따른 라우팅
navigationService.pushConditional(
  user.hasAdminAccess,
  'ADMIN_PANEL',
  'ACCESS_DENIED'
);

// 인증 상태에 따른 라우팅
const targetPath = navigationService.getConditionalPath(
  user.isAuthenticated,
  'DASHBOARD',
  'LOGIN'
);
```

### 3. 자동 브레드크럼 생성

현재 경로를 기반으로 브레드크럼을 자동 생성합니다:

```typescript
// 현재 경로: /admin/spaces/123/grounds/456
const breadcrumbs = navigationService.getBreadcrumbPath('/admin/spaces/123/grounds/456');
// 결과: [
//   { name: '관리자', pathname: '/admin' },
//   { name: '공간', pathname: '/admin/spaces' },
//   { name: '서비스', pathname: '/admin/spaces/123' },
//   { name: '그라운드', pathname: '/admin/spaces/123/grounds' },
//   { name: '그라운드 상세', pathname: '/admin/spaces/123/grounds/456' }
// ]
```

### 4. 활성 라우트 추적

현재 활성화된 모든 라우트를 추적합니다:

```typescript
// 경로 변경 시 자동으로 호출
navigationService.activateRoute('/admin/spaces/123/grounds');

// 활성화된 라우트들 가져오기
const activeRoutes = navigationService.getActiveRoutes();
console.log(activeRoutes); // [관리자, 공간, 서비스, 그라운드] 라우트들
```

### 5. 개발자 디버깅 도구

개발 환경에서 라우트 정보를 시각화하고 디버깅할 수 있습니다:

```typescript
// 플랫 라우트 맵 확인
const flatRoutes = navigationService.debugFlatRoutes();
console.log(flatRoutes); // Map { "GROUND_DETAIL" => { name: "...", pathname: "..." } }

// React 컴포넌트로 디버거 표시
<RouteDebugger position="bottom-right" />
```

## 하위 호환성

기존 코드의 호환성을 위해 `NavigationService`와 `RouteNavigator`는 여전히 사용할 수 있지만, 콘솔에 deprecation 경고가 표시됩니다.

```typescript
// 여전히 작동하지만 deprecated 경고 표시
import { NavigationService, routeNavigator } from '@shared/frontend';
```

## 권장 사항

1. **새로운 코드**: `UnifiedNavigationService` 사용
2. **기존 코드**: 점진적으로 `UnifiedNavigationService`로 마이그레이션
3. **싱글톤 사용**: `unifiedNavigationService` 인스턴스 활용

## 예제 코드

### 완전한 설정 예제

```typescript
import { UnifiedNavigationService } from '@shared/frontend';
import { rawRoutes } from '@shared/specs';
import { useNavigate } from 'react-router-dom';

// 컴포넌트에서 사용
function App() {
  const navigate = useNavigate();
  const [navigationService] = useState(() => new UnifiedNavigationService(rawRoutes));

  useEffect(() => {
    navigationService.setNavigateFunction(navigate);
  }, [navigate]);

  const handleRouteChange = (pathname: string) => {
    navigationService.activateRoute(pathname);
  };

  const navigateToGround = (groundId: string) => {
    navigationService.pushByName('GROUND_DETAIL', { id: groundId });
  };

  return (
    <div>
      {/* 브레드크럼 예제 */}
      <Breadcrumb items={navigationService.getBreadcrumbPath(location.pathname)} />
      
      {/* 네비게이션 예제 */}
      <button onClick={() => navigateToGround('123')}>
        그라운드 상세 보기
      </button>
    </div>
  );
}
```

### 글로벌 서비스 사용 예제

```typescript
import { unifiedNavigationService } from '@shared/frontend';

// 어디서든 사용 가능
export const navigateToLogin = () => {
  unifiedNavigationService.pushByName('LOGIN');
};

export const getAdminDashboardPath = () => {
  return unifiedNavigationService.getPathByName('ADMIN_DASHBOARD');
};
```

## 마이그레이션 체크리스트

- [ ] `UnifiedNavigationService` import로 변경
- [ ] 기존 메서드 호출 확인 및 새로운 메서드로 전환
- [ ] 새로운 기능 활용 검토 (이름 기반 네비게이션, 브레드크럼 등)
- [ ] 테스트 코드 업데이트
- [ ] Deprecation 경고 제거 확인

## 추가 문의

마이그레이션 과정에서 문제가 발생하거나 추가 기능이 필요한 경우, 개발팀에 문의하세요.
