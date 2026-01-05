/**
 * ConfigMerger - 설정 병합 클래스
 *
 * 코드 기본값(FieldRegistry + ViewRegistry)과
 * DB 오버라이드(UIConfig)를 병합하고,
 * 권한 및 반응형 필터링을 적용합니다.
 */

import { FieldRegistry } from "./field-registry";
import {
	type AbilityLike,
	DeviceType,
	type FieldConfig,
	type FieldDefinition,
	type MergeContext,
	type ResolvedField,
	type ResolvedViewConfig,
	type ResponsiveConfig,
	type TableViewConfig,
	type ViewDefinition,
} from "./types";

/**
 * 디바이스 타입 감지 함수
 *
 * @returns 현재 디바이스 타입
 *
 * @example
 * ```typescript
 * const device = getDeviceType();
 * // 'desktop' | 'tablet' | 'mobile'
 * ```
 */
export function getDeviceType(): DeviceType {
	// SSR 환경에서는 기본값으로 desktop 반환
	if (typeof window === "undefined") {
		return DeviceType.DESKTOP;
	}

	const width = window.innerWidth;
	if (width >= 1280) return DeviceType.DESKTOP;
	if (width >= 768) return DeviceType.TABLET;
	return DeviceType.MOBILE;
}

/**
 * ConfigMerger 클래스
 *
 * 코드 기본값 + DB 오버라이드 + 권한 필터링을 수행합니다.
 *
 * @example
 * ```typescript
 * const merger = new ConfigMerger();
 *
 * const resolved = merger.merge(
 *   ViewRegistry.get('User', 'table')!,
 *   dbConfig,
 *   {
 *     entity: 'User',
 *     view: 'table',
 *     ability,
 *     deviceType: 'desktop',
 *   }
 * );
 * ```
 */
export class ConfigMerger {
	/**
	 * 코드 기본값 + DB 오버라이드 + 권한/반응형 필터링을 수행합니다.
	 *
	 * @param codeDefault - ViewRegistry의 기본 뷰 정의
	 * @param dbOverride - DB에서 로드한 오버라이드 설정 (없으면 null)
	 * @param context - 병합 컨텍스트 (entity, ability, deviceType)
	 * @returns 최종 병합된 뷰 설정
	 *
	 * @example
	 * ```typescript
	 * const resolved = merger.merge(
	 *   codeDefault,
	 *   dbOverride,
	 *   { entity: 'User', view: 'table', ability, deviceType }
	 * );
	 *
	 * // resolved.fields는 최종 표시할 필드 배열
	 * ```
	 */
	merge(
		codeDefault: ViewDefinition,
		dbOverride: TableViewConfig | null,
		context: MergeContext,
	): ResolvedViewConfig {
		const { entity, ability, deviceType } = context;

		// 1단계: 코드 기본값에서 필드 목록 구성
		let fields = this.buildInitialFields(codeDefault, entity);

		// 2단계: DB 오버라이드 적용
		if (dbOverride?.fields?.length) {
			fields = this.applyOverride(fields, dbOverride.fields);
		}

		// 3단계: 반응형 필터링
		if (deviceType) {
			fields = this.filterByDevice(fields, deviceType);
		}

		// 4단계: 권한 필터링 (CASL fields)
		if (ability) {
			fields = this.filterByAbility(fields, entity, ability);
		}

		// 5단계: visible + order 기준 정렬
		fields = this.sortAndFilterVisible(fields);

		return {
			entity: codeDefault.entity,
			view: codeDefault.view,
			fields,
			defaultSort: dbOverride?.defaultSort ?? codeDefault.defaultSort,
			pageSize: dbOverride?.pageSize ?? codeDefault.pageSize,
		};
	}

	/**
	 * 코드 기본값에서 초기 필드 목록을 구성합니다.
	 */
	private buildInitialFields(
		codeDefault: ViewDefinition,
		entity: string,
	): ResolvedField[] {
		return codeDefault.fields.map((fieldName, index) => {
			const fieldDef = FieldRegistry.get(entity, fieldName);

			// FieldRegistry에 정의가 없으면 최소 기본값 사용
			const baseField: FieldDefinition = fieldDef ?? {
				field: fieldName,
				label: fieldName,
			};

			return {
				...baseField,
				field: fieldName,
				order: index,
				visible: true,
			};
		});
	}

	/**
	 * DB 오버라이드를 적용합니다.
	 */
	private applyOverride(
		defaults: ResolvedField[],
		overrides: FieldConfig[],
	): ResolvedField[] {
		const overrideMap = new Map(overrides.map((o) => [o.field, o]));

		return defaults.map((field) => {
			const override = overrideMap.get(field.field);
			if (!override) return field;

			return {
				...field,
				visible: override.visible,
				order: override.order,
				// 라벨/너비 오버라이드 (선택적)
				label: override.label ?? field.label,
				width: override.width ?? field.width,
			};
		});
	}

	/**
	 * 디바이스 타입에 따라 필드를 필터링합니다.
	 */
	private filterByDevice(
		fields: ResolvedField[],
		deviceType: DeviceType,
	): ResolvedField[] {
		return fields.filter((field) => {
			// responsive 설정이 없으면 모든 디바이스에서 표시
			const responsive: ResponsiveConfig = field.responsive ?? {
				mobile: true,
				tablet: true,
				desktop: true,
			};
			return responsive[deviceType as keyof ResponsiveConfig];
		});
	}

	/**
	 * CASL 권한에 따라 필드를 필터링합니다.
	 */
	private filterByAbility(
		fields: ResolvedField[],
		entity: string,
		ability: AbilityLike,
	): ResolvedField[] {
		return fields.filter((field) => ability.can("read", entity, field.field));
	}

	/**
	 * visible 필드만 남기고 order 순으로 정렬합니다.
	 */
	private sortAndFilterVisible(fields: ResolvedField[]): ResolvedField[] {
		return fields.filter((f) => f.visible).sort((a, b) => a.order - b.order);
	}

	/**
	 * 특정 필드만 추출합니다. (유틸리티 메서드)
	 *
	 * @param resolved - 병합된 뷰 설정
	 * @param fieldNames - 추출할 필드명 배열
	 * @returns 필터링된 필드 배열
	 */
	extractFields(
		resolved: ResolvedViewConfig,
		fieldNames: string[],
	): ResolvedField[] {
		const nameSet = new Set(fieldNames);
		return resolved.fields.filter((f) => nameSet.has(f.field));
	}

	/**
	 * 필드명 배열만 추출합니다. (유틸리티 메서드)
	 *
	 * @param resolved - 병합된 뷰 설정
	 * @returns 필드명 배열
	 */
	getFieldNames(resolved: ResolvedViewConfig): string[] {
		return resolved.fields.map((f) => f.field);
	}
}

/**
 * ConfigMerger 싱글톤 인스턴스
 *
 * @example
 * ```typescript
 * import { configMerger } from '@cocrepo/ui';
 *
 * const resolved = configMerger.merge(codeDefault, dbOverride, context);
 * ```
 */
export const configMerger = new ConfigMerger();
