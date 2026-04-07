import type { AdminRouteMeta } from "@cocrepo/constant";

export const routeMeta = {
	page: {
		groupId: "roles",
		groupLabel: "권한 관리",
		pageId: "role-categories:edit",
		pageLabel: "역할 카테고리 수정",
		pathPattern: "/roles/categories/[categoryId]/edit",
		description: "역할 카테고리 정보를 수정합니다.",
		order: 49,
	},
} satisfies AdminRouteMeta;
