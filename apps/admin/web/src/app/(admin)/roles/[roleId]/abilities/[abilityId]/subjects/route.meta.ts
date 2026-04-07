import type { AdminRouteMeta } from "@cocrepo/constant";

export const routeMeta = {
	page: {
		groupId: "roles",
		groupLabel: "권한 관리",
		pageId: "roles:ability-subjects",
		pageLabel: "역할별 권한 대상 연결",
		pathPattern: "/roles/[roleId]/abilities/[abilityId]/subjects",
		description: "역할에 연결된 대상 구성을 확인합니다.",
		order: 61,
	},
} satisfies AdminRouteMeta;
