import { UnifiedNavigationService } from '../services/navigation';
import { rawRoutes } from '@shared/vars';

// 네비게이션 테스트 함수
export function testNavigationService() {
  console.log('🧪 Testing Navigation Service...');

  // 네비게이션 서비스 생성
  const navigationService = new UnifiedNavigationService(rawRoutes);

  // 테스트 경로들
  const testPaths = [
    '/admin/dashboard',
    '/admin/dashboard/user-service',
    '/admin/dashboard/space-service',
    'admin/dashboard',
    'admin/dashboard/user-service',
    'admin/dashboard/space-service',
  ];

  console.log('\n=== Testing getSmartChildRoutes ===');
  testPaths.forEach(path => {
    console.log(`\n🔍 Testing path: "${path}"`);
    const result = navigationService.getSmartChildRoutes(path);
    console.log(`📊 Result: ${result.length} routes found`);
    result.forEach((route, index) => {
      console.log(`  ${index + 1}. ${route.name} -> ${route.pathname}`);
    });
  });

  console.log('\n=== Testing getRoutesByPathname ===');
  testPaths.forEach(path => {
    console.log(`\n🔍 Testing path: "${path}"`);
    const result = navigationService.getRoutesByPathname(path);
    console.log(`📊 Result: ${result.length} routes found`);
    result.forEach((route, index) => {
      console.log(`  ${index + 1}. ${route.name} -> ${route.pathname}`);
    });
  });

  console.log('\n=== FlatRoutes Debug ===');
  const flatRoutes = navigationService.debugFlatRoutes();
  Array.from(flatRoutes.entries()).forEach(([name, route]) => {
    console.log(
      `${name}: ${route.pathname} (children: ${route.children?.length || 0})`,
    );
  });

  return navigationService;
}

// 브라우저 환경에서 실행할 수 있도록 전역에 추가
if (typeof window !== 'undefined') {
  (window as any).testNavigationService = testNavigationService;
}
