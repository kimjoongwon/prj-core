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

	// 타임라인 (Timeline 엔티티)
	TIMELINES: "/timelines",
	TIMELINES_NEW: "/timelines/new",
	TIMELINES_DETAIL: "/timelines/[timelineId]",
	TIMELINES_EDIT: "/timelines/[timelineId]/edit",

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

	// 에셋 (Asset 엔티티)
	ASSETS: "/assets",
	ASSETS_DETAIL: "/assets/[assetId]",

	// 문의 (Inquiry 엔티티)
	INQUIRIES: "/inquiries",
	INQUIRIES_NEW: "/inquiries/new",
	INQUIRIES_DETAIL: "/inquiries/[inquiryId]",
	INQUIRIES_EDIT: "/inquiries/[inquiryId]/edit",

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
	MENU_TASKS: "menu:tasks",
	MENU_ROUTINES: "menu:routines",
	MENU_TEMPLATES: "menu:templates",
	MENU_ASSETS: "menu:assets",
	MENU_ROLES: "menu:roles",
	MENU_INQUIRIES: "menu:inquiries",

	// 2depth - 회원
	MENU_USERS_LIST: "menu:users:list",

	// 2depth - 일정 관리
	MENU_TIMELINES_LIST: "menu:timelines:list",

		// 2depth - 공간 관리
		MENU_SPACES_LIST: "menu:spaces:list",

		// 2depth - 태스크 관리
		MENU_TASKS_LIST: "menu:tasks:list",
	MENU_ROUTINES_LIST: "menu:routines:list",

	// 2depth - 템플릿
	MENU_TEMPLATES_LIST: "menu:templates:list",

	// 2depth - 에셋
	MENU_ASSETS_LIST: "menu:assets:list",

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

	// 2depth - 문의 관리
	MENU_INQUIRIES_LIST: "menu:inquiries:list",
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

	// 3. 공간 관리
	{
		id: "spaces",
		label: "공간 관리",
		icon: "Building2",
		subject: ADMIN_SUBJECTS.MENU_SPACES,
		children: [
			{
				id: "spaces-list",
				label: "공간 목록",
				path: ADMIN_PATHS.SPACES,
				subject: ADMIN_SUBJECTS.MENU_SPACES_LIST,
			},
		],
	},

	// 4. 일정 관리
	{
		id: "timelines",
		label: "일정 관리",
		icon: "CalendarDays",
		subject: ADMIN_SUBJECTS.MENU_TIMELINES,
		children: [
			{
				id: "timelines-list",
				label: "타임라인",
				path: ADMIN_PATHS.TIMELINES,
				subject: ADMIN_SUBJECTS.MENU_TIMELINES_LIST,
			},
		],
	},

	// 5. 태스크 관리
	{
		id: "tasks",
		label: "태스크 관리",
		icon: "Dumbbell",
		subject: ADMIN_SUBJECTS.MENU_TASKS,
		children: [
			{
				id: "tasks-list",
				label: "태스크 목록",
				path: ADMIN_PATHS.TASKS,
				subject: ADMIN_SUBJECTS.MENU_TASKS_LIST,
			},
			{
				id: "routines-list",
				label: "루틴",
				path: ADMIN_PATHS.ROUTINES,
				subject: ADMIN_SUBJECTS.MENU_ROUTINES_LIST,
			},
		],
	},

	// 6. 템플릿
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

	// 7. 에셋
	{
		id: "assets",
		label: "에셋",
		icon: "Images",
		path: ADMIN_PATHS.ASSETS,
		subject: ADMIN_SUBJECTS.MENU_ASSETS,
		children: [
			{
				id: "assets-list",
				label: "에셋 목록",
				path: ADMIN_PATHS.ASSETS,
				subject: ADMIN_SUBJECTS.MENU_ASSETS_LIST,
			},
		],
	},

	// 8. 문의 관리
	{
		id: "inquiries",
		label: "문의 관리",
		icon: "MessageCircleQuestionMark",
		path: ADMIN_PATHS.INQUIRIES,
		subject: ADMIN_SUBJECTS.MENU_INQUIRIES,
		children: [
			{
				id: "inquiries-list",
				label: "문의 목록",
				path: ADMIN_PATHS.INQUIRIES,
				subject: ADMIN_SUBJECTS.MENU_INQUIRIES_LIST,
			},
		],
	},

	// 9. 권한 관리
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
export const BOTTOM_TAB_IDS = ["dashboard", "users", "inquiries", "more"] as const;

export type BottomTabId = (typeof BOTTOM_TAB_IDS)[number];
