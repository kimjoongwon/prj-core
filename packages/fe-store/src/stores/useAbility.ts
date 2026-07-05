import type { AbilityRule, AppAction, AppSubject } from "@cocrepo/type";
import { useApp } from "./useApp";

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
	const app = useApp();
	const ability = app.ability;

	const can = (action: AppAction, subject: AppSubject, field?: string) => {
		return ability.can(action, subject, field);
	};

	const cannot = (action: AppAction, subject: AppSubject, field?: string) => {
		return ability.cannot(action, subject, field);
	};

	const updateRules = (rules: AbilityRule[]) => {
		ability.updateRules(rules);
	};

	const clearRules = () => {
		ability.clearRules();
	};

	const getAllowedActions = (subject: AppSubject) => {
		return ability.getAllowedActions(subject);
	};

	const getAllowedSubjects = (action: AppAction) => {
		return ability.getAllowedSubjects(action);
	};

	const getAllowedMenus = () => {
		return ability.getAllowedMenus();
	};

	return {
		ability: ability.ability,
		rules: ability.rules,
		isLoaded: ability.isLoaded,
		hasGlobalAccess: ability.hasGlobalAccess,
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
	return can(action, subject, field);
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
	return cannot(action, subject, field);
}

/**
 * useHasGlobalAccess - manage all 전역 권한 확인용 훅
 */
export function useHasGlobalAccess(): boolean {
	const { hasGlobalAccess } = useAbility();
	return hasGlobalAccess;
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
	return can("view", `menu:${menuPath}`);
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
	return can("view", `feature:${featureName}`);
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

	return {
		canCreate: can("create", subject),
		canRead: can("read", subject),
		canUpdate: can("update", subject),
		canDelete: can("delete", subject),
		canManage: can("manage", subject),
	};
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
	return can("view", `ui:${uiElement}`);
}
