import type { AdminRouteMeta } from "@cocrepo/constant";

export const routeMeta = {
	page: {
		groupId: "roles",
		groupLabel: "권한 관리",
		pageId: "roles:ability-actions",
		pageLabel: "역할별 권한 액션 연결",
		pathPattern: "/roles/[roleId]/abilities/[abilityId]/actions",
		description: "역할에 연결된 액션 구성을 확인합니다.",
		order: 60,
	},
} satisfies AdminRouteMeta;
