import type { ReactNode } from "react";

export interface HeaderBarUserInfo {
	name: string;
	email?: string;
	avatarUrl?: string;
	role?: string;
}

export interface HeaderBarProps {
	userInfo?: HeaderBarUserInfo;
	actions?: ReactNode;
	onLogout?: () => void;
	logo?: ReactNode;
	leading?: ReactNode;
	context?: ReactNode;
	className?: string;
	renderUserMenu?: (params: {
		userInfo: HeaderBarUserInfo;
		onLogout?: () => void;
	}) => ReactNode;
}
