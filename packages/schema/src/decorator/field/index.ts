/**
 * Field Decorators - 통합 Export
 *
 * 모든 필드 데코레이터를 여기서 re-export
 * 기존 import 경로 호환성 유지: `import { StringField } from '@cocrepo/schema'`
 */

// ============================================================================
// Base Types & Helpers
// ============================================================================
export * from "./base/field-options.types";
export * from "./base/optional-field.factory";
export * from "./complex/class.field";
// ============================================================================
// Complex
// ============================================================================
export * from "./complex/enum.field";
export * from "./primitives/boolean.field";
export * from "./primitives/date.field";
// ============================================================================
// Primitives
// ============================================================================
export * from "./primitives/number.field";
export * from "./primitives/string.field";
// ============================================================================
// Specialized
// ============================================================================
export * from "./specialized/email.field";
export * from "./specialized/password.field";
export * from "./specialized/phone.field";
export * from "./specialized/tmpkey.field";
export * from "./specialized/url.field";
export * from "./specialized/uuid.field";

// ============================================================================
// Metadata Keys (기존 field.decorators.ts에서 이동)
// ============================================================================
export const SectionNameKey = "section-name";
export const FormTypeKey = "form-type";
export const ValidationKey = "validation";
export const DefaultKey = "default";

/**
 * Default 값 메타데이터 데코레이터
 *
 * @example
 * ```typescript
 * class Dto {
 *   @Default(true)
 *   @BooleanFieldOptional()
 *   isActive?: boolean;
 * }
 * ```
 */
export function Default(value: any) {
	return (target: any, propertyKey: string) => {
		Reflect.defineMetadata(DefaultKey, value, target, propertyKey);
	};
}
