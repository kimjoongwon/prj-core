import type { AdminRouteMeta } from "@cocrepo/constant";

export const routeMeta = {
	page: {
		groupId: "roles",
		groupLabel: "권한 관리",
		pageId: "abilities:detail",
		pageLabel: "권한 정의 상세",
		pathPattern: "/abilities/[abilityId]",
		description: "권한 정의 상세 정보를 확인합니다.",
		order: 52,
	},
} satisfies AdminRouteMeta;
