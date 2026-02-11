"use client";

import { useMemo } from "react";
import { useAbility } from "./AbilityContext";
import type { AbilityActions } from "./types";

/**
 * 특정 권한 확인 훅
 * @param action 액션 (CREATE, READ, UPDATE, DELETE 등)
 * @param subject Subject (menu:members, entity:User 등)
 * @returns 권한 여부
 */
export function usePermission(
	action: AbilityActions,
	subject: string,
): boolean {
	const ability = useAbility();
	return ability.can(action, subject);
}

/**
 * 엔티티별 CRUD 권한 훅
 * @param entity 엔티티명 (entity:User, entity:Ground 등)
 * @returns CRUD 권한 객체
 */
export function useEntityPermissions(entity: string) {
	const ability = useAbility();

	return useMemo(
		() => ({
			canCreate: ability.can("CREATE", entity),
			canRead: ability.can("READ", entity),
			canUpdate: ability.can("UPDATE", entity),
			canDelete: ability.can("DELETE", entity),
			canManage: ability.can("MANAGE", entity),
			canExport: ability.can("EXPORT", entity),
			canImport: ability.can("IMPORT", entity),
		}),
		[ability, entity],
	);
}

/**
 * 기능 권한 확인 훅
 * @param feature 기능명 (feature:export, feature:bulk-delete 등)
 * @returns 기능 접근 가능 여부
 */
export function useFeatureAccess(feature: string): boolean {
	const ability = useAbility();
	return ability.can("ACCESS", feature);
}

/**
 * 여러 권한 동시 확인 훅
 * @param permissions 확인할 권한 목록
 * @returns 각 권한의 결과 배열
 */
export function usePermissions(
	permissions: Array<{ action: AbilityActions; subject: string }>,
): boolean[] {
	const ability = useAbility();

	return useMemo(
		() => permissions.map((p) => ability.can(p.action, p.subject)),
		[ability, permissions],
	);
}

/**
 * 모든 권한 충족 확인 훅
 * @param permissions 확인할 권한 목록
 * @returns 모든 권한이 있으면 true
 */
export function useAllPermissions(
	permissions: Array<{ action: AbilityActions; subject: string }>,
): boolean {
	const results = usePermissions(permissions);
	return results.every(Boolean);
}

/**
 * 하나 이상의 권한 충족 확인 훅
 * @param permissions 확인할 권한 목록
 * @returns 하나 이상의 권한이 있으면 true
 */
export function useAnyPermission(
	permissions: Array<{ action: AbilityActions; subject: string }>,
): boolean {
	const results = usePermissions(permissions);
	return results.some(Boolean);
}
