import type { AdminRouteMeta } from "@cocrepo/constant";

export const routeMeta = {
	page: {
		groupId: "roles",
		groupLabel: "권한 관리",
		pageId: "role-groups:new",
		pageLabel: "역할 그룹 등록",
		pathPattern: "/roles/groups/new",
		description: "새 역할 그룹을 등록합니다.",
		order: 43,
	},
} satisfies AdminRouteMeta;
