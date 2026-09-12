import type { AdminRouteMeta } from "@cocrepo/constant";

export const routeMeta = {
	page: {
		groupId: "spaces",
		groupLabel: "공간 관리",
		pageId: "spaces:edit",
		pageLabel: "공간 수정",
		pathPattern: "/spaces/[spaceId]/fitness-center/edit",
		description: "선택한 피트니스센터 정보를 수정합니다.",
		order: 9,
	},
} satisfies AdminRouteMeta;
