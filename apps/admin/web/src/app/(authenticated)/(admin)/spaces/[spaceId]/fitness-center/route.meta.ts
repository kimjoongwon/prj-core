import type { AdminRouteMeta } from "@cocrepo/constant";

export const routeMeta = {
	page: {
		groupId: "spaces",
		groupLabel: "공간 관리",
		pageId: "spaces:detail",
		pageLabel: "공간 상세",
		pathPattern: "/spaces/[spaceId]/fitness-center",
		description: "선택한 공간의 피트니스센터 상세 정보를 확인합니다.",
		order: 8,
	},
} satisfies AdminRouteMeta;
