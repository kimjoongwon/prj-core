import type { AdminRouteMeta } from "@cocrepo/constant";

export const routeMeta = {
	page: {
		groupId: "users",
		groupLabel: "회원",
		pageId: "users:detail",
		pageLabel: "회원 상세",
		pathPattern: "/users/[userId]",
		description: "회원 상세 정보를 확인합니다.",
		order: 4,
	},
} satisfies AdminRouteMeta;
