import { useCannot } from "@cocrepo/store";
import type { AppAction, AppSubject } from "@cocrepo/type";
import type { ReactNode } from "react";

export interface CannotProps {
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
	 * 권한이 없을 때 렌더링할 내용
	 */
	children: ReactNode;
	/**
	 * 권한이 있을 때 렌더링할 대체 내용 (선택)
	 */
	fallback?: ReactNode;
}

/**
 * Cannot 컴포넌트 - 권한이 없을 때만 children을 렌더링
 *
 * 사용 예시:
 * ```tsx
 * <Cannot action="delete" subject="entity:admin">
 *   <Alert>관리자 삭제 권한이 없습니다.</Alert>
 * </Cannot>
 *
 * <Cannot action="view" subject="menu:settings" fallback={<SettingsPage />}>
 *   <LoginPrompt />
 * </Cannot>
 * ```
 */
export function Cannot({
	action,
	subject,
	field,
	children,
	fallback = null,
}: CannotProps) {
	const noPermission = useCannot(action, subject, field);

	if (noPermission) {
		return <>{children}</>;
	}

	return <>{fallback}</>;
}
