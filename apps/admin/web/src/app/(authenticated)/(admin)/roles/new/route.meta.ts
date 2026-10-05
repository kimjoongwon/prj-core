import type { AdminRouteMeta } from "@cocrepo/constant";

export const routeMeta = {
	page: {
		groupId: "roles",
		groupLabel: "권한 관리",
		pageId: "roles:new",
		pageLabel: "역할 등록",
		pathPattern: "/roles/new",
		description: "새 역할을 등록합니다.",
		order: 39,
	},
} satisfies AdminRouteMeta;
