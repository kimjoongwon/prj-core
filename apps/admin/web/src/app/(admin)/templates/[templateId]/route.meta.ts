import type { AdminRouteMeta } from "@cocrepo/constant";

export const routeMeta = {
	page: {
		groupId: "templates",
		groupLabel: "템플릿",
		pageId: "templates:detail",
		pageLabel: "템플릿 상세",
		pathPattern: "/templates/[templateId]",
		description: "템플릿 상세 정보를 확인합니다.",
		order: 30,
	},
} satisfies AdminRouteMeta;
