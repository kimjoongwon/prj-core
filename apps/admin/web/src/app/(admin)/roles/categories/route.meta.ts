import type { AdminRouteMeta } from "@cocrepo/constant";

export const routeMeta = {
	page: {
		groupId: "roles",
		groupLabel: "권한 관리",
		pageId: "role-categories:list",
		pageLabel: "역할 카테고리 목록",
		pathPattern: "/roles/categories",
		description: "역할 카테고리 목록을 조회합니다.",
		order: 46,
	},
	navItem: {
		id: "role-categories-list",
		label: "역할 카테고리",
		path: "/roles/categories",
		subject: "menu:role-categories:list",
		order: 3,
		parent: {
			id: "roles",
			label: "권한 관리",
			subject: "menu:roles",
			icon: "Shield",
			order: 9,
		},
	},
} satisfies AdminRouteMeta;
