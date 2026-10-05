import type { AdminRouteMeta } from "@cocrepo/constant";

export const routeMeta = {
	page: {
		groupId: "roles",
		groupLabel: "권한 관리",
		pageId: "policies:new",
		pageLabel: "정책 등록",
		pathPattern: "/policies/new",
		description: "현재 Space에 새 권한 정책을 등록합니다.",
		order: 65,
	},
} satisfies AdminRouteMeta;
