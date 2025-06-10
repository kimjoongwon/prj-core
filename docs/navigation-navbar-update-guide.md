# Navigation & Navbar 업데이트 가이드

## 변경 사항 요약

### 1. NavigationService 개선

#### Route 객체 활용

- **기존**: RouteBuilder 기반 활성화 상태 수동 체크
- **개선**: Route 객체의 `active` 속성을 MobX observable로 활용

#### 새로운 메서드 추가

```typescript
// RouteBuilder를 Route로 변환 (active 상태 포함)
convertRouteBuilderToRoute(routeBuilder: RouteBuilder, parentPath?: string): Route

// RouteBuilder 배열을 Route 배열로 변환
convertRouteBuilderArrayToRoutes(routeBuilders: RouteBuilder[]): Route[]

// 현재 경로의 자식 Route들 가져오기 (active 상태 포함)
getChildRoutesFromCurrentPath(): Route[]

// 경로로 직계 자식 Route들 가져오기
getDirectChildRoutesByPath(pathname: string): Route[]

// 라우트 배열의 활성화 상태 업데이트
updateRoutesActiveState(routes: Route[]): Route[]

// 활성화된 Route들만 반환
getActiveRoutes(): Route[]

// 이름으로 활성화된 Route 검색
getActiveRouteByName(name: string): Route | undefined
```

### 2. Navbar 컴포넌트 개선

#### 타입 변경

- **기존**: `RouteBuilder[]` 사용
- **개선**: `Route[]` 사용

#### 활성화 상태 확인 방식 변경

- **기존**: 복잡한 수동 체크 로직
- **개선**: Route 객체의 `active` 속성 직접 사용

```typescript
// 기존 방식
const isRouteActive = (route: RouteBuilder): boolean => {
  const currentPath = Plate.navigation.currentFullPath;
  const selectedDashboardRoute = Plate.navigation.selectedDashboardRoute;
  // 복잡한 수동 체크 로직...
};

// 개선된 방식
const isRouteActive = (route: Route): boolean => {
  return route.active || false;
};
```

## 사용법

### 1. 원격 데이터 활용

```typescript
// 서버에서 RouteBuilder 데이터 받기
const routeBuildersFromServer: RouteBuilder[] = await fetchRoutes();

// Route로 변환하고 활성화 상태 업데이트
const routes = Plate.navigation.convertRouteBuilderArrayToRoutes(
  routeBuildersFromServer,
);
const routesWithActiveState = Plate.navigation.updateRoutesActiveState(routes);

// Navbar에 전달
<Navbar routes={routesWithActiveState} direction="horizontal" />;
```

### 2. 현재 경로 기반 자동 생성

```typescript
// 현재 경로의 자식 Route들을 자동으로 가져오기
const childRoutes = Plate.navigation.getChildRoutesFromCurrentPath();

<Navbar routes={childRoutes} direction="vertical" />;
```

### 3. 특정 경로의 자식 라우트 사용

```typescript
// 특정 경로의 직계 자식 Route들 가져오기
const dashboardChildRoutes =
  Plate.navigation.getDirectChildRoutesByPath('/dashboard');

<Navbar routes={dashboardChildRoutes} direction="horizontal" />;
```

## 주요 이점

1. **MobX 활용**: Route 객체의 `active` 상태가 observable이므로 자동 반응형 업데이트
2. **타입 안전성**: Route 타입 사용으로 더 명확한 인터페이스
3. **간소화된 로직**: 복잡한 활성화 체크 로직 제거
4. **일관된 패턴**: 모든 네비게이션 컴포넌트에서 동일한 방식 사용

## 마이그레이션 가이드

### 기존 코드

```typescript
interface NavbarProps {
  routes: RouteBuilder[];
}

const isRouteActive = (route: RouteBuilder): boolean => {
  // 복잡한 수동 체크
};
```

### 새로운 코드

```typescript
interface NavbarProps {
  routes: Route[];
}

const isRouteActive = (route: Route): boolean => {
  return route.active || false;
};
```

### 호출부 업데이트

```typescript
// 기존
<Navbar routes={routeBuilders} />;

// 새로운 방식
const routes = Plate.navigation.convertRouteBuilderArrayToRoutes(routeBuilders);
const activeRoutes = Plate.navigation.updateRoutesActiveState(routes);
<Navbar routes={activeRoutes} />;
```
