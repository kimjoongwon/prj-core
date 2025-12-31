"use client";

import type { ReactNode } from "react";
import { useAbility } from "./AbilityContext";
import type { AbilityActions } from "./types";

export interface CanProps {
	/** 확인할 액션 (ACCESS, CREATE, READ, UPDATE, DELETE, MANAGE) */
	I: AbilityActions;
	/** 확인할 Subject (예: 'menu:members', 'User') */
	a: string;
	/** 권한이 있을 때 렌더링할 컨텐츠 */
	children: ReactNode;
	/** 권한이 없을 때 렌더링할 컨텐츠 (선택) */
	fallback?: ReactNode;
	/** 조건 반전 (권한이 없을 때만 렌더링) */
	not?: boolean;
}

/**
 * Can 컴포넌트
 * CASL ability 기반으로 조건부 렌더링을 제공합니다.
 *
 * @example
 * ```tsx
 * // 권한이 있을 때만 표시
 * <Can I="ACCESS" a="menu:members">
 *   <MenuItem>회원 관리</MenuItem>
 * </Can>
 *
 * // 권한이 없을 때 대체 컨텐츠 표시
 * <Can I="DELETE" a="User" fallback={<DisabledButton />}>
 *   <DeleteButton />
 * </Can>
 *
 * // 권한이 없을 때만 표시
 * <Can I="ACCESS" a="menu:settings" not>
 *   <AccessDeniedMessage />
 * </Can>
 * ```
 */
export function Can({
	I: action,
	a: subject,
	children,
	fallback = null,
	not = false,
}: CanProps) {
	const ability = useAbility();
	const hasPermission = ability.can(action, subject);

	const shouldRender = not ? !hasPermission : hasPermission;

	return <>{shouldRender ? children : fallback}</>;
}

/**
 * Cannot 컴포넌트
 * Can의 반대 - 권한이 없을 때만 렌더링합니다.
 */
export function Cannot({
	I: action,
	a: subject,
	children,
	fallback = null,
}: CanProps) {
	return (
		<Can I={action} a={subject} not fallback={fallback}>
			{children}
		</Can>
	);
}
