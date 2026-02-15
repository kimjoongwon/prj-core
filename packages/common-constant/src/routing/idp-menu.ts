import type { NavItemConfig } from "@cocrepo/type";

/**
 * IDP 관리 콘솔 경로 상수
 */
export const IDP_PATHS = {
	// 대시보드
	DASHBOARD: "/dashboard",

	// OIDC 클라이언트 관리
	OIDC_CLIENTS: "/oidc-clients",
	OIDC_CLIENTS_NEW: "/oidc-clients/new",
	OIDC_CLIENTS_DETAIL: "/oidc-clients/[oidcClientId]",
	OIDC_CLIENTS_EDIT: "/oidc-clients/[oidcClientId]/edit",

	// 계정 관리
	ACCOUNTS: "/accounts",
	ACCOUNTS_DETAIL: "/accounts/[userId]",

	// OIDC 세션/토큰 관리
	OIDC_SESSIONS: "/oidc-sessions",

	// 인증 감사 로그
	AUTH_AUDIT_LOGS: "/auth-audit-logs",

	// 보안 정책
	SECURITY_POLICY: "/security-policy",

	// 인증
	AUTH_LOGIN: "/auth/login",
} as const;

/**
 * IDP 관리 콘솔 Subject 상수
 */
export const IDP_SUBJECTS = {
	MENU_DASHBOARD: "menu:dashboard",
	MENU_OIDC_CLIENTS: "menu:oidc-clients",
	MENU_ACCOUNTS: "menu:accounts",
	MENU_OIDC_SESSIONS: "menu:oidc-sessions",
	MENU_AUTH_AUDIT_LOGS: "menu:auth-audit-logs",
	MENU_SECURITY_POLICY: "menu:security-policy",
} as const;

/**
 * IDP 관리 콘솔 네비게이션 아이템
 */
export const IDP_NAV_ITEMS: NavItemConfig[] = [
	{
		id: "dashboard",
		label: "대시보드",
		icon: "LayoutDashboard",
		path: IDP_PATHS.DASHBOARD,
		subject: IDP_SUBJECTS.MENU_DASHBOARD,
	},
	{
		id: "oidc-clients",
		label: "OIDC 클라이언트",
		icon: "KeyRound",
		path: IDP_PATHS.OIDC_CLIENTS,
		subject: IDP_SUBJECTS.MENU_OIDC_CLIENTS,
	},
	{
		id: "accounts",
		label: "계정 관리",
		icon: "UserCog",
		path: IDP_PATHS.ACCOUNTS,
		subject: IDP_SUBJECTS.MENU_ACCOUNTS,
	},
	{
		id: "oidc-sessions",
		label: "세션/토큰",
		icon: "Ticket",
		path: IDP_PATHS.OIDC_SESSIONS,
		subject: IDP_SUBJECTS.MENU_OIDC_SESSIONS,
	},
	{
		id: "auth-audit-logs",
		label: "감사 로그",
		icon: "FileSearch",
		path: IDP_PATHS.AUTH_AUDIT_LOGS,
		subject: IDP_SUBJECTS.MENU_AUTH_AUDIT_LOGS,
	},
	{
		id: "security-policy",
		label: "보안 정책",
		icon: "ShieldCheck",
		path: IDP_PATHS.SECURITY_POLICY,
		subject: IDP_SUBJECTS.MENU_SECURITY_POLICY,
	},
];
