import type { AdminRouteMeta } from "@cocrepo/constant";

export const routeMeta = {
	page: {
		groupId: "assets",
		groupLabel: "에셋",
		pageId: "assets:list",
		pageLabel: "에셋 목록",
		pathPattern: "/assets",
		description: "에셋 목록을 조회합니다.",
		order: 32,
	},
	navItem: {
		id: "assets-list",
		label: "에셋 목록",
		path: "/assets",
		subject: "menu:assets:list",
		order: 1,
		parent: {
			id: "assets",
			label: "에셋",
			subject: "menu:assets",
			icon: "Images",
			path: "/assets",
			order: 7,
		},
	},
} satisfies AdminRouteMeta;
