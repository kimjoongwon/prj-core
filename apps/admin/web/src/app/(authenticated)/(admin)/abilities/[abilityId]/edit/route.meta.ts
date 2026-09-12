import type { AdminRouteMeta } from "@cocrepo/constant";

export const routeMeta = {
	page: {
		groupId: "roles",
		groupLabel: "권한 관리",
		pageId: "abilities:edit",
		pageLabel: "권한 정의 수정",
		pathPattern: "/abilities/[abilityId]/edit",
		description: "권한 정의를 수정합니다.",
		order: 53,
	},
} satisfies AdminRouteMeta;
