/**
 * 네비게이션 아이템 설정 인터페이스
 * @cocrepo/store의 NavItemConfig와 동일한 구조
 */
export interface NavItemConfig {
	id: string;
	label: string;
	path?: string;
	icon?: string;
	subject: string;
	children?: NavItemConfig[];
}

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

	// 사용자 (User 엔티티)
	USERS: "/users",
	USERS_PROFILES: "/users/profiles",
	USERS_CATEGORIES: "/users/categories",
	USERS_GROUPS: "/users/groups",

	// 일정 (Schedule 엔티티)
	SCHEDULES_TIMELINES: "/schedules/timelines",
	SCHEDULES_SESSIONS: "/schedules/sessions",
	SCHEDULES_PROGRAMS: "/schedules/programs",
	SCHEDULES_ROUTINES: "/schedules/routines",

	// 파일 (File 엔티티)
	FILES: "/files",
	FILES_CATEGORIES: "/files/categories",

	// 콘텐츠 (Content 엔티티)
	CONTENTS_POSTS: "/contents/posts",
	CONTENTS: "/contents",

	// 지갑 (Wallet 엔티티)
	WALLETS: "/wallets",
	WALLETS_TRANSACTIONS: "/wallets/transactions",

	// 설정
	SETTINGS_GROUNDS: "/settings/grounds",
	SETTINGS_ADMINS: "/settings/admins",
	SETTINGS_ABILITIES: "/settings/abilities",
	SETTINGS_SYSTEM: "/settings/system",
	SETTINGS_UI_CONFIGS: "/settings/ui-configs",

	// 기타
	SELECT_SPACE: "/select-space",
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
	MENU_SCHEDULES: "menu:schedules",
	MENU_FILES: "menu:files",
	MENU_CONTENTS: "menu:contents",
	MENU_WALLETS: "menu:wallets",
	MENU_SETTINGS: "menu:settings",

	// 2depth - 사용자
	MENU_USERS_LIST: "menu:users:list",
	MENU_USERS_PROFILES: "menu:users:profiles",
	MENU_USERS_CATEGORIES: "menu:users:categories",
	MENU_USERS_GROUPS: "menu:users:groups",

	// 2depth - 일정
	MENU_SCHEDULES_TIMELINES: "menu:schedules:timelines",
	MENU_SCHEDULES_SESSIONS: "menu:schedules:sessions",
	MENU_SCHEDULES_PROGRAMS: "menu:schedules:programs",
	MENU_SCHEDULES_ROUTINES: "menu:schedules:routines",

	// 2depth - 파일
	MENU_FILES_LIST: "menu:files:list",
	MENU_FILES_CATEGORIES: "menu:files:categories",

	// 2depth - 콘텐츠
	MENU_CONTENTS_POSTS: "menu:contents:posts",
	MENU_CONTENTS_LIST: "menu:contents:list",

	// 2depth - 지갑
	MENU_WALLETS_LIST: "menu:wallets:list",
	MENU_WALLETS_TRANSACTIONS: "menu:wallets:transactions",

	// 2depth - 설정
	MENU_SETTINGS_GROUNDS: "menu:settings:grounds",
	MENU_SETTINGS_ADMINS: "menu:settings:admins",
	MENU_SETTINGS_ABILITIES: "menu:settings:abilities",
	MENU_SETTINGS_SYSTEM: "menu:settings:system",
	MENU_SETTINGS_UI_CONFIGS: "menu:settings:ui-configs",
} as const;

/**
 * 어드민 네비게이션 아이템 설정
 *
 * 기획서: .claude/plans/2025-12-30-AdminLayoutAndMenuSystem.md (v5.0)
 */
export const ADMIN_NAV_ITEMS: NavItemConfig[] = [
	{
		id: "dashboard",
		label: "대시보드",
		icon: "LayoutDashboard",
		path: ADMIN_PATHS.DASHBOARD,
		subject: ADMIN_SUBJECTS.MENU_DASHBOARD,
	},
	{
		id: "users",
		label: "사용자",
		icon: "Users",
		subject: ADMIN_SUBJECTS.MENU_USERS,
		children: [
			{
				id: "users-list",
				label: "사용자 목록",
				path: ADMIN_PATHS.USERS,
				subject: ADMIN_SUBJECTS.MENU_USERS_LIST,
			},
			{
				id: "users-profiles",
				label: "프로필 관리",
				path: ADMIN_PATHS.USERS_PROFILES,
				subject: ADMIN_SUBJECTS.MENU_USERS_PROFILES,
			},
			{
				id: "users-categories",
				label: "분류 관리",
				path: ADMIN_PATHS.USERS_CATEGORIES,
				subject: ADMIN_SUBJECTS.MENU_USERS_CATEGORIES,
			},
			{
				id: "users-groups",
				label: "그룹 관리",
				path: ADMIN_PATHS.USERS_GROUPS,
				subject: ADMIN_SUBJECTS.MENU_USERS_GROUPS,
			},
		],
	},
	{
		id: "schedules",
		label: "일정",
		icon: "Calendar",
		subject: ADMIN_SUBJECTS.MENU_SCHEDULES,
		children: [
			{
				id: "schedules-timelines",
				label: "타임라인",
				path: ADMIN_PATHS.SCHEDULES_TIMELINES,
				subject: ADMIN_SUBJECTS.MENU_SCHEDULES_TIMELINES,
			},
			{
				id: "schedules-sessions",
				label: "세션",
				path: ADMIN_PATHS.SCHEDULES_SESSIONS,
				subject: ADMIN_SUBJECTS.MENU_SCHEDULES_SESSIONS,
			},
			{
				id: "schedules-programs",
				label: "프로그램",
				path: ADMIN_PATHS.SCHEDULES_PROGRAMS,
				subject: ADMIN_SUBJECTS.MENU_SCHEDULES_PROGRAMS,
			},
			{
				id: "schedules-routines",
				label: "루틴",
				path: ADMIN_PATHS.SCHEDULES_ROUTINES,
				subject: ADMIN_SUBJECTS.MENU_SCHEDULES_ROUTINES,
			},
		],
	},
	{
		id: "files",
		label: "파일",
		icon: "FolderOpen",
		subject: ADMIN_SUBJECTS.MENU_FILES,
		children: [
			{
				id: "files-list",
				label: "파일 목록",
				path: ADMIN_PATHS.FILES,
				subject: ADMIN_SUBJECTS.MENU_FILES_LIST,
			},
			{
				id: "files-categories",
				label: "분류 관리",
				path: ADMIN_PATHS.FILES_CATEGORIES,
				subject: ADMIN_SUBJECTS.MENU_FILES_CATEGORIES,
			},
		],
	},
	{
		id: "contents",
		label: "콘텐츠",
		icon: "FileText",
		subject: ADMIN_SUBJECTS.MENU_CONTENTS,
		children: [
			{
				id: "contents-posts",
				label: "게시물",
				path: ADMIN_PATHS.CONTENTS_POSTS,
				subject: ADMIN_SUBJECTS.MENU_CONTENTS_POSTS,
			},
			{
				id: "contents-list",
				label: "콘텐츠 목록",
				path: ADMIN_PATHS.CONTENTS,
				subject: ADMIN_SUBJECTS.MENU_CONTENTS_LIST,
			},
		],
	},
	{
		id: "wallets",
		label: "지갑",
		icon: "Wallet",
		subject: ADMIN_SUBJECTS.MENU_WALLETS,
		children: [
			{
				id: "wallets-list",
				label: "지갑 목록",
				path: ADMIN_PATHS.WALLETS,
				subject: ADMIN_SUBJECTS.MENU_WALLETS_LIST,
			},
			{
				id: "wallets-transactions",
				label: "트랜잭션",
				path: ADMIN_PATHS.WALLETS_TRANSACTIONS,
				subject: ADMIN_SUBJECTS.MENU_WALLETS_TRANSACTIONS,
			},
		],
	},
	{
		id: "settings",
		label: "설정",
		icon: "Settings",
		subject: ADMIN_SUBJECTS.MENU_SETTINGS,
		children: [
			{
				id: "settings-grounds",
				label: "시설 정보",
				path: ADMIN_PATHS.SETTINGS_GROUNDS,
				subject: ADMIN_SUBJECTS.MENU_SETTINGS_GROUNDS,
			},
			{
				id: "settings-admins",
				label: "관리자 관리",
				path: ADMIN_PATHS.SETTINGS_ADMINS,
				subject: ADMIN_SUBJECTS.MENU_SETTINGS_ADMINS,
			},
			{
				id: "settings-abilities",
				label: "권한 관리",
				path: ADMIN_PATHS.SETTINGS_ABILITIES,
				subject: ADMIN_SUBJECTS.MENU_SETTINGS_ABILITIES,
			},
			{
				id: "settings-system",
				label: "시스템 설정",
				path: ADMIN_PATHS.SETTINGS_SYSTEM,
				subject: ADMIN_SUBJECTS.MENU_SETTINGS_SYSTEM,
			},
			{
				id: "settings-ui-configs",
				label: "UI 설정",
				path: ADMIN_PATHS.SETTINGS_UI_CONFIGS,
				subject: ADMIN_SUBJECTS.MENU_SETTINGS_UI_CONFIGS,
			},
		],
	},
];

/**
 * @deprecated ADMIN_NAV_ITEMS를 사용하세요
 */
export const ADMIN_MENUS = ADMIN_NAV_ITEMS;

/**
 * @deprecated 이 인터페이스는 @cocrepo/store의 NavItemConfig를 사용하세요
 */
export interface Menu {
	id: string;
	label: string;
	path?: string;
	icon?: string;
	subject: string;
	children?: Menu[];
}
