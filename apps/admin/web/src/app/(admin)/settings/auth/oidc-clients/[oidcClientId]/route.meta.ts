import type { AdminRouteMeta } from "@cocrepo/constant";

export const routeMeta = {
	page: {
		groupId: "settings-auth",
		groupLabel: "인증 설정",
		pageId: "settings-auth:oidc-clients:detail",
		pageLabel: "OIDC 클라이언트 상세",
		pathPattern: "/settings/auth/oidc-clients/[oidcClientId]",
		description: "OIDC 클라이언트 상세 설정을 확인합니다.",
		order: 82,
		menuLeafId: "settings-auth-oidc-clients",
	},
} satisfies AdminRouteMeta;
