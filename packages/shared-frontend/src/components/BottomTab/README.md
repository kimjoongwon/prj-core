# BottomTab Component

모바일 환경에서 사용되는 하단 탭 네비게이션 컴포넌트입니다. Route 타입의 배열을 받아서 네비게이션 탭을 생성합니다.

## Features

- **Route 기반**: `Route[]` 타입을 받아서 활성 상태 자동 추적
- **모바일 최적화**: 터치 친화적인 크기와 레이아웃
- **아이콘 지원**: Lucide 아이콘 자동 렌더링
- **활성 상태 표시**: MobX observable을 통한 실시간 상태 반영
- **커스터마이징**: 색상, 크기, 스타일 옵션
- **반응형**: DashboardLayout의 bottomComponent와 완벽 통합
- **TypeScript 지원**: 완전한 타입 안전성

## Props

### BottomTabProps

| Prop            | Type                                                             | Default     | Description                     |
| --------------- | ---------------------------------------------------------------- | ----------- | ------------------------------- |
| `routes`        | `Route[]`                                                        | Required    | 네비게이션에 표시할 라우트 배열 |
| `className`     | `string`                                                         | `''`        | 추가 CSS 클래스                 |
| `activeColor`   | `'primary' \| 'secondary' \| 'success' \| 'warning' \| 'danger'` | `'primary'` | 활성 탭의 색상                  |
| `inactiveColor` | `'default' \| 'secondary'`                                       | `'default'` | 비활성 탭의 색상                |
| `variant`       | `'light' \| 'solid' \| 'bordered' \| 'ghost'`                    | `'light'`   | 버튼 스타일 변형                |
| `size`          | `'sm' \| 'md' \| 'lg'`                                           | `'sm'`      | 버튼 크기                       |
| `showLabels`    | `boolean`                                                        | `true`      | 라벨 표시 여부                  |
| `iconSize`      | `number`                                                         | `20`        | 아이콘 크기 (픽셀)              |
| `onTabPress`    | `(route: Route) => void`                                         | `undefined` | 탭 클릭 시 실행할 커스텀 핸들러 |

## Usage Examples

### Basic Usage

```tsx
import { BottomTab } from '@shared/frontend';
import { Route } from '@shared/types';

const routes: Route[] = [
  {
    name: '홈',
    pathname: '/home',
    icon: 'Home',
    active: true,
    params: {},
  },
  {
    name: '검색',
    pathname: '/search',
    icon: 'Search',
    active: false,
    params: {},
  },
  {
    name: '설정',
    pathname: '/settings',
    icon: 'Settings',
    active: false,
    params: {},
  },
];

function MyApp() {
  return <BottomTab routes={routes} />;
}
```

### With DashboardLayout

```tsx
import { DashboardLayout, BottomTab } from '@shared/frontend';
import { Plate } from '@shared/frontend';

function MobileApp() {
  // 현재 경로의 자식 라우트들을 가져오기
  const bottomRoutes = Plate.navigation.getDirectChildrenByPath('/mobile');

  return (
    <DashboardLayout
      headerComponent={<MyHeader />}
      bottomComponent={<BottomTab routes={bottomRoutes} />}
    >
      <div className="p-4">
        <h1>모바일 앱 콘텐츠</h1>
      </div>
    </DashboardLayout>
  );
}
```

### Custom Styling

```tsx
function CustomBottomTab() {
  return (
    <BottomTab
      routes={routes}
      activeColor="success"
      inactiveColor="secondary"
      variant="solid"
      size="md"
      showLabels={false}
      iconSize={24}
      className="shadow-lg"
    />
  );
}
```

### With Custom Handler

```tsx
function BottomTabWithAnalytics() {
  const handleTabPress = (route: Route) => {
    // 분석 추적
    analytics.track('tab_pressed', {
      tab_name: route.name,
      pathname: route.pathname,
    });

    // 기본 네비게이션은 자동으로 실행됩니다
  };

  return <BottomTab routes={routes} onTabPress={handleTabPress} />;
}
```

### NavigationService Integration

```tsx
import { Plate } from '@shared/frontend';

function SmartBottomTab() {
  // NavigationService에서 자동으로 라우트 가져오기
  const routes = Plate.navigation.getSmartChildRoutes('/dashboard');

  return <BottomTab routes={routes} />;
}
```

## Route Requirements

BottomTab 컴포넌트에서 사용하는 Route 객체는 다음 속성들을 활용합니다:

```typescript
interface Route {
  name: string; // 탭에 표시될 라벨 (필수)
  pathname: string; // 네비게이션할 경로 (필수)
  active?: boolean; // 활성 상태 (자동 추적)
  icon?: string; // Lucide 아이콘 이름
  onClick?: () => void; // 커스텀 클릭 핸들러
  params?: any; // 라우트 파라미터
}
```

## Icon Support

컴포넌트는 Lucide 아이콘을 지원합니다. Route 객체의 `icon` 속성에 Lucide 아이콘 이름을 문자열로 제공하면 자동으로 렌더링됩니다.

```tsx
const routes: Route[] = [
  { name: '홈', pathname: '/home', icon: 'Home', params: {} },
  { name: '검색', pathname: '/search', icon: 'Search', params: {} },
  { name: '프로필', pathname: '/profile', icon: 'User', params: {} },
  { name: '설정', pathname: '/settings', icon: 'Settings', params: {} },
];
```

## Navigation Behavior

1. **기본 동작**: `route.pathname`으로 네비게이션 (`Plate.navigation.push()` 사용)
2. **커스텀 onClick**: `route.onClick`이 정의되어 있으면 우선 실행
3. **커스텀 onTabPress**: props로 전달된 핸들러가 있으면 추가로 실행

우선순위: `onTabPress` → `route.onClick` → 기본 네비게이션

## Responsive Design

- **모바일 최적화**: 터치하기 쉬운 크기 (높이 48px)
- **DashboardLayout 통합**: `bottomComponent`로 사용 시 모바일에서만 표시
- **반응형 텍스트**: 긴 라벨은 자동으로 truncate

## Styling

컴포넌트는 Tailwind CSS를 사용하며, 다음과 같은 기본 스타일을 제공합니다:

- 상단 경계선 (`border-t border-divider`)
- 배경색 (`bg-content1`)
- 플렉스 레이아웃으로 균등 분배
- 활성/비활성 상태에 따른 폰트 굵기 변경

## Best Practices

1. **라우트 수 제한**: 모바일 화면에서는 3-5개의 탭을 권장
2. **명확한 라벨**: 짧고 이해하기 쉬운 라벨 사용
3. **적절한 아이콘**: 각 탭의 의미를 잘 나타내는 아이콘 선택
4. **활성 상태**: NavigationService를 통해 자동으로 관리되는 활성 상태 활용

## Integration with NavigationService

BottomTab은 기존 NavigationService와 완벽하게 통합됩니다:

```tsx
// 현재 경로의 자식 라우트들을 자동으로 가져와서 사용
const routes = Plate.navigation.getDirectChildrenByPath('/dashboard');

// 또는 스마트 매칭을 통해 자동으로 적절한 라우트들 가져오기
const smartRoutes = Plate.navigation.getSmartChildRoutes(
  window.location.pathname,
);
```

## Notes

- Route의 `active` 상태는 NavigationService에 의해 자동으로 관리됩니다
- MobX observable을 통해 실시간으로 활성 상태가 업데이트됩니다
- DashboardLayout의 `bottomComponent`로 사용 시 데스크톱에서는 자동으로 숨겨집니다
