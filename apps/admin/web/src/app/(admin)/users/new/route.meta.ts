import type { AdminRouteMeta } from "@cocrepo/constant";

export const routeMeta = {
	page: {
		groupId: "users",
		groupLabel: "회원",
		pageId: "users:new",
		pageLabel: "회원 등록",
		pathPattern: "/users/new",
		description: "새 회원 정보를 등록합니다.",
		order: 3,
	},
} satisfies AdminRouteMeta;
