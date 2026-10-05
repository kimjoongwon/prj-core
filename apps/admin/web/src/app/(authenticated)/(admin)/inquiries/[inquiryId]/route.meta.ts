import type { AdminRouteMeta } from "@cocrepo/constant";

export const routeMeta = {
	page: {
		groupId: "inquiries",
		groupLabel: "문의 관리",
		pageId: "inquiries:detail",
		pageLabel: "문의 상세",
		pathPattern: "/inquiries/[inquiryId]",
		description: "문의 상세 내용을 확인합니다.",
		order: 36,
	},
} satisfies AdminRouteMeta;
