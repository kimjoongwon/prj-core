import type { AdminRouteMeta } from "@cocrepo/constant";

export const routeMeta = {
	page: {
		groupId: "assets",
		groupLabel: "에셋",
		pageId: "assets:detail",
		pageLabel: "에셋 상세",
		pathPattern: "/assets/[assetId]",
		description: "에셋 상세 정보를 확인합니다.",
		order: 33,
	},
} satisfies AdminRouteMeta;
