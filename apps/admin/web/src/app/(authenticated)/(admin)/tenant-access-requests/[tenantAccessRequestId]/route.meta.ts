import type { AdminRouteMeta } from "@cocrepo/constant";

export const routeMeta = {
	page: {
		groupId: "tenant-access-requests",
		groupLabel: "접근 승인",
		pageId: "tenant-access-requests:detail",
		pageLabel: "접근 신청 상세",
		pathPattern: "/tenant-access-requests/[tenantAccessRequestId]",
		description: "테넌트 접근 신청 상세를 확인하고 승인 또는 반려합니다.",
		order: 63,
	},
} satisfies AdminRouteMeta;
