import type { AdminRouteMeta } from "@cocrepo/constant";

export const routeMeta = {
	page: {
		groupId: "roles",
		groupLabel: "권한 관리",
		pageId: "policies:list",
		pageLabel: "정책 목록",
		pathPattern: "/policies",
		description: "현재 Space의 권한 정책 목록을 조회합니다.",
		order: 64,
	},
	navItem: {
		id: "policies-list",
		label: "정책",
		path: "/policies",
		subject: "menu:policies:list",
		order: 7,
		parent: {
			id: "roles",
			label: "권한 관리",
			subject: "menu:roles",
			icon: "Shield",
			order: 9,
		},
	},
} satisfies AdminRouteMeta;
