import type { AdminRouteMeta } from "@cocrepo/constant";

export const routeMeta = {
	page: {
		groupId: "roles",
		groupLabel: "권한 관리",
		pageId: "subjects:list",
		pageLabel: "대상 목록",
		pathPattern: "/subjects",
		description: "대상 목록을 조회합니다.",
		order: 58,
	},
	navItem: {
		id: "subjects-list",
		label: "대상",
		path: "/subjects",
		subject: "menu:subjects:list",
		order: 6,
		parent: {
			id: "roles",
			label: "권한 관리",
			subject: "menu:roles",
			icon: "Shield",
			order: 9,
		},
	},
} satisfies AdminRouteMeta;
