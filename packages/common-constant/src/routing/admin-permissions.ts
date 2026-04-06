import { ADMIN_PATHS, ADMIN_MENU_PERMISSION_LEAFS } from "./admin-menu";

export interface AdminPageAccessItem {
	groupId: string;
	groupLabel: string;
	pageId: string;
	pageLabel: string;
	pathPattern: string;
	subject: string;
	description?: string;
	menuLeafId?: string;
}

export interface AdminCrudBundle {
	bundleId: string;
	groupLabel: string;
	bundleLabel: string;
	subject: string;
	description?: string;
	actions: readonly ["create", "read", "update", "delete", "manage"];
}

const CRUD_ACTIONS = ["create", "read", "update", "delete", "manage"] as const;

function createPageAccessItem(
	item: Omit<AdminPageAccessItem, "subject"> & { subject?: string },
): AdminPageAccessItem {
	return {
		...item,
		subject: item.subject ?? `page:${item.pageId}`,
	};
}

export const ADMIN_PAGE_ACCESS_ITEMS: AdminPageAccessItem[] = [
	createPageAccessItem({
		groupId: "dashboard",
		groupLabel: "대시보드",
		pageId: "dashboard",
		pageLabel: "대시보드",
		pathPattern: ADMIN_PATHS.DASHBOARD,
		description: "운영 지표와 최근 상태를 확인하는 첫 화면입니다.",
	}),
	createPageAccessItem({
		groupId: "users",
		groupLabel: "회원",
		pageId: "users:list",
		pageLabel: "회원 목록",
		pathPattern: ADMIN_PATHS.USERS,
		description: "회원 목록과 검색 결과를 확인합니다.",
		menuLeafId: "users-list",
	}),
	createPageAccessItem({
		groupId: "users",
		groupLabel: "회원",
		pageId: "users:new",
		pageLabel: "회원 등록",
		pathPattern: "/users/new",
		description: "새 회원 정보를 등록합니다.",
	}),
	createPageAccessItem({
		groupId: "users",
		groupLabel: "회원",
		pageId: "users:detail",
		pageLabel: "회원 상세",
		pathPattern: ADMIN_PATHS.USERS_DETAIL,
		description: "회원 상세 정보를 확인합니다.",
	}),
	createPageAccessItem({
		groupId: "users",
		groupLabel: "회원",
		pageId: "users:edit",
		pageLabel: "회원 수정",
		pathPattern: "/users/[userId]/edit",
		description: "회원 정보를 수정합니다.",
	}),
	createPageAccessItem({
		groupId: "spaces",
		groupLabel: "공간 관리",
		pageId: "spaces:list",
		pageLabel: "공간 목록",
		pathPattern: ADMIN_PATHS.SPACES,
		description: "공간과 연결된 ground 목록을 관리합니다.",
		menuLeafId: "spaces-list",
	}),
	createPageAccessItem({
		groupId: "spaces",
		groupLabel: "공간 관리",
		pageId: "spaces:new",
		pageLabel: "공간 등록",
		pathPattern: ADMIN_PATHS.SPACES_NEW,
		description: "새 공간을 등록합니다.",
	}),
	createPageAccessItem({
		groupId: "spaces",
		groupLabel: "공간 관리",
		pageId: "spaces:detail",
		pageLabel: "공간 상세",
		pathPattern: ADMIN_PATHS.SPACES_DETAIL,
		description: "선택한 공간의 상세 정보를 확인합니다.",
	}),
	createPageAccessItem({
		groupId: "spaces",
		groupLabel: "공간 관리",
		pageId: "spaces:edit",
		pageLabel: "공간 수정",
		pathPattern: ADMIN_PATHS.SPACES_EDIT,
		description: "선택한 공간의 정보를 수정합니다.",
	}),
	createPageAccessItem({
		groupId: "timelines",
		groupLabel: "일정 관리",
		pageId: "timelines:list",
		pageLabel: "타임라인 목록",
		pathPattern: ADMIN_PATHS.TIMELINES,
		description: "타임라인 목록을 조회합니다.",
		menuLeafId: "timelines-list",
	}),
	createPageAccessItem({
		groupId: "timelines",
		groupLabel: "일정 관리",
		pageId: "timelines:new",
		pageLabel: "타임라인 등록",
		pathPattern: ADMIN_PATHS.TIMELINES_NEW,
		description: "새 타임라인을 등록합니다.",
	}),
	createPageAccessItem({
		groupId: "timelines",
		groupLabel: "일정 관리",
		pageId: "timelines:detail",
		pageLabel: "타임라인 상세",
		pathPattern: ADMIN_PATHS.TIMELINES_DETAIL,
		description: "타임라인 상세 정보를 확인합니다.",
	}),
	createPageAccessItem({
		groupId: "timelines",
		groupLabel: "일정 관리",
		pageId: "timelines:edit",
		pageLabel: "타임라인 수정",
		pathPattern: ADMIN_PATHS.TIMELINES_EDIT,
		description: "타임라인 정보를 수정합니다.",
	}),
	createPageAccessItem({
		groupId: "timelines",
		groupLabel: "일정 관리",
		pageId: "sessions:new",
		pageLabel: "세션 등록",
		pathPattern: ADMIN_PATHS.TIMELINE_SESSIONS_NEW,
		description: "타임라인에 새 세션을 추가합니다.",
	}),
	createPageAccessItem({
		groupId: "timelines",
		groupLabel: "일정 관리",
		pageId: "sessions:detail",
		pageLabel: "세션 상세",
		pathPattern: ADMIN_PATHS.TIMELINE_SESSIONS_DETAIL,
		description: "세션 상세 정보를 확인합니다.",
	}),
	createPageAccessItem({
		groupId: "timelines",
		groupLabel: "일정 관리",
		pageId: "sessions:edit",
		pageLabel: "세션 수정",
		pathPattern: ADMIN_PATHS.TIMELINE_SESSIONS_EDIT,
		description: "세션 정보를 수정합니다.",
	}),
	createPageAccessItem({
		groupId: "timelines",
		groupLabel: "일정 관리",
		pageId: "programs:new",
		pageLabel: "프로그램 등록",
		pathPattern:
			"/timelines/[timelineId]/sessions/[sessionId]/programs/new",
		description: "세션에 새 프로그램을 추가합니다.",
	}),
	createPageAccessItem({
		groupId: "timelines",
		groupLabel: "일정 관리",
		pageId: "programs:detail",
		pageLabel: "프로그램 상세",
		pathPattern:
			"/timelines/[timelineId]/sessions/[sessionId]/programs/[programId]",
		description: "프로그램 상세 정보를 확인합니다.",
	}),
	createPageAccessItem({
		groupId: "timelines",
		groupLabel: "일정 관리",
		pageId: "programs:edit",
		pageLabel: "프로그램 수정",
		pathPattern:
			"/timelines/[timelineId]/sessions/[sessionId]/programs/[programId]/edit",
		description: "프로그램 정보를 수정합니다.",
	}),
	createPageAccessItem({
		groupId: "tasks",
		groupLabel: "태스크 관리",
		pageId: "tasks:list",
		pageLabel: "태스크 목록",
		pathPattern: ADMIN_PATHS.TASKS,
		description: "태스크 목록을 조회합니다.",
		menuLeafId: "tasks-list",
	}),
	createPageAccessItem({
		groupId: "tasks",
		groupLabel: "태스크 관리",
		pageId: "tasks:new",
		pageLabel: "태스크 등록",
		pathPattern: ADMIN_PATHS.TASKS_NEW,
		description: "새 태스크를 등록합니다.",
	}),
	createPageAccessItem({
		groupId: "tasks",
		groupLabel: "태스크 관리",
		pageId: "tasks:detail",
		pageLabel: "태스크 상세",
		pathPattern: ADMIN_PATHS.TASKS_DETAIL,
		description: "태스크 상세 정보를 확인합니다.",
	}),
	createPageAccessItem({
		groupId: "tasks",
		groupLabel: "태스크 관리",
		pageId: "tasks:edit",
		pageLabel: "태스크 수정",
		pathPattern: ADMIN_PATHS.TASKS_EDIT,
		description: "태스크 정보를 수정합니다.",
	}),
	createPageAccessItem({
		groupId: "routines",
		groupLabel: "루틴",
		pageId: "routines:list",
		pageLabel: "루틴 목록",
		pathPattern: ADMIN_PATHS.ROUTINES,
		description: "루틴 목록을 조회합니다.",
		menuLeafId: "routines-list",
	}),
	createPageAccessItem({
		groupId: "routines",
		groupLabel: "루틴",
		pageId: "routines:new",
		pageLabel: "루틴 등록",
		pathPattern: ADMIN_PATHS.ROUTINES_NEW,
		description: "새 루틴을 등록합니다.",
	}),
	createPageAccessItem({
		groupId: "routines",
		groupLabel: "루틴",
		pageId: "routines:detail",
		pageLabel: "루틴 상세",
		pathPattern: ADMIN_PATHS.ROUTINES_DETAIL,
		description: "루틴 상세 정보를 확인합니다.",
	}),
	createPageAccessItem({
		groupId: "routines",
		groupLabel: "루틴",
		pageId: "routines:edit",
		pageLabel: "루틴 수정",
		pathPattern: ADMIN_PATHS.ROUTINES_EDIT,
		description: "루틴 정보를 수정합니다.",
	}),
	createPageAccessItem({
		groupId: "templates",
		groupLabel: "템플릿",
		pageId: "templates:list",
		pageLabel: "템플릿 목록",
		pathPattern: ADMIN_PATHS.TEMPLATES,
		description: "템플릿 목록을 조회합니다.",
		menuLeafId: "templates-list",
	}),
	createPageAccessItem({
		groupId: "templates",
		groupLabel: "템플릿",
		pageId: "templates:new",
		pageLabel: "템플릿 등록",
		pathPattern: ADMIN_PATHS.TEMPLATES_NEW,
		description: "새 템플릿을 등록합니다.",
	}),
	createPageAccessItem({
		groupId: "templates",
		groupLabel: "템플릿",
		pageId: "templates:detail",
		pageLabel: "템플릿 상세",
		pathPattern: ADMIN_PATHS.TEMPLATES_DETAIL,
		description: "템플릿 상세 정보를 확인합니다.",
	}),
	createPageAccessItem({
		groupId: "templates",
		groupLabel: "템플릿",
		pageId: "templates:edit",
		pageLabel: "템플릿 수정",
		pathPattern: ADMIN_PATHS.TEMPLATES_EDIT,
		description: "템플릿 정보를 수정합니다.",
	}),
	createPageAccessItem({
		groupId: "assets",
		groupLabel: "에셋",
		pageId: "assets:list",
		pageLabel: "에셋 목록",
		pathPattern: ADMIN_PATHS.ASSETS,
		description: "에셋 목록을 조회합니다.",
		menuLeafId: "assets-list",
	}),
	createPageAccessItem({
		groupId: "assets",
		groupLabel: "에셋",
		pageId: "assets:detail",
		pageLabel: "에셋 상세",
		pathPattern: ADMIN_PATHS.ASSETS_DETAIL,
		description: "에셋 상세 정보를 확인합니다.",
	}),
	createPageAccessItem({
		groupId: "inquiries",
		groupLabel: "문의 관리",
		pageId: "inquiries:list",
		pageLabel: "문의 목록",
		pathPattern: ADMIN_PATHS.INQUIRIES,
		description: "문의 목록을 조회합니다.",
		menuLeafId: "inquiries-list",
	}),
	createPageAccessItem({
		groupId: "inquiries",
		groupLabel: "문의 관리",
		pageId: "inquiries:new",
		pageLabel: "문의 등록",
		pathPattern: ADMIN_PATHS.INQUIRIES_NEW,
		description: "새 문의를 등록합니다.",
	}),
	createPageAccessItem({
		groupId: "inquiries",
		groupLabel: "문의 관리",
		pageId: "inquiries:detail",
		pageLabel: "문의 상세",
		pathPattern: ADMIN_PATHS.INQUIRIES_DETAIL,
		description: "문의 상세 내용을 확인합니다.",
	}),
	createPageAccessItem({
		groupId: "inquiries",
		groupLabel: "문의 관리",
		pageId: "inquiries:edit",
		pageLabel: "문의 수정",
		pathPattern: ADMIN_PATHS.INQUIRIES_EDIT,
		description: "문의 정보를 수정합니다.",
	}),
	createPageAccessItem({
		groupId: "roles",
		groupLabel: "권한 관리",
		pageId: "roles:list",
		pageLabel: "역할 목록",
		pathPattern: ADMIN_PATHS.ROLES,
		description: "역할 목록을 조회합니다.",
		menuLeafId: "roles-list",
	}),
	createPageAccessItem({
		groupId: "roles",
		groupLabel: "권한 관리",
		pageId: "roles:new",
		pageLabel: "역할 등록",
		pathPattern: ADMIN_PATHS.ROLES_NEW,
		description: "새 역할을 등록합니다.",
	}),
	createPageAccessItem({
		groupId: "roles",
		groupLabel: "권한 관리",
		pageId: "roles:detail",
		pageLabel: "역할 상세",
		pathPattern: ADMIN_PATHS.ROLES_DETAIL,
		description: "역할 상세 정보를 확인합니다.",
	}),
	createPageAccessItem({
		groupId: "roles",
		groupLabel: "권한 관리",
		pageId: "roles:edit",
		pageLabel: "역할 수정",
		pathPattern: ADMIN_PATHS.ROLES_EDIT,
		description: "역할 정보를 수정합니다.",
	}),
	createPageAccessItem({
		groupId: "roles",
		groupLabel: "권한 관리",
		pageId: "role-groups:list",
		pageLabel: "역할 그룹 목록",
		pathPattern: ADMIN_PATHS.ROLE_GROUPS,
		description: "역할 그룹 목록을 조회합니다.",
		menuLeafId: "role-groups-list",
	}),
	createPageAccessItem({
		groupId: "roles",
		groupLabel: "권한 관리",
		pageId: "role-groups:new",
		pageLabel: "역할 그룹 등록",
		pathPattern: ADMIN_PATHS.ROLE_GROUPS_NEW,
		description: "새 역할 그룹을 등록합니다.",
	}),
	createPageAccessItem({
		groupId: "roles",
		groupLabel: "권한 관리",
		pageId: "role-groups:detail",
		pageLabel: "역할 그룹 상세",
		pathPattern: ADMIN_PATHS.ROLE_GROUPS_DETAIL,
		description: "역할 그룹 상세 정보를 확인합니다.",
	}),
	createPageAccessItem({
		groupId: "roles",
		groupLabel: "권한 관리",
		pageId: "role-groups:edit",
		pageLabel: "역할 그룹 수정",
		pathPattern: ADMIN_PATHS.ROLE_GROUPS_EDIT,
		description: "역할 그룹 정보를 수정합니다.",
	}),
	createPageAccessItem({
		groupId: "roles",
		groupLabel: "권한 관리",
		pageId: "role-categories:list",
		pageLabel: "역할 카테고리 목록",
		pathPattern: ADMIN_PATHS.ROLE_CATEGORIES,
		description: "역할 카테고리 목록을 조회합니다.",
		menuLeafId: "role-categories-list",
	}),
	createPageAccessItem({
		groupId: "roles",
		groupLabel: "권한 관리",
		pageId: "role-categories:new",
		pageLabel: "역할 카테고리 등록",
		pathPattern: ADMIN_PATHS.ROLE_CATEGORIES_NEW,
		description: "새 역할 카테고리를 등록합니다.",
	}),
	createPageAccessItem({
		groupId: "roles",
		groupLabel: "권한 관리",
		pageId: "role-categories:detail",
		pageLabel: "역할 카테고리 상세",
		pathPattern: ADMIN_PATHS.ROLE_CATEGORIES_DETAIL,
		description: "역할 카테고리 상세 정보를 확인합니다.",
	}),
	createPageAccessItem({
		groupId: "roles",
		groupLabel: "권한 관리",
		pageId: "role-categories:edit",
		pageLabel: "역할 카테고리 수정",
		pathPattern: ADMIN_PATHS.ROLE_CATEGORIES_EDIT,
		description: "역할 카테고리 정보를 수정합니다.",
	}),
	createPageAccessItem({
		groupId: "roles",
		groupLabel: "권한 관리",
		pageId: "abilities:list",
		pageLabel: "권한 정의 목록",
		pathPattern: ADMIN_PATHS.ABILITIES,
		description: "권한 정의 목록을 조회합니다.",
		menuLeafId: "abilities-list",
	}),
	createPageAccessItem({
		groupId: "roles",
		groupLabel: "권한 관리",
		pageId: "abilities:new",
		pageLabel: "권한 정의 등록",
		pathPattern: ADMIN_PATHS.ABILITIES_NEW,
		description: "새 권한 정의를 등록합니다.",
	}),
	createPageAccessItem({
		groupId: "roles",
		groupLabel: "권한 관리",
		pageId: "abilities:detail",
		pageLabel: "권한 정의 상세",
		pathPattern: ADMIN_PATHS.ABILITIES_DETAIL,
		description: "권한 정의 상세 정보를 확인합니다.",
	}),
	createPageAccessItem({
		groupId: "roles",
		groupLabel: "권한 관리",
		pageId: "abilities:edit",
		pageLabel: "권한 정의 수정",
		pathPattern: ADMIN_PATHS.ABILITIES_EDIT,
		description: "권한 정의를 수정합니다.",
	}),
	createPageAccessItem({
		groupId: "roles",
		groupLabel: "권한 관리",
		pageId: "actions:list",
		pageLabel: "액션 목록",
		pathPattern: ADMIN_PATHS.ACTIONS,
		description: "액션 목록을 조회합니다.",
		menuLeafId: "actions-list",
	}),
	createPageAccessItem({
		groupId: "roles",
		groupLabel: "권한 관리",
		pageId: "actions:new",
		pageLabel: "액션 등록",
		pathPattern: ADMIN_PATHS.ACTIONS_NEW,
		description: "새 액션을 등록합니다.",
	}),
	createPageAccessItem({
		groupId: "roles",
		groupLabel: "권한 관리",
		pageId: "actions:detail",
		pageLabel: "액션 상세",
		pathPattern: ADMIN_PATHS.ACTIONS_DETAIL,
		description: "액션 상세 정보를 확인합니다.",
	}),
	createPageAccessItem({
		groupId: "roles",
		groupLabel: "권한 관리",
		pageId: "actions:edit",
		pageLabel: "액션 수정",
		pathPattern: ADMIN_PATHS.ACTIONS_EDIT,
		description: "액션 정보를 수정합니다.",
	}),
	createPageAccessItem({
		groupId: "roles",
		groupLabel: "권한 관리",
		pageId: "subjects:list",
		pageLabel: "대상 목록",
		pathPattern: ADMIN_PATHS.SUBJECTS,
		description: "대상 목록을 조회합니다.",
		menuLeafId: "subjects-list",
	}),
	createPageAccessItem({
		groupId: "roles",
		groupLabel: "권한 관리",
		pageId: "subjects:detail",
		pageLabel: "대상 상세",
		pathPattern: ADMIN_PATHS.SUBJECTS_DETAIL,
		description: "대상 상세 정보를 확인합니다.",
	}),
	createPageAccessItem({
		groupId: "roles",
		groupLabel: "권한 관리",
		pageId: "roles:ability-actions",
		pageLabel: "역할별 권한 액션 연결",
		pathPattern: "/roles/[roleId]/abilities/[abilityId]/actions",
		description: "역할에 연결된 액션 구성을 확인합니다.",
	}),
	createPageAccessItem({
		groupId: "roles",
		groupLabel: "권한 관리",
		pageId: "roles:ability-subjects",
		pageLabel: "역할별 권한 대상 연결",
		pathPattern: "/roles/[roleId]/abilities/[abilityId]/subjects",
		description: "역할에 연결된 대상 구성을 확인합니다.",
	}),
];

export const ADMIN_PAGE_ACCESS_SUBJECTS = ADMIN_PAGE_ACCESS_ITEMS.map(
	(item) => item.subject,
);

export const ADMIN_CRUD_BUNDLES: AdminCrudBundle[] = [
	{
		bundleId: "user",
		groupLabel: "회원",
		bundleLabel: "회원 데이터",
		subject: "entity:User",
		description: "회원 생성, 조회, 수정, 삭제, 전체 관리 권한을 묶어 편집합니다.",
		actions: CRUD_ACTIONS,
	},
	{
		bundleId: "space",
		groupLabel: "공간 관리",
		bundleLabel: "공간 데이터",
		subject: "entity:Space",
		description: "공간 엔티티에 대한 기본 CRUD 권한을 관리합니다.",
		actions: CRUD_ACTIONS,
	},
	{
		bundleId: "ground",
		groupLabel: "공간 관리",
		bundleLabel: "Ground 데이터",
		subject: "entity:Ground",
		description: "공간 상세(Ground) 데이터를 관리합니다.",
		actions: CRUD_ACTIONS,
	},
	{
		bundleId: "reservation",
		groupLabel: "일정 관리",
		bundleLabel: "예약 데이터",
		subject: "entity:Reservation",
		description: "예약 엔티티에 대한 기본 CRUD 권한을 묶어 편집합니다.",
		actions: CRUD_ACTIONS,
	},
	{
		bundleId: "content",
		groupLabel: "콘텐츠",
		bundleLabel: "콘텐츠 데이터",
		subject: "entity:Content",
		description: "콘텐츠 엔티티에 대한 기본 CRUD 권한을 묶어 편집합니다.",
		actions: CRUD_ACTIONS,
	},
	{
		bundleId: "role",
		groupLabel: "권한 관리",
		bundleLabel: "역할 데이터",
		subject: "entity:Role",
		description: "역할 엔티티에 대한 기본 CRUD 권한을 묶어 편집합니다.",
		actions: CRUD_ACTIONS,
	},
	{
		bundleId: "ability",
		groupLabel: "권한 관리",
		bundleLabel: "권한 데이터",
		subject: "entity:Ability",
		description: "권한 엔티티에 대한 기본 CRUD 권한을 묶어 편집합니다.",
		actions: CRUD_ACTIONS,
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

const PAGE_ACCESS_MATCHERS = [...ADMIN_PAGE_ACCESS_ITEMS]
	.sort((left, right) => {
		const leftDynamicCount = (left.pathPattern.match(/\[[^/]+\]/g) ?? []).length;
		const rightDynamicCount =
			(right.pathPattern.match(/\[[^/]+\]/g) ?? []).length;

		if (leftDynamicCount !== rightDynamicCount) {
			return leftDynamicCount - rightDynamicCount;
		}

		return right.pathPattern.length - left.pathPattern.length;
	})
	.map((item) => ({
		item,
		regExp: pathPatternToRegExp(item.pathPattern),
	}));

export function matchAdminPageAccessItem(pathname: string) {
	return PAGE_ACCESS_MATCHERS.find((entry) => entry.regExp.test(pathname))?.item;
}

export const ADMIN_MENU_PERMISSION_GROUPS = Array.from(
	new Map(
		ADMIN_MENU_PERMISSION_LEAFS.map((leaf) => [
			leaf.groupId,
			{
				groupId: leaf.groupId,
				groupLabel: leaf.groupLabel,
				groupSubject: leaf.groupSubject,
			},
		]),
	).values(),
);
