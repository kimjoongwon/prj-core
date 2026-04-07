import type { AdminRouteMeta } from "@cocrepo/constant";

export const routeMeta = {
	page: {
		groupId: "users",
		groupLabel: "회원",
		pageId: "users:edit",
		pageLabel: "회원 수정",
		pathPattern: "/users/[userId]/edit",
		description: "회원 정보를 수정합니다.",
		order: 5,
	},
} satisfies AdminRouteMeta;
