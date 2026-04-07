import type { AdminRouteMeta } from "@cocrepo/constant";

export const routeMeta = {
	page: {
		groupId: "spaces",
		groupLabel: "공간 관리",
		pageId: "spaces:list",
		pageLabel: "공간 목록",
		pathPattern: "/spaces",
		description: "공간과 연결된 ground 목록을 관리합니다.",
		order: 6,
	},
	navItem: {
		id: "spaces-list",
		label: "공간 목록",
		path: "/spaces",
		subject: "menu:spaces:list",
		order: 1,
		parent: {
			id: "spaces",
			label: "공간 관리",
			subject: "menu:spaces",
			icon: "Building2",
			order: 3,
		},
	},
} satisfies AdminRouteMeta;
