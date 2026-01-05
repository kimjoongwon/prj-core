/**
 * UI Config 관련 훅
 *
 * 하이브리드 UI Config 시스템을 위한 React 훅을 제공합니다.
 *
 * ## 핵심 원칙
 * - **코드가 기본**: 타입 안전한 기본값은 코드로 정의 (FieldRegistry, ViewRegistry)
 * - **DB는 오버라이드**: 런타임 변경이 필요한 부분만 DB에 저장 (UIConfig)
 * - **권한은 CASL**: 필드 수준 권한은 CASL fields로 처리
 * - **DB 없어도 동작**: DB 오버라이드가 없으면 코드 기본값이 그대로 적용
 *
 * @example
 * ```tsx
 * import {
 *   useDeviceType,
 *   useResolvedTableView,
 *   DeviceType,
 * } from '@cocrepo/hook';
 * import { ViewRegistry, FieldRegistry, configMerger } from '@cocrepo/ui';
 *
 * // 디바이스 타입 감지
 * const deviceType = useDeviceType();
 *
 * // 테이블 뷰 설정 (병합)
 * const { config, isLoading } = useResolvedTableView({
 *   entity: 'User',
 *   viewRegistry: ViewRegistry,
 *   fieldRegistry: FieldRegistry,
 *   configMerger,
 * });
 * ```
 */

// 디바이스 타입 감지
export {
	DeviceType,
	getDeviceType,
	getDeviceTypeFromWidth,
	useDeviceFlags,
	useDeviceType,
	type UseDeviceTypeOptions,
} from "./useDeviceType";

// 테이블 뷰 설정 병합
export {
	useResolvedTableView,
	useSimpleResolvedTableView,
	type UseResolvedTableViewOptions,
	type UseResolvedTableViewResult,
	type UseSimpleResolvedTableViewOptions,
} from "./useResolvedTableView";
