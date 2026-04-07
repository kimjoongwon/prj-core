import type { AdminRouteMeta } from "@cocrepo/constant";

export const routeMeta = {
	page: {
		groupId: "roles",
		groupLabel: "권한 관리",
		pageId: "roles:detail",
		pageLabel: "역할 상세",
		pathPattern: "/roles/[roleId]",
		description: "역할 상세 정보를 확인합니다.",
		order: 40,
	},
} satisfies AdminRouteMeta;
