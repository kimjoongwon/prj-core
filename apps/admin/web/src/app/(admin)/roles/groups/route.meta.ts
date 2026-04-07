import type { AdminRouteMeta } from "@cocrepo/constant";

export const routeMeta = {
	page: {
		groupId: "roles",
		groupLabel: "권한 관리",
		pageId: "role-groups:list",
		pageLabel: "역할 그룹 목록",
		pathPattern: "/roles/groups",
		description: "역할 그룹 목록을 조회합니다.",
		order: 42,
	},
	navItem: {
		id: "role-groups-list",
		label: "역할 그룹",
		path: "/roles/groups",
		subject: "menu:role-groups:list",
		order: 2,
		parent: {
			id: "roles",
			label: "권한 관리",
			subject: "menu:roles",
			icon: "Shield",
			order: 9,
		},
	},
} satisfies AdminRouteMeta;
