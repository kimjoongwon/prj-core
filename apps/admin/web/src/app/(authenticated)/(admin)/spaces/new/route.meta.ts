import type { AdminRouteMeta } from "@cocrepo/constant";

export const routeMeta = {
	page: {
		groupId: "spaces",
		groupLabel: "공간 관리",
		pageId: "spaces:new",
		pageLabel: "공간 등록",
		pathPattern: "/spaces/new",
		description: "새 공간을 등록합니다.",
		order: 7,
	},
} satisfies AdminRouteMeta;
