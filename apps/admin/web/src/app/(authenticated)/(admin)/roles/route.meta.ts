import type { AdminRouteMeta } from "@cocrepo/constant";

export const routeMeta = {
	page: {
		groupId: "roles",
		groupLabel: "권한 관리",
		pageId: "roles:list",
		pageLabel: "역할 목록",
		pathPattern: "/roles",
		description: "역할 목록을 조회합니다.",
		order: 38,
	},
	navItem: {
		id: "roles-list",
		label: "역할",
		path: "/roles",
		subject: "menu:roles:list",
		order: 1,
		parent: {
			id: "roles",
			label: "권한 관리",
			subject: "menu:roles",
			icon: "Shield",
			order: 9,
		},
	},
} satisfies AdminRouteMeta;
