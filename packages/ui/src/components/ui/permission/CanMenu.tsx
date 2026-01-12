import { useMenuPermission } from "@cocrepo/store";
import type { ReactNode } from "react";

export interface CanMenuProps {
	/**
	 * 메뉴 경로 (menu: 접두어 없이)
	 * 예: "dashboard", "settings/general", "users/list"
	 */
	menu: string;
	/**
	 * 메뉴 접근 권한이 있을 때 렌더링할 내용
	 */
	children: ReactNode;
	/**
	 * 메뉴 접근 권한이 없을 때 렌더링할 대체 내용 (선택)
	 */
	fallback?: ReactNode;
}

/**
 * CanMenu 컴포넌트 - 메뉴 접근 권한이 있을 때만 children을 렌더링
 *
 * 사용 예시:
 * ```tsx
 * <CanMenu menu="dashboard">
 *   <MenuItem>대시보드</MenuItem>
 * </CanMenu>
 *
 * <CanMenu menu="settings/general" fallback={<DisabledMenuItem />}>
 *   <MenuItem>설정</MenuItem>
 * </CanMenu>
 * ```
 */
export function CanMenu({ menu, children, fallback = null }: CanMenuProps) {
	const hasPermission = useMenuPermission(menu);

	if (hasPermission) {
		return <>{children}</>;
	}

	return <>{fallback}</>;
}
