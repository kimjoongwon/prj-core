import type { AdminRouteMeta } from "@cocrepo/constant";

export const routeMeta = {
	page: {
		groupId: "templates",
		groupLabel: "템플릿",
		pageId: "templates:edit",
		pageLabel: "템플릿 수정",
		pathPattern: "/templates/[templateId]/edit",
		description: "템플릿 정보를 수정합니다.",
		order: 31,
	},
} satisfies AdminRouteMeta;
