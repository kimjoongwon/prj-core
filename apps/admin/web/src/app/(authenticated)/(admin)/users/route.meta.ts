import type { AdminRouteMeta } from "@cocrepo/constant";

export const routeMeta = {
	page: {
		groupId: "users",
		groupLabel: "회원",
		pageId: "users:list",
		pageLabel: "회원 목록",
		pathPattern: "/users",
		description: "회원 목록과 검색 결과를 확인합니다.",
		order: 2,
	},
	navItem: {
		id: "users-list",
		label: "회원 목록",
		path: "/users",
		subject: "menu:users:list",
		order: 1,
		parent: {
			id: "users",
			label: "회원",
			subject: "menu:users",
			icon: "Users",
			path: "/users",
			order: 2,
		},
	},
} satisfies AdminRouteMeta;
