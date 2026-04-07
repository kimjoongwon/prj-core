import type { AdminRouteMeta } from "@cocrepo/constant";

export const routeMeta = {
	page: {
		groupId: "roles",
		groupLabel: "권한 관리",
		pageId: "role-groups:detail",
		pageLabel: "역할 그룹 상세",
		pathPattern: "/roles/groups/[groupId]",
		description: "역할 그룹 상세 정보를 확인합니다.",
		order: 44,
	},
} satisfies AdminRouteMeta;
