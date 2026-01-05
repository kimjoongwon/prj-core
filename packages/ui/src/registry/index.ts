/**
 * Registry 시스템
 *
 * 코드 기반 필드/뷰 레지스트리와 설정 병합 기능을 제공합니다.
 *
 * ## 핵심 원칙
 * - **코드가 기본**: 타입 안전한 기본값은 코드로 정의 (FieldRegistry, ViewRegistry)
 * - **DB는 오버라이드**: 런타임 변경이 필요한 부분만 DB에 저장 (UIConfig)
 * - **권한은 CASL**: 필드 수준 권한은 CASL fields로 처리
 * - **DB 없어도 동작**: DB 오버라이드가 없으면 코드 기본값이 그대로 적용
 *
 * @example
 * ```typescript
 * // 1. 필드 등록 (앱 초기화 시)
 * import { FieldRegistry, ViewRegistry } from '@cocrepo/ui';
 * import { UserFields } from '@cocrepo/ui/registry/entities';
 * import { registerUserViews } from '@cocrepo/ui/registry/views';
 *
 * FieldRegistry.register('User', UserFields);
 * registerUserViews();
 *
 * // 2. 뷰 조회 및 병합
 * import { configMerger, ViewRegistry, getDeviceType } from '@cocrepo/ui';
 *
 * const codeDefault = ViewRegistry.get('User', 'table');
 * const resolved = configMerger.merge(codeDefault, dbConfig, {
 *   entity: 'User',
 *   view: 'table',
 *   ability,
 *   deviceType: getDeviceType(),
 * });
 *
 * // 3. 결과 사용
 * resolved.fields.forEach(field => {
 *   console.log(field.label, field.width);
 * });
 * ```
 */

// 설정 병합
export { ConfigMerger, configMerger, getDeviceType } from "./config-merger";
// Entity 필드 정의
export * from "./entities";
// 레지스트리 클래스
export { FieldRegistry } from "./field-registry";
// 타입 정의
export * from "./types";
export { ViewRegistry } from "./view-registry";

// 뷰 정의
export * from "./views";
