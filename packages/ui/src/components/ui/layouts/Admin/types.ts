import type { ReactNode } from "react";

/**
 * 메뉴 아이템 타입
 */
export interface AdminMenuItem {
	/**
	 * 고유 ID
	 */
	id: string;
	/**
	 * 메뉴 표시 이름
	 */
	label: string;
	/**
	 * Lucide 아이콘 이름
	 */
	icon?: string;
	/**
	 * 메뉴 경로 (절대 경로)
	 */
	path?: string;
	/**
	 * 권한 확인용 Subject (menu:xxx 패턴)
	 * 예: "menu:dashboard", "menu:users/list"
	 */
	permission?: string;
	/**
	 * 하위 메뉴
	 */
	children?: AdminMenuItem[];
	/**
	 * 배지 표시 (알림 수 등)
	 */
	badge?: number | string;
	/**
	 * 비활성화 여부
	 */
	disabled?: boolean;
}

/**
 * 메뉴 그룹 타입
 */
export interface AdminMenuGroup {
	/**
	 * 그룹 ID
	 */
	id: string;
	/**
	 * 그룹 표시 이름
	 */
	label: string;
	/**
	 * 그룹 내 메뉴 아이템
	 */
	items: AdminMenuItem[];
}

/**
 * 사용자 정보 타입
 */
export interface AdminUserInfo {
	/**
	 * 사용자 이름
	 */
	name: string;
	/**
	 * 이메일
	 */
	email?: string;
	/**
	 * 아바타 이미지 URL
	 */
	avatarUrl?: string;
	/**
	 * 역할/직책
	 */
	role?: string;
}

/**
 * AdminLayout Props
 */
export interface AdminLayoutProps {
	/**
	 * 메뉴 구성
	 */
	menuGroups: AdminMenuGroup[];
	/**
	 * 현재 활성 경로
	 */
	activePath?: string;
	/**
	 * 메뉴 클릭 핸들러
	 */
	onMenuClick?: (path: string) => void;
	/**
	 * 사용자 정보
	 */
	userInfo?: AdminUserInfo;
	/**
	 * 로고 컴포넌트
	 */
	logo?: ReactNode;
	/**
	 * 헤더 오른쪽 영역 (알림, 설정 등)
	 */
	headerActions?: ReactNode;
	/**
	 * 로그아웃 핸들러
	 */
	onLogout?: () => void;
	/**
	 * 메인 컨텐츠
	 */
	children: ReactNode;
	/**
	 * 사이드바 접힘 상태 (제어)
	 */
	collapsed?: boolean;
	/**
	 * 사이드바 접힘 상태 변경 핸들러
	 */
	onCollapsedChange?: (collapsed: boolean) => void;
}

/**
 * AdminSidebar Props
 */
export interface AdminSidebarProps {
	/**
	 * 메뉴 구성
	 */
	menuGroups: AdminMenuGroup[];
	/**
	 * 현재 활성 경로
	 */
	activePath?: string;
	/**
	 * 메뉴 클릭 핸들러
	 */
	onMenuClick?: (path: string) => void;
	/**
	 * 사이드바 접힘 상태
	 */
	collapsed?: boolean;
	/**
	 * 로고 컴포넌트
	 */
	logo?: ReactNode;
}

/**
 * AdminHeader Props
 */
export interface AdminHeaderProps {
	/**
	 * 사용자 정보
	 */
	userInfo?: AdminUserInfo;
	/**
	 * 오른쪽 영역 (알림, 설정 등)
	 */
	actions?: ReactNode;
	/**
	 * 로그아웃 핸들러
	 */
	onLogout?: () => void;
	/**
	 * 사이드바 토글 핸들러 (모바일)
	 */
	onToggleSidebar?: () => void;
}
