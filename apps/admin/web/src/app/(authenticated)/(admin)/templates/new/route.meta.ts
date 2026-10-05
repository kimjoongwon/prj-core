import type { AdminRouteMeta } from "@cocrepo/constant";

export const routeMeta = {
	page: {
		groupId: "templates",
		groupLabel: "템플릿",
		pageId: "templates:new",
		pageLabel: "템플릿 등록",
		pathPattern: "/templates/new",
		description: "새 템플릿을 등록합니다.",
		order: 29,
	},
} satisfies AdminRouteMeta;
