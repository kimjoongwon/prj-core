import type { AdminRouteMeta } from "@cocrepo/constant";

export const routeMeta = {
	page: {
		groupId: "inquiries",
		groupLabel: "문의 관리",
		pageId: "inquiries:new",
		pageLabel: "문의 등록",
		pathPattern: "/inquiries/new",
		description: "새 문의를 등록합니다.",
		order: 35,
	},
} satisfies AdminRouteMeta;
