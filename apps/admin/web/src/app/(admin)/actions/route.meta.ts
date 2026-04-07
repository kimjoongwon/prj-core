import type { AdminRouteMeta } from "@cocrepo/constant";

export const routeMeta = {
	page: {
		groupId: "roles",
		groupLabel: "권한 관리",
		pageId: "actions:list",
		pageLabel: "액션 목록",
		pathPattern: "/actions",
		description: "액션 목록을 조회합니다.",
		order: 54,
	},
	navItem: {
		id: "actions-list",
		label: "액션",
		path: "/actions",
		subject: "menu:actions:list",
		order: 5,
		parent: {
			id: "roles",
			label: "권한 관리",
			subject: "menu:roles",
			icon: "Shield",
			order: 9,
		},
	},
} satisfies AdminRouteMeta;
