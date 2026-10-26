import type { NavItemConfig } from "@cocrepo/type";
import type { GeneratedAdminPageAccessItem } from "../admin-route-meta";

export const GENERATED_ADMIN_ROUTE_META_SOURCES: string[] = [
	"apps/admin/web/src/app/(authenticated)/(admin)/dashboard/route.meta.ts",
	"apps/admin/web/src/app/(authenticated)/(admin)/roles/[roleId]/edit/route.meta.ts",
	"apps/admin/web/src/app/(authenticated)/(admin)/roles/[roleId]/route.meta.ts",
	"apps/admin/web/src/app/(authenticated)/(admin)/roles/new/route.meta.ts",
	"apps/admin/web/src/app/(authenticated)/(admin)/roles/route.meta.ts",
	"apps/admin/web/src/app/(authenticated)/(admin)/users/[userId]/route.meta.ts",
	"apps/admin/web/src/app/(authenticated)/(admin)/users/route.meta.ts"
];

export const GENERATED_ADMIN_NAV_ITEMS: NavItemConfig[] = [
	{
		"id": "dashboard",
		"label": "대시보드",
		"path": "/dashboard",
		"icon": "LayoutDashboard",
		"subject": "menu:dashboard"
	},
	{
		"id": "users",
		"label": "회원",
		"icon": "Users",
		"path": "/users",
		"subject": "menu:users",
		"children": [
			{
				"id": "users-list",
				"label": "회원 목록",
				"path": "/users",
				"subject": "menu:users:list"
			}
		]
	},
	{
		"id": "roles",
		"label": "권한 관리",
		"icon": "Shield",
		"subject": "menu:roles",
		"children": [
			{
				"id": "roles-list",
				"label": "역할",
				"path": "/roles",
				"subject": "menu:roles:list"
			}
		]
	}
];

export const GENERATED_ADMIN_PAGE_ACCESS_ITEMS: GeneratedAdminPageAccessItem[] = [
	{
		"groupId": "dashboard",
		"groupLabel": "대시보드",
		"pageId": "dashboard",
		"pageLabel": "대시보드",
		"pathPattern": "/dashboard",
		"subject": "page:dashboard",
		"description": "운영 지표와 최근 상태를 확인하는 첫 화면입니다."
	},
	{
		"groupId": "users",
		"groupLabel": "회원",
		"pageId": "users:list",
		"pageLabel": "회원 목록",
		"pathPattern": "/users",
		"subject": "page:users:list",
		"description": "회원 목록과 검색 결과를 확인합니다.",
		"menuLeafId": "users-list"
	},
	{
		"groupId": "users",
		"groupLabel": "회원",
		"pageId": "users:detail",
		"pageLabel": "회원 상세",
		"pathPattern": "/users/[userId]",
		"subject": "page:users:detail",
		"description": "회원 상세 정보를 확인합니다."
	},
	{
		"groupId": "roles",
		"groupLabel": "권한 관리",
		"pageId": "roles:list",
		"pageLabel": "역할 목록",
		"pathPattern": "/roles",
		"subject": "page:roles:list",
		"description": "역할 목록을 조회합니다.",
		"menuLeafId": "roles-list"
	},
	{
		"groupId": "roles",
		"groupLabel": "권한 관리",
		"pageId": "roles:new",
		"pageLabel": "역할 등록",
		"pathPattern": "/roles/new",
		"subject": "page:roles:new",
		"description": "새 역할을 등록합니다."
	},
	{
		"groupId": "roles",
		"groupLabel": "권한 관리",
		"pageId": "roles:detail",
		"pageLabel": "역할 상세",
		"pathPattern": "/roles/[roleId]",
		"subject": "page:roles:detail",
		"description": "역할 상세 정보를 확인합니다."
	},
	{
		"groupId": "roles",
		"groupLabel": "권한 관리",
		"pageId": "roles:edit",
		"pageLabel": "역할 수정",
		"pathPattern": "/roles/[roleId]/edit",
		"subject": "page:roles:edit",
		"description": "역할 정보를 수정합니다."
	}
];
