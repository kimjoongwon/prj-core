import { useCallback, useMemo } from "react";
import type { AbilityRule, AppAction, AppSubject } from "@cocrepo/type";
import { useStore } from "./useStore";

/**
 * useAbility - CASL 권한 확인 훅
 *
 * 사용 예시:
 * ```tsx
 * const { can, cannot, ability } = useAbility();
 *
 * // 권한 확인
 * if (can('read', 'entity:user')) {
 *   // 사용자 목록 표시
 * }
 *
 * // 메뉴 필터링
 * const allowedMenus = getAllowedMenus();
 * ```
 */
export function useAbility() {
	const store = useStore();
	const abilityStore = store.abilityStore;

	if (!abilityStore) {
		throw new Error(
			"AbilityStore가 초기화되지 않았습니다. RootStore에 abilityStore를 주입해주세요.",
		);
	}

	const can = useCallback(
		(action: AppAction, subject: AppSubject, field?: string) => {
			return abilityStore.can(action, subject, field);
		},
		[abilityStore],
	);

	const cannot = useCallback(
		(action: AppAction, subject: AppSubject, field?: string) => {
			return abilityStore.cannot(action, subject, field);
		},
		[abilityStore],
	);

	const updateRules = useCallback(
		(rules: AbilityRule[]) => {
			abilityStore.updateRules(rules);
		},
		[abilityStore],
	);

	const clearRules = useCallback(() => {
		abilityStore.clearRules();
	}, [abilityStore]);

	const getAllowedActions = useCallback(
		(subject: AppSubject) => {
			return abilityStore.getAllowedActions(subject);
		},
		[abilityStore],
	);

	const getAllowedSubjects = useCallback(
		(action: AppAction) => {
			return abilityStore.getAllowedSubjects(action);
		},
		[abilityStore],
	);

	const getAllowedMenus = useCallback(() => {
		return abilityStore.getAllowedMenus();
	}, [abilityStore]);

	return {
		ability: abilityStore.ability,
		rules: abilityStore.rules,
		isLoaded: abilityStore.isLoaded,
		can,
		cannot,
		updateRules,
		clearRules,
		getAllowedActions,
		getAllowedSubjects,
		getAllowedMenus,
	};
}

/**
 * useCan - 단일 권한 확인용 훅
 *
 * 사용 예시:
 * ```tsx
 * const canReadUser = useCan('read', 'entity:user');
 * const canEditAdmin = useCan('update', 'entity:admin');
 * ```
 */
export function useCan(
	action: AppAction,
	subject: AppSubject,
	field?: string,
): boolean {
	const { can } = useAbility();
	return useMemo(
		() => can(action, subject, field),
		[can, action, subject, field],
	);
}

/**
 * useCannot - 단일 권한 불가 확인용 훅
 *
 * 사용 예시:
 * ```tsx
 * const cannotDeleteAdmin = useCannot('delete', 'entity:admin');
 * ```
 */
export function useCannot(
	action: AppAction,
	subject: AppSubject,
	field?: string,
): boolean {
	const { cannot } = useAbility();
	return useMemo(
		() => cannot(action, subject, field),
		[cannot, action, subject, field],
	);
}

/**
 * useMenuPermission - 메뉴 접근 권한 확인용 훅
 *
 * 사용 예시:
 * ```tsx
 * const canAccessDashboard = useMenuPermission('dashboard');
 * const canAccessSettings = useMenuPermission('settings/general');
 * ```
 */
export function useMenuPermission(menuPath: string): boolean {
	const { can } = useAbility();
	return useMemo(() => can("view", `menu:${menuPath}`), [can, menuPath]);
}

/**
 * useFeaturePermission - 기능 접근 권한 확인용 훅
 *
 * 사용 예시:
 * ```tsx
 * const canExport = useFeaturePermission('export');
 * const canBulkEdit = useFeaturePermission('bulk-edit');
 * ```
 */
export function useFeaturePermission(featureName: string): boolean {
	const { can } = useAbility();
	return useMemo(
		() => can("view", `feature:${featureName}`),
		[can, featureName],
	);
}

/**
 * useEntityPermission - 엔티티 CRUD 권한 확인용 훅
 *
 * 사용 예시:
 * ```tsx
 * const userPermissions = useEntityPermission('user');
 * if (userPermissions.canCreate) {
 *   // 생성 버튼 표시
 * }
 * ```
 */
export function useEntityPermission(entityName: string) {
	const { can } = useAbility();
	const subject = `entity:${entityName}`;

	return useMemo(
		() => ({
			canCreate: can("create", subject),
			canRead: can("read", subject),
			canUpdate: can("update", subject),
			canDelete: can("delete", subject),
			canManage: can("manage", subject),
		}),
		[can, subject],
	);
}

/**
 * useUiPermission - UI 요소 표시 권한 확인용 훅
 *
 * 사용 예시:
 * ```tsx
 * const canShowExportButton = useUiPermission('button:export');
 * const canShowAdvancedFilters = useUiPermission('panel:advanced-filters');
 * ```
 */
export function useUiPermission(uiElement: string): boolean {
	const { can } = useAbility();
	return useMemo(() => can("view", `ui:${uiElement}`), [can, uiElement]);
}
