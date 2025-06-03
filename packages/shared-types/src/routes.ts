import { ROUTE_NAMES } from '@shared/vars';

/**
 * ROUTE_NAMES 객체의 값들을 union 타입으로 추출
 * 이렇게 하면 rawRoutes가 변경되어도 ROUTE_NAMES만 업데이트하면 타입이 자동으로 갱신됨
 */
export type RouteNames = (typeof ROUTE_NAMES)[keyof typeof ROUTE_NAMES];
