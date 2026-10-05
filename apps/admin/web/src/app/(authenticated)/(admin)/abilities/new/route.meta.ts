import type { AdminRouteMeta } from "@cocrepo/constant";

export const routeMeta = {
	page: {
		groupId: "roles",
		groupLabel: "권한 관리",
		pageId: "abilities:new",
		pageLabel: "권한 정의 등록",
		pathPattern: "/abilities/new",
		description: "새 권한 정의를 등록합니다.",
		order: 51,
	},
} satisfies AdminRouteMeta;
