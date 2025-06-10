# BottomTab Component Usage Examples

## Example 1: Basic Usage with DashboardLayout

```tsx
import React from 'react';
import { DashboardLayout, BottomTab } from '@shared/frontend';
import { Route } from '@shared/types';

function MobileApp() {
  // Define your bottom navigation routes
  const bottomRoutes: Route[] = [
    {
      name: '홈',
      pathname: '/dashboard/home',
      icon: 'Home',
      active: true, // This will be managed automatically by NavigationService
      params: {},
    },
    {
      name: '검색',
      pathname: '/dashboard/search',
      icon: 'Search',
      active: false,
      params: {},
    },
    {
      name: '알림',
      pathname: '/dashboard/notifications',
      icon: 'Bell',
      active: false,
      params: {},
    },
    {
      name: '프로필',
      pathname: '/dashboard/profile',
      icon: 'User',
      active: false,
      params: {},
    },
  ];

  return (
    <DashboardLayout
      headerComponent={<MyHeader />}
      bottomComponent={<BottomTab routes={bottomRoutes} />}
    >
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">모바일 대시보드</h1>
        <p>하단 탭 네비게이션이 모바일에서만 표시됩니다.</p>
      </div>
    </DashboardLayout>
  );
}

const MyHeader = ({ children }) => (
  <div className="bg-primary text-white p-4 flex items-center justify-between">
    <h1 className="text-lg font-bold">My App</h1>
    {children} {/* Hamburger menu for mobile */}
  </div>
);
```

## Example 2: Integration with NavigationService

```tsx
import React from 'react';
import { BottomTab } from '@shared/frontend';
import { Plate } from '@shared/frontend';

function SmartBottomTab() {
  // Automatically get routes from NavigationService
  const routes = Plate.navigation.getDirectChildrenByPath('/dashboard');

  // Or use smart route matching
  // const routes = Plate.navigation.getSmartChildRoutes('/dashboard');

  return <BottomTab routes={routes} activeColor="primary" showLabels={true} />;
}
```

## Example 3: Custom Tab Handler with Analytics

```tsx
import React from 'react';
import { BottomTab } from '@shared/frontend';
import { Route } from '@shared/types';

function AnalyticsBottomTab() {
  const routes: Route[] = [
    { name: '홈', pathname: '/home', icon: 'Home', params: {} },
    { name: '쇼핑', pathname: '/shop', icon: 'ShoppingBag', params: {} },
    { name: '좋아요', pathname: '/favorites', icon: 'Heart', params: {} },
    { name: '계정', pathname: '/account', icon: 'User', params: {} },
  ];

  const handleTabPress = (route: Route) => {
    // Track analytics
    console.log(`Tab pressed: ${route.name}`);

    // Custom logic before navigation
    if (route.pathname === '/favorites') {
      // Check if user is logged in
      const isLoggedIn = checkUserLogin();
      if (!isLoggedIn) {
        // Redirect to login instead
        Plate.navigation.push('/login');
        return;
      }
    }

    // Default navigation will happen automatically
  };

  return (
    <BottomTab
      routes={routes}
      onTabPress={handleTabPress}
      activeColor="success"
      variant="solid"
    />
  );
}
```

## Example 4: Icon-Only Bottom Tab

```tsx
function IconOnlyBottomTab() {
  const routes: Route[] = [
    { name: 'Home', pathname: '/home', icon: 'Home', params: {} },
    { name: 'Search', pathname: '/search', icon: 'Search', params: {} },
    { name: 'Camera', pathname: '/camera', icon: 'Camera', params: {} },
    {
      name: 'Messages',
      pathname: '/messages',
      icon: 'MessageCircle',
      params: {},
    },
    { name: 'Profile', pathname: '/profile', icon: 'User', params: {} },
  ];

  return (
    <BottomTab
      routes={routes}
      showLabels={false}
      iconSize={24}
      size="md"
      className="shadow-lg border-t-2"
    />
  );
}
```

## Example 5: E-commerce App Bottom Navigation

```tsx
function EcommerceBottomTab() {
  const routes: Route[] = [
    {
      name: '홈',
      pathname: '/shop/home',
      icon: 'Home',
      active: false,
      params: {},
    },
    {
      name: '카테고리',
      pathname: '/shop/categories',
      icon: 'Grid3X3',
      active: false,
      params: {},
    },
    {
      name: '장바구니',
      pathname: '/shop/cart',
      icon: 'ShoppingCart',
      active: false,
      params: {},
      // Custom onClick for cart with item count check
      onClick: () => {
        const cartItems = getCartItems();
        if (cartItems.length === 0) {
          showToast('장바구니가 비어있습니다');
        } else {
          Plate.navigation.push('/shop/cart');
        }
      },
    },
    {
      name: '계정',
      pathname: '/shop/account',
      icon: 'User',
      active: false,
      params: {},
    },
  ];

  return (
    <BottomTab
      routes={routes}
      activeColor="primary"
      inactiveColor="default"
      variant="light"
    />
  );
}
```

## Example 6: Complete Mobile App Structure

```tsx
import React from 'react';
import { DashboardLayout, BottomTab, Header, Navbar } from '@shared/frontend';
import { Plate } from '@shared/frontend';

function CompleteMobileApp() {
  // Get main navigation routes for header
  const headerRoutes = Plate.navigation.getDirectChildrenByPath('/dashboard');

  // Get bottom tab routes
  const bottomRoutes: Route[] = [
    { name: '홈', pathname: '/dashboard/home', icon: 'Home', params: {} },
    {
      name: '탐색',
      pathname: '/dashboard/explore',
      icon: 'Compass',
      params: {},
    },
    {
      name: '활동',
      pathname: '/dashboard/activity',
      icon: 'Activity',
      params: {},
    },
    {
      name: '설정',
      pathname: '/dashboard/settings',
      icon: 'Settings',
      params: {},
    },
  ];

  const handleBottomTabPress = (route: Route) => {
    // Analytics tracking
    analytics.track('bottom_tab_pressed', {
      tab_name: route.name,
      pathname: route.pathname,
      timestamp: Date.now(),
    });
  };

  return (
    <DashboardLayout
      headerComponent={
        <Header
          centerComponent={<Navbar routes={headerRoutes} />}
          drawerComponent={
            <Navbar routes={headerRoutes} direction="vertical" />
          }
        />
      }
      bottomComponent={
        <BottomTab
          routes={bottomRoutes}
          onTabPress={handleBottomTabPress}
          activeColor="primary"
          showLabels={true}
          iconSize={20}
        />
      }
    >
      <div className="min-h-full p-4">
        {/* Your main content here */}
        <h1 className="text-2xl font-bold mb-4">앱 콘텐츠</h1>
        <p className="text-gray-600">
          상단에는 주요 네비게이션이, 하단에는 탭 네비게이션이 표시됩니다. 하단
          탭은 모바일에서만 보이며, 데스크톱에서는 자동으로 숨겨집니다.
        </p>
      </div>
    </DashboardLayout>
  );
}

export default CompleteMobileApp;
```

## Tips for Usage

1. **Responsive Design**: BottomTab은 DashboardLayout의 `bottomComponent`로 사용할 때 모바일에서만 표시됩니다.

2. **Route Management**: NavigationService를 통해 routes를 가져오면 활성 상태가 자동으로 관리됩니다.

3. **Icon Selection**: Lucide 아이콘 라이브러리에서 적절한 아이콘을 선택하세요.

4. **Performance**: routes 배열을 useMemo로 감싸서 불필요한 리렌더링을 방지할 수 있습니다.

```tsx
const routes = useMemo(
  () => [
    { name: '홈', pathname: '/home', icon: 'Home', params: {} },
    // ... other routes
  ],
  [],
);
```

5. **Accessibility**: 각 탭에는 명확하고 간결한 라벨을 제공하세요.

6. **Testing**: 각 탭의 네비게이션이 올바르게 작동하는지 테스트하세요.
