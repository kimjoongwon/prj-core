import type { AdminRouteMeta } from "@cocrepo/constant";

export const routeMeta = {
	page: {
		groupId: "roles",
		groupLabel: "권한 관리",
		pageId: "abilities:list",
		pageLabel: "권한 정의 목록",
		pathPattern: "/abilities",
		description: "권한 정의 목록을 조회합니다.",
		order: 50,
	},
	navItem: {
		id: "abilities-list",
		label: "권한 정의",
		path: "/abilities",
		subject: "menu:abilities:list",
		order: 4,
		parent: {
			id: "roles",
			label: "권한 관리",
			subject: "menu:roles",
			icon: "Shield",
			order: 9,
		},
	},
} satisfies AdminRouteMeta;
