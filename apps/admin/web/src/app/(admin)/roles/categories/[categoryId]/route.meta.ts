import type { AdminRouteMeta } from "@cocrepo/constant";

export const routeMeta = {
	page: {
		groupId: "roles",
		groupLabel: "권한 관리",
		pageId: "role-categories:detail",
		pageLabel: "역할 카테고리 상세",
		pathPattern: "/roles/categories/[categoryId]",
		description: "역할 카테고리 상세 정보를 확인합니다.",
		order: 48,
	},
} satisfies AdminRouteMeta;
