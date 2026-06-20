"use client";

import { useCan } from "@cocrepo/store";
import type { AppAction, AppSubject } from "@cocrepo/type";
import type { ReactNode } from "react";

export interface CanProps {
	/**
	 * 확인할 Action (read, create, update, delete, view 등)
	 */
	action: AppAction;
	/**
	 * 확인할 Subject (entity:user, menu:dashboard 등)
	 */
	subject: AppSubject;
	/**
	 * 특정 필드에 대한 권한 확인 (선택)
	 */
	field?: string;
	/**
	 * 권한이 있을 때 렌더링할 내용
	 */
	children: ReactNode;
	/**
	 * 권한이 없을 때 렌더링할 대체 내용 (선택)
	 */
	fallback?: ReactNode;
}

/**
 * Can 컴포넌트 - 권한이 있을 때만 children을 렌더링
 *
 * 사용 예시:
 * ```tsx
 * <Can action="create" subject="entity:user">
 *   <Button>사용자 추가</Button>
 * </Can>
 *
 * <Can action="view" subject="menu:settings" fallback={<NotAuthorized />}>
 *   <SettingsPage />
 * </Can>
 * ```
 */
export function Can({
	action,
	subject,
	field,
	children,
	fallback = null,
}: CanProps) {
	const hasPermission = useCan(action, subject, field);

	if (hasPermission) {
		return <>{children}</>;
	}

	return <>{fallback}</>;
}
