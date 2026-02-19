import type { FABAction, NavItemConfig } from "@cocrepo/type";

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

	// 역할 관리
	ROLES: "/roles",
	ROLES_NEW: "/roles/new",
	ROLES_DETAIL: "/roles/[roleId]",
	ROLES_EDIT: "/roles/[roleId]/edit",

	// 역할 그룹 (Group)
	ROLE_GROUPS: "/roles/groups",
	ROLE_GROUPS_NEW: "/roles/groups/new",
	ROLE_GROUPS_DETAIL: "/roles/groups/[groupId]",
	ROLE_GROUPS_EDIT: "/roles/groups/[groupId]/edit",

	// 역할 카테고리 (Category)
	ROLE_CATEGORIES: "/roles/categories",
	ROLE_CATEGORIES_NEW: "/roles/categories/new",
	ROLE_CATEGORIES_DETAIL: "/roles/categories/[categoryId]",
	ROLE_CATEGORIES_EDIT: "/roles/categories/[categoryId]/edit",

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

	// 내 계정 (Self-Service)
	MY_SESSIONS: "/my-sessions",
	MY_ACCOUNT_CHANGE_PASSWORD: "/my-account/change-password",

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
	MENU_ROUTINES: "menu:routines",
	MENU_TEMPLATES: "menu:templates",
	MENU_ROLES: "menu:roles",

	// 2depth - 회원
	MENU_USERS_LIST: "menu:users:list",

	// 2depth - 운동 관리
	MENU_ROUTINES_LIST: "menu:routines:list",

	// 2depth - 템플릿
	MENU_TEMPLATES_LIST: "menu:templates:list",

	// 2depth - 권한 관리
	MENU_ROLES_LIST: "menu:roles:list",
	MENU_ROLE_GROUPS: "menu:role-groups",
	MENU_ROLE_GROUPS_LIST: "menu:role-groups:list",
	MENU_ROLE_CATEGORIES: "menu:role-categories",
	MENU_ROLE_CATEGORIES_LIST: "menu:role-categories:list",
	MENU_ABILITIES: "menu:abilities",
	MENU_ABILITIES_LIST: "menu:abilities:list",
	MENU_ACTIONS: "menu:actions",
	MENU_ACTIONS_LIST: "menu:actions:list",
	MENU_SUBJECTS: "menu:subjects",
	MENU_SUBJECTS_LIST: "menu:subjects:list",

	// 내 계정 (Self-Service)
	MENU_MY_ACCOUNT: "menu:my-account",
	MENU_MY_ACCOUNT_SESSIONS: "menu:my-account:sessions",
	MENU_MY_ACCOUNT_CHANGE_PASSWORD: "menu:my-account:change-password",
} as const;

/**
 * 어드민 네비게이션 아이템 설정
 */
export const ADMIN_NAV_ITEMS: NavItemConfig[] = [
	// 1. 대시보드
	{
		id: "dashboard",
		label: "대시보드",
		icon: "LayoutDashboard",
		path: ADMIN_PATHS.DASHBOARD,
		subject: ADMIN_SUBJECTS.MENU_DASHBOARD,
	},

	// 2. 회원
	{
		id: "users",
		label: "회원",
		icon: "Users",
		path: ADMIN_PATHS.USERS,
		subject: ADMIN_SUBJECTS.MENU_USERS,
		children: [
			{
				id: "users-list",
				label: "회원 목록",
				path: ADMIN_PATHS.USERS,
				subject: ADMIN_SUBJECTS.MENU_USERS_LIST,
			},
		],
	},

	// 3. 운동 관리
	{
		id: "routines",
		label: "운동 관리",
		icon: "Dumbbell",
		subject: ADMIN_SUBJECTS.MENU_ROUTINES,
		children: [
			{
				id: "routines-list",
				label: "루틴",
				path: ADMIN_PATHS.ROUTINES,
				subject: ADMIN_SUBJECTS.MENU_ROUTINES_LIST,
			},
		],
	},

	// 4. 템플릿
	{
		id: "templates",
		label: "템플릿",
		icon: "Mail",
		subject: ADMIN_SUBJECTS.MENU_TEMPLATES,
		children: [
			{
				id: "templates-list",
				label: "템플릿 목록",
				path: ADMIN_PATHS.TEMPLATES,
				subject: ADMIN_SUBJECTS.MENU_TEMPLATES_LIST,
			},
		],
	},

	// 5. 권한 관리
	{
		id: "roles",
		label: "권한 관리",
		icon: "Shield",
		subject: ADMIN_SUBJECTS.MENU_ROLES,
		children: [
			{
				id: "roles-list",
				label: "역할",
				path: ADMIN_PATHS.ROLES,
				subject: ADMIN_SUBJECTS.MENU_ROLES_LIST,
			},
			{
				id: "role-groups-list",
				label: "역할 그룹",
				path: ADMIN_PATHS.ROLE_GROUPS,
				subject: ADMIN_SUBJECTS.MENU_ROLE_GROUPS_LIST,
			},
			{
				id: "role-categories-list",
				label: "역할 카테고리",
				path: ADMIN_PATHS.ROLE_CATEGORIES,
				subject: ADMIN_SUBJECTS.MENU_ROLE_CATEGORIES_LIST,
			},
			{
				id: "abilities-list",
				label: "권한 정의",
				path: ADMIN_PATHS.ABILITIES,
				subject: ADMIN_SUBJECTS.MENU_ABILITIES_LIST,
			},
			{
				id: "actions-list",
				label: "액션",
				path: ADMIN_PATHS.ACTIONS,
				subject: ADMIN_SUBJECTS.MENU_ACTIONS_LIST,
			},
			{
				id: "subjects-list",
				label: "대상",
				path: ADMIN_PATHS.SUBJECTS,
				subject: ADMIN_SUBJECTS.MENU_SUBJECTS_LIST,
			},
		],
	},

	// 6. 내 계정
	{
		id: "my-account",
		label: "내 계정",
		icon: "UserCircle",
		subject: ADMIN_SUBJECTS.MENU_MY_ACCOUNT,
		children: [
			{
				id: "my-account-sessions",
				label: "세션 관리",
				path: ADMIN_PATHS.MY_SESSIONS,
				subject: ADMIN_SUBJECTS.MENU_MY_ACCOUNT_SESSIONS,
			},
			{
				id: "my-account-change-password",
				label: "비밀번호 변경",
				path: ADMIN_PATHS.MY_ACCOUNT_CHANGE_PASSWORD,
				subject: ADMIN_SUBJECTS.MENU_MY_ACCOUNT_CHANGE_PASSWORD,
			},
		],
	},
];

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
export const BOTTOM_TAB_IDS = ["dashboard", "users", "more"] as const;

export type BottomTabId = (typeof BOTTOM_TAB_IDS)[number];
