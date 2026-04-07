import type { AdminRouteMeta } from "@cocrepo/constant";

export const routeMeta = {
	page: {
		groupId: "roles",
		groupLabel: "권한 관리",
		pageId: "role-categories:new",
		pageLabel: "역할 카테고리 등록",
		pathPattern: "/roles/categories/new",
		description: "새 역할 카테고리를 등록합니다.",
		order: 47,
	},
} satisfies AdminRouteMeta;
