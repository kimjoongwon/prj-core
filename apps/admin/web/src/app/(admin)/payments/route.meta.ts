import type { AdminRouteMeta } from "@cocrepo/constant";

export const routeMeta = {
	page: {
		groupId: "payments",
		groupLabel: "결제 관리",
		pageId: "payments:list",
		pageLabel: "Payment",
		pathPattern: "/payments",
		description:
			"Course와 Product 등 여러 서비스의 Space-scoped 결제 원장을 관리합니다.",
		order: 76,
	},
	navItem: {
		id: "payments-list",
		label: "Payment",
		path: "/payments",
		subject: "menu:payments:list",
		order: 1,
		parent: {
			id: "payments",
			label: "결제 관리",
			subject: "menu:payments",
			icon: "CreditCard",
			order: 14,
		},
	},
} satisfies AdminRouteMeta;
