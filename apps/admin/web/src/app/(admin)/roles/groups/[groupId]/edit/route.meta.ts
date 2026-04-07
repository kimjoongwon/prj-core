import type { AdminRouteMeta } from "@cocrepo/constant";

export const routeMeta = {
	page: {
		groupId: "roles",
		groupLabel: "권한 관리",
		pageId: "role-groups:edit",
		pageLabel: "역할 그룹 수정",
		pathPattern: "/roles/groups/[groupId]/edit",
		description: "역할 그룹 정보를 수정합니다.",
		order: 45,
	},
} satisfies AdminRouteMeta;
