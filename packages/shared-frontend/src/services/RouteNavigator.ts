// 이 파일은 하위 호환성을 위해 유지되며, UnifiedNavigationService로 리다이렉트됩니다.
// 새로운 코드에서는 UnifiedNavigationService를 사용하세요.

import {
  UnifiedNavigationService,
  unifiedNavigationService,
} from './UnifiedNavigationService';

/**
 * @deprecated RouteNavigator는 더 이상 권장되지 않습니다. UnifiedNavigationService를 사용하세요.
 */
export class RouteNavigator extends UnifiedNavigationService {
  constructor() {
    super();
    console.warn(
      'RouteNavigator는 deprecated입니다. UnifiedNavigationService를 사용하세요.',
    );
  }
}

/**
 * @deprecated routeNavigator 싱글톤은 더 이상 권장되지 않습니다. unifiedNavigationService를 사용하세요.
 */
export const routeNavigator = unifiedNavigationService;
