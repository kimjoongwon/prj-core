import type { AdminRouteMeta } from "@cocrepo/constant";

export const routeMeta = {
	page: {
		groupId: "spaces",
		groupLabel: "공간 관리",
		pageId: "spaces:detail",
		pageLabel: "공간 상세",
		pathPattern: "/spaces/[spaceId]/ground",
		description: "선택한 공간의 상세 정보를 확인합니다.",
		order: 8,
	},
} satisfies AdminRouteMeta;
