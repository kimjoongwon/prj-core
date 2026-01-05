"use client";

import { useCallback, useMemo } from "react";
import { useAbility } from "../casl";
import { DeviceType, useDeviceType } from "./useDeviceType";

// ============================================================================
// 타입 정의 (packages/ui의 타입과 호환)
// ============================================================================

/**
 * 정렬 설정
 */
interface SortConfig {
	field: string;
	direction: "asc" | "desc";
}

/**
 * 뷰 정의 (코드 기본값)
 */
interface ViewDefinition {
	entity: string;
	view: "table" | "form" | "detail" | "card";
	fields: string[];
	defaultSort?: SortConfig;
	pageSize?: number;
}

/**
 * 필드 오버라이드 설정 (DB에서 로드)
 */
interface FieldConfig {
	field: string;
	visible: boolean;
	order: number;
	label?: string;
	width?: string | number;
}

/**
 * 테이블 뷰 오버라이드 설정
 */
interface TableViewConfig {
	fields: FieldConfig[];
	defaultSort?: SortConfig;
	pageSize?: number;
}

/**
 * 필드 정의
 */
interface FieldDefinition {
	field: string;
	label: string;
	description?: string;
	width?: number | string;
	minWidth?: number;
	sortable?: boolean;
	align?: "left" | "center" | "right";
	editable?: boolean;
	required?: boolean;
	responsive?: {
		mobile: boolean;
		tablet: boolean;
		desktop: boolean;
	};
}

/**
 * 병합된 필드 정보
 */
interface ResolvedField extends FieldDefinition {
	visible: boolean;
	order: number;
}

/**
 * 병합된 뷰 설정
 */
interface ResolvedViewConfig {
	entity: string;
	view: "table" | "form" | "detail" | "card";
	fields: ResolvedField[];
	defaultSort?: SortConfig;
	pageSize?: number;
}

/**
 * CASL Ability 인터페이스
 */
interface AbilityLike {
	can(action: string, subject: string, field?: string): boolean;
}

/**
 * ViewRegistry 인터페이스
 */
interface ViewRegistryLike {
	get(entity: string, view: string): ViewDefinition | undefined;
}

/**
 * FieldRegistry 인터페이스
 */
interface FieldRegistryLike {
	get(entity: string, field: string): FieldDefinition | undefined;
}

/**
 * ConfigMerger 인터페이스
 */
interface ConfigMergerLike {
	merge(
		codeDefault: ViewDefinition,
		dbOverride: TableViewConfig | null,
		context: {
			entity: string;
			view: "table" | "form" | "detail";
			ability?: AbilityLike;
			deviceType?: DeviceType;
		},
	): ResolvedViewConfig;
}

// ============================================================================
// 훅 옵션 및 결과 타입
// ============================================================================

/**
 * useResolvedTableView 훅 옵션
 */
export interface UseResolvedTableViewOptions {
	/** 대상 Entity 이름 */
	entity: string;
	/** ViewRegistry 인스턴스 (필수) */
	viewRegistry: ViewRegistryLike;
	/** FieldRegistry 인스턴스 (필수) */
	fieldRegistry: FieldRegistryLike;
	/** ConfigMerger 인스턴스 (필수) */
	configMerger: ConfigMergerLike;
	/** DB 오버라이드 데이터 (선택, API에서 로드) */
	dbOverride?: TableViewConfig | null;
	/** DB 오버라이드 로딩 상태 */
	isDbLoading?: boolean;
	/** DB 설정 저장 함수 (선택) */
	saveConfig?: (config: TableViewConfig) => void;
	/** 권한 필터링 활성화 여부 (기본: true) */
	enableAbilityFilter?: boolean;
	/** 반응형 필터링 활성화 여부 (기본: true) */
	enableResponsiveFilter?: boolean;
}

/**
 * useResolvedTableView 훅 반환값
 */
export interface UseResolvedTableViewResult {
	/** 병합된 최종 설정 (로딩 중이면 null) */
	config: ResolvedViewConfig | null;
	/** 로딩 상태 */
	isLoading: boolean;
	/** 현재 디바이스 타입 */
	deviceType: DeviceType;
	/** 필드 순서 변경 함수 */
	updateFieldOrder: (fields: string[]) => void;
	/** 필드 표시/숨김 토글 함수 */
	toggleFieldVisibility: (field: string, visible: boolean) => void;
	/** 설정 초기화 함수 */
	resetConfig: () => void;
}

// ============================================================================
// 훅 구현
// ============================================================================

/**
 * 병합된 테이블 뷰 설정 훅
 *
 * 코드 기본값(ViewRegistry, FieldRegistry)과 DB 오버라이드(UIConfig)를 병합하고,
 * CASL 권한 및 반응형 필터링을 적용하여 최종 테이블 뷰 설정을 반환합니다.
 *
 * @param options - 훅 옵션
 * @returns 병합된 테이블 뷰 설정 및 유틸리티 함수
 *
 * @example
 * ```tsx
 * import { ViewRegistry, FieldRegistry, configMerger } from '@cocrepo/ui';
 *
 * const UserTable = () => {
 *   // API에서 DB 오버라이드 조회 (옵션)
 *   // const { data: dbOverride, isLoading } = useGetUIConfig('User', 'table');
 *
 *   const { config, isLoading, updateFieldOrder, toggleFieldVisibility } =
 *     useResolvedTableView({
 *       entity: 'User',
 *       viewRegistry: ViewRegistry,
 *       fieldRegistry: FieldRegistry,
 *       configMerger: configMerger,
 *       // dbOverride,
 *       // isDbLoading: isLoading,
 *     });
 *
 *   if (isLoading || !config) return <Skeleton />;
 *
 *   return (
 *     <DataTable
 *       columns={config.fields.map(field => ({
 *         key: field.field,
 *         header: field.label,
 *         width: field.width,
 *       }))}
 *       onColumnReorder={updateFieldOrder}
 *     />
 *   );
 * };
 * ```
 */
export function useResolvedTableView(
	options: UseResolvedTableViewOptions,
): UseResolvedTableViewResult {
	const {
		entity,
		viewRegistry,
		fieldRegistry,
		configMerger,
		dbOverride = null,
		isDbLoading = false,
		saveConfig,
		enableAbilityFilter = true,
		enableResponsiveFilter = true,
	} = options;

	// CASL Ability 훅
	const ability = useAbility();

	// 디바이스 타입 감지
	const deviceType = useDeviceType();

	// 코드 기본값 조회 (ViewRegistry)
	const codeDefault = useMemo(
		() => viewRegistry.get(entity, "table"),
		[viewRegistry, entity],
	);

	// 병합된 최종 설정 계산
	const resolved = useMemo(() => {
		if (!codeDefault) {
			console.warn(
				`[useResolvedTableView] ViewRegistry에 '${entity}:table' 뷰가 등록되지 않았습니다.`,
			);
			return null;
		}

		// Ability를 AbilityLike로 변환 (권한 필터링용)
		const abilityLike: AbilityLike | undefined = enableAbilityFilter
			? {
					can: (action: string, subject: string, field?: string) => {
						// field가 있으면 필드 레벨 권한 체크
						// 현재 AppAbility는 field 파라미터를 지원하지 않을 수 있으므로
						// 기본적으로 entity 레벨 READ 권한으로 처리
						if (field) {
							// TODO: CASL fields 지원 시 구현
							// 현재는 entity READ 권한이 있으면 모든 필드 접근 허용
							return ability.can(action as "READ", subject);
						}
						return ability.can(action as "READ", subject);
					},
				}
			: undefined;

		return configMerger.merge(codeDefault, dbOverride, {
			entity,
			view: "table",
			ability: abilityLike,
			deviceType: enableResponsiveFilter ? deviceType : undefined,
		});
	}, [
		codeDefault,
		dbOverride,
		entity,
		ability,
		deviceType,
		configMerger,
		enableAbilityFilter,
		enableResponsiveFilter,
	]);

	// 필드 순서 변경
	const updateFieldOrder = useCallback(
		(fields: string[]) => {
			if (!saveConfig) {
				console.warn(
					"[useResolvedTableView] saveConfig 함수가 제공되지 않아 순서를 저장할 수 없습니다.",
				);
				return;
			}

			const fieldConfigs: FieldConfig[] = fields.map((field, index) => ({
				field,
				order: index,
				visible: true,
			}));

			saveConfig({ fields: fieldConfigs });
		},
		[saveConfig],
	);

	// 필드 표시/숨김 토글
	const toggleFieldVisibility = useCallback(
		(field: string, visible: boolean) => {
			if (!saveConfig) {
				console.warn(
					"[useResolvedTableView] saveConfig 함수가 제공되지 않아 설정을 저장할 수 없습니다.",
				);
				return;
			}

			const currentFields = dbOverride?.fields ?? [];
			const existingIndex = currentFields.findIndex((f) => f.field === field);

			let updatedFields: FieldConfig[];

			if (existingIndex >= 0) {
				// 기존 설정 업데이트
				updatedFields = currentFields.map((f) =>
					f.field === field ? { ...f, visible } : f,
				);
			} else {
				// 새 설정 추가
				updatedFields = [
					...currentFields,
					{ field, visible, order: currentFields.length },
				];
			}

			saveConfig({ fields: updatedFields });
		},
		[dbOverride, saveConfig],
	);

	// 설정 초기화 (기본값으로 리셋)
	const resetConfig = useCallback(() => {
		if (!saveConfig) {
			console.warn(
				"[useResolvedTableView] saveConfig 함수가 제공되지 않아 설정을 초기화할 수 없습니다.",
			);
			return;
		}

		// 빈 필드 배열을 저장하면 코드 기본값이 사용됨
		saveConfig({ fields: [] });
	}, [saveConfig]);

	return {
		config: resolved,
		isLoading: isDbLoading,
		deviceType,
		updateFieldOrder,
		toggleFieldVisibility,
		resetConfig,
	};
}

// ============================================================================
// 간소화된 훅 (Registry 직접 주입 없이 사용)
// ============================================================================

/**
 * useSimpleResolvedTableView 훅 옵션
 *
 * Registry 인스턴스를 직접 전달하지 않고,
 * 코드 기본값과 DB 오버라이드만 전달받는 간소화된 버전입니다.
 */
export interface UseSimpleResolvedTableViewOptions {
	/** 대상 Entity 이름 */
	entity: string;
	/** 코드 기본값 (ViewDefinition) */
	codeDefault: ViewDefinition | null;
	/** DB 오버라이드 데이터 (선택) */
	dbOverride?: TableViewConfig | null;
	/** DB 오버라이드 로딩 상태 */
	isDbLoading?: boolean;
	/** DB 설정 저장 함수 (선택) */
	saveConfig?: (config: TableViewConfig) => void;
	/** 권한 필터링 활성화 여부 (기본: true) */
	enableAbilityFilter?: boolean;
	/** 반응형 필터링 활성화 여부 (기본: true) */
	enableResponsiveFilter?: boolean;
	/** 필드 정의 조회 함수 (선택) */
	getFieldDefinition?: (
		entity: string,
		field: string,
	) => FieldDefinition | undefined;
}

/**
 * 간소화된 병합된 테이블 뷰 설정 훅
 *
 * Registry 인스턴스를 직접 주입하지 않고 사용하는 간소화된 버전입니다.
 * 앱에서 ViewRegistry, FieldRegistry를 이미 import하여 사용하는 경우 유용합니다.
 *
 * @param options - 훅 옵션
 * @returns 병합된 테이블 뷰 설정 및 유틸리티 함수
 *
 * @example
 * ```tsx
 * import { ViewRegistry, FieldRegistry } from '@cocrepo/ui';
 *
 * const UserTable = () => {
 *   const codeDefault = ViewRegistry.get('User', 'table');
 *
 *   const { config, isLoading } = useSimpleResolvedTableView({
 *     entity: 'User',
 *     codeDefault,
 *     getFieldDefinition: (entity, field) => FieldRegistry.get(entity, field),
 *   });
 *
 *   // ...
 * };
 * ```
 */
export function useSimpleResolvedTableView(
	options: UseSimpleResolvedTableViewOptions,
): UseResolvedTableViewResult {
	const {
		entity,
		codeDefault,
		dbOverride = null,
		isDbLoading = false,
		saveConfig,
		enableAbilityFilter = true,
		enableResponsiveFilter = true,
		getFieldDefinition,
	} = options;

	const ability = useAbility();
	const deviceType = useDeviceType();

	// 병합 로직 직접 구현
	const resolved = useMemo(() => {
		if (!codeDefault) {
			return null;
		}

		// 1단계: 코드 기본값에서 필드 목록 구성
		let fields: ResolvedField[] = codeDefault.fields.map((fieldName, index) => {
			const fieldDef = getFieldDefinition?.(entity, fieldName);
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

		// 2단계: DB 오버라이드 적용
		if (dbOverride?.fields?.length) {
			const overrideMap = new Map(
				dbOverride.fields.map((o) => [o.field, o]),
			);
			fields = fields.map((field) => {
				const override = overrideMap.get(field.field);
				if (!override) return field;
				return {
					...field,
					visible: override.visible,
					order: override.order,
					label: override.label ?? field.label,
					width: override.width ?? field.width,
				};
			});
		}

		// 3단계: 반응형 필터링
		if (enableResponsiveFilter) {
			fields = fields.filter((field) => {
				const responsive = field.responsive ?? {
					mobile: true,
					tablet: true,
					desktop: true,
				};
				return responsive[deviceType as keyof typeof responsive];
			});
		}

		// 4단계: 권한 필터링
		if (enableAbilityFilter) {
			// 현재는 entity READ 권한만 체크
			// TODO: CASL fields 지원 시 필드 레벨 권한 체크
			const canRead = ability.can("READ", entity);
			if (!canRead) {
				fields = [];
			}
		}

		// 5단계: visible + order 기준 정렬
		fields = fields.filter((f) => f.visible).sort((a, b) => a.order - b.order);

		return {
			entity: codeDefault.entity,
			view: codeDefault.view,
			fields,
			defaultSort: dbOverride?.defaultSort ?? codeDefault.defaultSort,
			pageSize: dbOverride?.pageSize ?? codeDefault.pageSize,
		} as ResolvedViewConfig;
	}, [
		codeDefault,
		dbOverride,
		entity,
		ability,
		deviceType,
		enableAbilityFilter,
		enableResponsiveFilter,
		getFieldDefinition,
	]);

	const updateFieldOrder = useCallback(
		(fields: string[]) => {
			if (!saveConfig) return;
			const fieldConfigs: FieldConfig[] = fields.map((field, index) => ({
				field,
				order: index,
				visible: true,
			}));
			saveConfig({ fields: fieldConfigs });
		},
		[saveConfig],
	);

	const toggleFieldVisibility = useCallback(
		(field: string, visible: boolean) => {
			if (!saveConfig) return;
			const currentFields = dbOverride?.fields ?? [];
			const existingIndex = currentFields.findIndex((f) => f.field === field);

			let updatedFields: FieldConfig[];
			if (existingIndex >= 0) {
				updatedFields = currentFields.map((f) =>
					f.field === field ? { ...f, visible } : f,
				);
			} else {
				updatedFields = [
					...currentFields,
					{ field, visible, order: currentFields.length },
				];
			}
			saveConfig({ fields: updatedFields });
		},
		[dbOverride, saveConfig],
	);

	const resetConfig = useCallback(() => {
		if (!saveConfig) return;
		saveConfig({ fields: [] });
	}, [saveConfig]);

	return {
		config: resolved,
		isLoading: isDbLoading,
		deviceType,
		updateFieldOrder,
		toggleFieldVisibility,
		resetConfig,
	};
}
