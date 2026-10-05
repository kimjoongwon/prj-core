import type { AdminRouteMeta } from "@cocrepo/constant";

export const routeMeta = {
	page: {
		groupId: "inquiries",
		groupLabel: "문의 관리",
		pageId: "inquiries:edit",
		pageLabel: "문의 수정",
		pathPattern: "/inquiries/[inquiryId]/edit",
		description: "문의 정보를 수정합니다.",
		order: 37,
	},
} satisfies AdminRouteMeta;
