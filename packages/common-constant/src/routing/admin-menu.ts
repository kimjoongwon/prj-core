import type {
	AppIconName,
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
	DASHBOARD: "/dashboard",
	USERS: "/users",
	USERS_DETAIL: "/users/[userId]",
	ROLES: "/roles",
	ROLES_NEW: "/roles/new",
	ROLES_DETAIL: "/roles/[roleId]",
	ROLES_EDIT: "/roles/[roleId]/edit",
	AUTH_LOGIN: "/auth/login",
} as const;

/** 어드민 메뉴의 접근 권한 대상입니다. */
export const ADMIN_SUBJECTS = {
	MENU_DASHBOARD: "menu:dashboard",
	MENU_USERS: "menu:users",
	MENU_USERS_LIST: "menu:users:list",
	MENU_ROLES: "menu:roles",
	MENU_ROLES_LIST: "menu:roles:list",
} as const;

const ADMIN_NAV_SCOPE_KIND_BY_ID: Partial<Record<string, ScreenScopeKind>> = {
	dashboard: "space",
	users: "space",
	"users-list": "space",
	"roles-list": "space",
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
