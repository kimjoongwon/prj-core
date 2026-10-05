import type { AdminRouteMeta } from "@cocrepo/constant";

export const routeMeta = {
	page: {
		groupId: "templates",
		groupLabel: "템플릿",
		pageId: "templates:list",
		pageLabel: "템플릿 목록",
		pathPattern: "/templates",
		description: "템플릿 목록을 조회합니다.",
		order: 28,
	},
	navItem: {
		id: "templates-list",
		label: "템플릿 목록",
		path: "/templates",
		subject: "menu:templates:list",
		order: 1,
		parent: {
			id: "templates",
			label: "템플릿",
			subject: "menu:templates",
			icon: "Mail",
			order: 6,
		},
	},
} satisfies AdminRouteMeta;
