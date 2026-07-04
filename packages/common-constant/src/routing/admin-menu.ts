import type {
	AppIconName,
	FABAction,
	NavItemConfig,
	ScreenScopeKind,
} from "@cocrepo/type";
import { GENERATED_ADMIN_NAV_ITEMS } from "./generated/admin-route-catalog.generated";

/**
 * 어드민 메뉴 경로 상수
 *
 * 경로 설계 원칙:
 * 1. 백엔드 엔티티 이름의 복수형 사용 (User → /users)
 * 2. UI 구현 방식 단어 배제 (list, table, grid 금지)
 * 3. 경로는 "무엇이 있는 화면인가"를 추상적으로 표현
 */
export const ADMIN_PATHS = {
	// 대시보드
	DASHBOARD: "/dashboard",

	// 회원 (User 엔티티)
	USERS: "/users",
	USERS_DETAIL: "/users/[userId]",
	EMAIL_VERIFICATIONS: "/email-verifications",

	// 역할 관리
	ROLES: "/roles",
	ROLES_NEW: "/roles/new",
	ROLES_DETAIL: "/roles/[roleId]",
	ROLES_EDIT: "/roles/[roleId]/edit",

	// 정책 (Policy)
	POLICIES: "/policies",
	POLICIES_NEW: "/policies/new",
	POLICIES_DETAIL: "/policies/[policyId]",
	POLICIES_EDIT: "/policies/[policyId]/edit",

	// 권한 정의 (Ability)
	ABILITIES: "/abilities",
	ABILITIES_NEW: "/abilities/new",
	ABILITIES_DETAIL: "/abilities/[abilityId]",
	ABILITIES_EDIT: "/abilities/[abilityId]/edit",

	// 액션 (Action)
	ACTIONS: "/actions",
	ACTIONS_NEW: "/actions/new",
	ACTIONS_DETAIL: "/actions/[actionId]",
	ACTIONS_EDIT: "/actions/[actionId]/edit",

	// 대상 (Subject)
	SUBJECTS: "/subjects",
	SUBJECTS_DETAIL: "/subjects/[subjectId]",

	// 타임라인 (Timeline 엔티티)
	TIMELINES: "/timelines",
	TIMELINES_NEW: "/timelines/new",
	TIMELINES_DETAIL: "/timelines/[timelineId]",
	TIMELINES_EDIT: "/timelines/[timelineId]/edit",

	// 수강 관리 (Course 계열)
	COURSES: "/courses",

	// 결제 관리 (Payment 공통 원장)
	PAYMENTS: "/payments",

	// 세션 (Session 엔티티 - Timeline 종속)
	TIMELINE_SESSIONS_NEW: "/timelines/[timelineId]/sessions/new",
	TIMELINE_SESSIONS_DETAIL: "/timelines/[timelineId]/sessions/[sessionId]",
	TIMELINE_SESSIONS_EDIT: "/timelines/[timelineId]/sessions/[sessionId]/edit",

	// 공간 (Space Aggregate Root, Ground는 1:1 detail child)
	SPACES: "/spaces",
	SPACES_NEW: "/spaces/new",
	SPACES_DETAIL: "/spaces/[spaceId]/ground",
	SPACES_EDIT: "/spaces/[spaceId]/ground/edit",

	// 작업 (Task Aggregate Root, Exercise는 1:1 detail child)
	TASKS: "/tasks",
	TASKS_NEW: "/tasks/new",
	TASKS_DETAIL: "/tasks/[taskId]/exercise",
	TASKS_EDIT: "/tasks/[taskId]/exercise/edit",

	// 루틴 (Routine 엔티티)
	ROUTINES: "/routines",
	ROUTINES_NEW: "/routines/new",
	ROUTINES_DETAIL: "/routines/[routineId]",
	ROUTINES_EDIT: "/routines/[routineId]/edit",

	// 템플릿 (Template 엔티티)
	TEMPLATES: "/templates",
	TEMPLATES_NEW: "/templates/new",
	TEMPLATES_DETAIL: "/templates/[templateId]",
	TEMPLATES_EDIT: "/templates/[templateId]/edit",

	// 약관/동의 문서 (ServiceDocument 엔티티)
	TERMS: "/terms",

	// 정적 번역 (Translation 엔티티)
	TRANSLATIONS: "/translations",

	// 에셋 (Asset 엔티티)
	ASSETS: "/assets",
	ASSETS_DETAIL: "/assets/[assetId]",

	// 문의 (Inquiry 엔티티)
	INQUIRIES: "/inquiries",
	INQUIRIES_NEW: "/inquiries/new",
	INQUIRIES_DETAIL: "/inquiries/[inquiryId]",
	INQUIRIES_EDIT: "/inquiries/[inquiryId]/edit",

	// 테넌트 접근 신청
	TENANT_ACCESS_REQUESTS: "/tenant-access-requests",
	TENANT_ACCESS_REQUESTS_DETAIL:
		"/tenant-access-requests/[tenantAccessRequestId]",

	// 인증 설정
	SETTINGS_AUTH: "/settings/auth",
	SETTINGS_AUTH_ACCOUNTS: "/settings/auth/accounts",
	SETTINGS_AUTH_ACCOUNT_DETAIL: "/settings/auth/accounts/[userId]",
	SETTINGS_AUTH_OIDC_CLIENTS: "/settings/auth/oidc-clients",
	SETTINGS_AUTH_OIDC_CLIENTS_NEW: "/settings/auth/oidc-clients/new",
	SETTINGS_AUTH_OIDC_CLIENT_DETAIL:
		"/settings/auth/oidc-clients/[oidcClientId]",
	SETTINGS_AUTH_OIDC_CLIENT_EDIT:
		"/settings/auth/oidc-clients/[oidcClientId]/edit",
	SETTINGS_AUTH_OIDC_SESSIONS: "/settings/auth/oidc-sessions",
	SETTINGS_AUTH_AUDIT_LOGS: "/settings/auth/audit-logs",
	SETTINGS_AUTH_SECURITY_POLICY: "/settings/auth/security-policy",

	// 인증
	AUTH_LOGIN: "/auth/login",
} as const;

/**
 * 어드민 메뉴 Subject 상수
 *
 * Subject 네이밍 규칙:
 * - menu:{entity} - 1depth 메뉴
 * - menu:{entity}:{sub} - 2depth 메뉴
 */
export const ADMIN_SUBJECTS = {
	// 대시보드
	MENU_DASHBOARD: "menu:dashboard",

	// 1depth 메뉴
	MENU_USERS: "menu:users",
	MENU_SPACES: "menu:spaces",
	MENU_TIMELINES: "menu:timelines",
	MENU_COURSES: "menu:courses",
	MENU_PAYMENTS: "menu:payments",
	MENU_TASKS: "menu:tasks",
	MENU_ROUTINES: "menu:routines",
	MENU_TEMPLATES: "menu:templates",
	MENU_TERMS: "menu:terms",
	MENU_ASSETS: "menu:assets",
	MENU_ROLES: "menu:roles",
	MENU_INQUIRIES: "menu:inquiries",
	MENU_TENANT_ACCESS_REQUESTS: "menu:tenant-access-requests",
	MENU_TRANSLATIONS: "menu:translations",
	MENU_SETTINGS_AUTH: "menu:settings-auth",

	// 2depth - 회원
	MENU_USERS_LIST: "menu:users:list",
	MENU_USERS_EMAIL_VERIFICATIONS: "menu:users:email-verifications",

	// 2depth - 일정 관리
	MENU_TIMELINES_LIST: "menu:timelines:list",

	// 2depth - 수강 관리
	MENU_COURSES_LIST: "menu:courses:list",

	// 2depth - 결제 관리
	MENU_PAYMENTS_LIST: "menu:payments:list",

	// 2depth - 공간 관리
	MENU_SPACES_LIST: "menu:spaces:list",

	// 2depth - 태스크 관리
	MENU_TASKS_LIST: "menu:tasks:list",
	MENU_ROUTINES_LIST: "menu:routines:list",

	// 2depth - 템플릿
	MENU_TEMPLATES_LIST: "menu:templates:list",
	MENU_TERMS_LIST: "menu:terms:list",

	// 2depth - 다국어
	MENU_TRANSLATIONS_LIST: "menu:translations:list",

	// 2depth - 에셋
	MENU_ASSETS_LIST: "menu:assets:list",

	// 2depth - 권한 관리
	MENU_ROLES_LIST: "menu:roles:list",
	MENU_POLICIES: "menu:policies",
	MENU_POLICIES_LIST: "menu:policies:list",
	MENU_ABILITIES: "menu:abilities",
	MENU_ABILITIES_LIST: "menu:abilities:list",
	MENU_ACTIONS: "menu:actions",
	MENU_ACTIONS_LIST: "menu:actions:list",
	MENU_SUBJECTS: "menu:subjects",
	MENU_SUBJECTS_LIST: "menu:subjects:list",

	// 2depth - 문의 관리
	MENU_INQUIRIES_LIST: "menu:inquiries:list",

	// 2depth - 인증 설정
	MENU_SETTINGS_AUTH_DASHBOARD: "menu:settings-auth:dashboard",
	MENU_SETTINGS_AUTH_ACCOUNTS: "menu:settings-auth:accounts",
	MENU_SETTINGS_AUTH_OIDC_CLIENTS: "menu:settings-auth:oidc-clients",
	MENU_SETTINGS_AUTH_OIDC_SESSIONS: "menu:settings-auth:oidc-sessions",
	MENU_SETTINGS_AUTH_AUDIT_LOGS: "menu:settings-auth:audit-logs",
	MENU_SETTINGS_AUTH_SECURITY_POLICY: "menu:settings-auth:security-policy",
} as const;

const ADMIN_NAV_SCOPE_KIND_BY_ID: Partial<Record<string, ScreenScopeKind>> = {
	dashboard: "space",
	users: "space",
	"users-list": "space",
	"email-verifications-list": "global-full-access-only",
	spaces: "space",
	"spaces-list": "space",
	timelines: "space",
	"timelines-list": "space",
	courses: "space",
	"courses-list": "space",
	payments: "space",
	"payments-list": "space",
	tasks: "space",
	"tasks-list": "space",
	"routines-list": "space",
	templates: "global-full-access-only",
	"templates-list": "global-full-access-only",
	terms: "global-full-access-only",
	"terms-list": "global-full-access-only",
	translations: "global-full-access-only",
	"translations-list": "global-full-access-only",
	assets: "space",
	"assets-list": "space",
	inquiries: "space",
	"inquiries-list": "space",
	"roles-list": "space",
	"policies-list": "space",
	"abilities-list": "global-full-access-only",
	"actions-list": "global-full-access-only",
	"subjects-list": "global-full-access-only",
	"settings-auth": "global-full-access-only",
	"settings-auth-dashboard": "global-full-access-only",
	"settings-auth-accounts": "tenant-user",
	"settings-auth-oidc-clients": "global-full-access-only",
	"settings-auth-oidc-sessions": "global-full-access-only",
	"settings-auth-audit-logs": "tenant-user",
	"settings-auth-security-policy": "global-full-access-only",
};

function applyAdminNavScopeKinds(navItems: NavItemConfig[]): NavItemConfig[] {
	return navItems.map((navItem) => {
		const scopeKind =
			ADMIN_NAV_SCOPE_KIND_BY_ID[navItem.id] ?? navItem.scopeKind;
		const children = navItem.children
			? applyAdminNavScopeKinds(navItem.children)
			: undefined;

		return {
			...navItem,
			...(scopeKind ? { scopeKind } : {}),
			...(children ? { children } : {}),
		};
	});
}

export const ADMIN_NAV_ITEMS: NavItemConfig[] = applyAdminNavScopeKinds(
	GENERATED_ADMIN_NAV_ITEMS,
);

export interface AdminMenuPermissionLeaf {
	groupId: string;
	groupLabel: string;
	groupSubject: string;
	leafId: string;
	leafLabel: string;
	leafSubject: string;
	path?: string;
	icon?: AppIconName;
	depth: 1 | 2;
	requiredSubjects: string[];
}

/**
 * 메뉴 권한 편집기에서 사용하는 leaf-first 카탈로그
 *
 * - children이 있는 메뉴는 child를 편집 단위로 사용합니다.
 * - children이 없는 메뉴는 자기 자신을 leaf로 사용합니다.
 * - 실제 노출에는 parent subject도 필요하므로 requiredSubjects에 포함합니다.
 */
export const ADMIN_MENU_PERMISSION_LEAFS: AdminMenuPermissionLeaf[] =
	ADMIN_NAV_ITEMS.flatMap<AdminMenuPermissionLeaf>((navItem) => {
		if (navItem.children && navItem.children.length > 0) {
			return navItem.children.map<AdminMenuPermissionLeaf>((child) => ({
				groupId: navItem.id,
				groupLabel: navItem.label,
				groupSubject: navItem.subject,
				leafId: child.id,
				leafLabel: child.label,
				leafSubject: child.subject,
				depth: 2 as const,
				requiredSubjects: [navItem.subject, child.subject],
				...(child.path ? { path: child.path } : {}),
				...(navItem.icon ? { icon: navItem.icon } : {}),
			}));
		}

		return [
			{
				groupId: navItem.id,
				groupLabel: navItem.label,
				groupSubject: navItem.subject,
				leafId: navItem.id,
				leafLabel: navItem.label,
				leafSubject: navItem.subject,
				depth: 1 as const,
				requiredSubjects: [navItem.subject],
				...(navItem.path ? { path: navItem.path } : {}),
				...(navItem.icon ? { icon: navItem.icon } : {}),
			},
		];
	});

export const ADMIN_MENU_PERMISSION_SUBJECTS = Array.from(
	new Set(ADMIN_MENU_PERMISSION_LEAFS.flatMap((leaf) => leaf.requiredSubjects)),
);

/**
 * 어드민 FAB 액션 설정
 */
export const ADMIN_FAB_ACTIONS: FABAction[] = [];

/**
 * BottomTab에 표시할 메뉴 ID 목록
 *
 * 순서대로 하단 탭에 표시됩니다.
 * 마지막 "more"는 특수 처리되어 나머지 메뉴를 표시합니다.
 */
export const BOTTOM_TAB_IDS = [
	"dashboard",
	"users",
	"inquiries",
	"more",
] as const;

export type BottomTabId = (typeof BOTTOM_TAB_IDS)[number];
