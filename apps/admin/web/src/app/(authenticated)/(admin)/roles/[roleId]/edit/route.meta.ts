import type { AdminRouteMeta } from "@cocrepo/constant";

export const routeMeta = {
	page: {
		groupId: "roles",
		groupLabel: "권한 관리",
		pageId: "roles:edit",
		pageLabel: "역할 수정",
		pathPattern: "/roles/[roleId]/edit",
		description: "역할 정보를 수정합니다.",
		order: 41,
	},
} satisfies AdminRouteMeta;
