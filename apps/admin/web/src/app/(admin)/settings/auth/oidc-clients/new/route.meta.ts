import type { AdminRouteMeta } from "@cocrepo/constant";

export const routeMeta = {
	page: {
		groupId: "settings-auth",
		groupLabel: "인증 설정",
		pageId: "settings-auth:oidc-clients:new",
		pageLabel: "OIDC 클라이언트 등록",
		pathPattern: "/settings/auth/oidc-clients/new",
		description: "새 OIDC 클라이언트를 등록합니다.",
		order: 81,
		menuLeafId: "settings-auth-oidc-clients",
	},
} satisfies AdminRouteMeta;
