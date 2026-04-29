import type { NavItemConfig, ScreenScopeKind } from "@cocrepo/type";

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
		scopeKind: "global-full-access-only",
	},
	{
		id: "oidc-clients",
		label: "OIDC 클라이언트",
		icon: "KeyRound",
		path: IDP_PATHS.OIDC_CLIENTS,
		subject: IDP_SUBJECTS.MENU_OIDC_CLIENTS,
		scopeKind: "global-full-access-only",
	},
	{
		id: "accounts",
		label: "계정 관리",
		icon: "UserCog",
		path: IDP_PATHS.ACCOUNTS,
		subject: IDP_SUBJECTS.MENU_ACCOUNTS,
		scopeKind: "tenant-user",
	},
	{
		id: "oidc-sessions",
		label: "세션/토큰",
		icon: "Ticket",
		path: IDP_PATHS.OIDC_SESSIONS,
		subject: IDP_SUBJECTS.MENU_OIDC_SESSIONS,
		scopeKind: "global-full-access-only",
	},
	{
		id: "auth-audit-logs",
		label: "감사 로그",
		icon: "FileSearch",
		path: IDP_PATHS.AUTH_AUDIT_LOGS,
		subject: IDP_SUBJECTS.MENU_AUTH_AUDIT_LOGS,
		scopeKind: "tenant-user",
	},
	{
		id: "security-policy",
		label: "보안 정책",
		icon: "ShieldCheck",
		path: IDP_PATHS.SECURITY_POLICY,
		subject: IDP_SUBJECTS.MENU_SECURITY_POLICY,
		scopeKind: "global-full-access-only",
	},
];

export interface IdpScreenScopeItem {
	pageId: string;
	pageLabel: string;
	pathPattern: string;
	subject: string;
	scopeKind: ScreenScopeKind;
}

export const IDP_SCREEN_SCOPE_ITEMS: IdpScreenScopeItem[] = [
	{
		pageId: "dashboard",
		pageLabel: "대시보드",
		pathPattern: IDP_PATHS.DASHBOARD,
		subject: IDP_SUBJECTS.MENU_DASHBOARD,
		scopeKind: "global-full-access-only",
	},
	{
		pageId: "oidc-clients:list",
		pageLabel: "OIDC 클라이언트 목록",
		pathPattern: IDP_PATHS.OIDC_CLIENTS,
		subject: IDP_SUBJECTS.MENU_OIDC_CLIENTS,
		scopeKind: "global-full-access-only",
	},
	{
		pageId: "oidc-clients:new",
		pageLabel: "OIDC 클라이언트 등록",
		pathPattern: IDP_PATHS.OIDC_CLIENTS_NEW,
		subject: IDP_SUBJECTS.MENU_OIDC_CLIENTS,
		scopeKind: "global-full-access-only",
	},
	{
		pageId: "oidc-clients:detail",
		pageLabel: "OIDC 클라이언트 상세",
		pathPattern: IDP_PATHS.OIDC_CLIENTS_DETAIL,
		subject: IDP_SUBJECTS.MENU_OIDC_CLIENTS,
		scopeKind: "global-full-access-only",
	},
	{
		pageId: "oidc-clients:edit",
		pageLabel: "OIDC 클라이언트 수정",
		pathPattern: IDP_PATHS.OIDC_CLIENTS_EDIT,
		subject: IDP_SUBJECTS.MENU_OIDC_CLIENTS,
		scopeKind: "global-full-access-only",
	},
	{
		pageId: "accounts:list",
		pageLabel: "계정 목록",
		pathPattern: IDP_PATHS.ACCOUNTS,
		subject: IDP_SUBJECTS.MENU_ACCOUNTS,
		scopeKind: "tenant-user",
	},
	{
		pageId: "accounts:detail",
		pageLabel: "계정 상세",
		pathPattern: IDP_PATHS.ACCOUNTS_DETAIL,
		subject: IDP_SUBJECTS.MENU_ACCOUNTS,
		scopeKind: "tenant-user",
	},
	{
		pageId: "oidc-sessions:list",
		pageLabel: "세션/토큰",
		pathPattern: IDP_PATHS.OIDC_SESSIONS,
		subject: IDP_SUBJECTS.MENU_OIDC_SESSIONS,
		scopeKind: "global-full-access-only",
	},
	{
		pageId: "auth-audit-logs:list",
		pageLabel: "감사 로그",
		pathPattern: IDP_PATHS.AUTH_AUDIT_LOGS,
		subject: IDP_SUBJECTS.MENU_AUTH_AUDIT_LOGS,
		scopeKind: "tenant-user",
	},
	{
		pageId: "security-policy",
		pageLabel: "보안 정책",
		pathPattern: IDP_PATHS.SECURITY_POLICY,
		subject: IDP_SUBJECTS.MENU_SECURITY_POLICY,
		scopeKind: "global-full-access-only",
	},
];

function pathPatternToRegExp(pathPattern: string): RegExp {
	const escaped = pathPattern
		.split("/")
		.map((segment) => {
			if (segment.startsWith("[") && segment.endsWith("]")) {
				return "[^/]+";
			}
			return segment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		})
		.join("/");

	return new RegExp(`^${escaped}$`);
}

const IDP_SCREEN_SCOPE_MATCHERS = [...IDP_SCREEN_SCOPE_ITEMS]
	.sort((left, right) => {
		const leftDynamicCount = (left.pathPattern.match(/\[[^/]+\]/g) ?? [])
			.length;
		const rightDynamicCount = (right.pathPattern.match(/\[[^/]+\]/g) ?? [])
			.length;

		if (leftDynamicCount !== rightDynamicCount) {
			return leftDynamicCount - rightDynamicCount;
		}

		return right.pathPattern.length - left.pathPattern.length;
	})
	.map((item) => ({
		item,
		regExp: pathPatternToRegExp(item.pathPattern),
	}));

export function matchIdpScreenScopeItem(pathname: string) {
	return IDP_SCREEN_SCOPE_MATCHERS.find((entry) => entry.regExp.test(pathname))
		?.item;
}

/**
 * IDP 콘솔 BottomTab에 표시할 메뉴 ID 목록
 *
 * 마지막 "more"는 특수 처리되어 나머지 1depth 메뉴를 오버레이로 노출합니다.
 */
export const IDP_BOTTOM_TAB_IDS = [
	"dashboard",
	"accounts",
	"oidc-clients",
	"more",
] as const;

export type IdpBottomTabId = (typeof IDP_BOTTOM_TAB_IDS)[number];
