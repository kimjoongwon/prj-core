import type { PlanningApiScenario } from "@cocrepo/type";
import { HttpResponse, http } from "msw";

const userDetailDefaultHandler = http.get("/api/v1/users/:userId", () =>
	HttpResponse.json({
		data: {
			createdAt: "2026-04-14T09:00:00.000Z",
			email: "hong@example.com",
			id: "storybook-user",
			isActive: true,
			lastLoginAt: "2026-06-26T08:30:00.000Z",
			name: "홍길동",
			phone: "010-1234-5678",
			removedAt: null,
			updatedAt: "2026-06-26T08:30:00.000Z",
		},
	}),
);

export const userDetailApiScenarios = {
	default: {
		name: "사용자 상세 정상 응답",
		mode: "msw",
		requests: [
			{
				method: "GET",
				path: "/api/v1/users/:userId",
				status: 200,
				description: "사용자 기본 정보를 반환합니다.",
			},
		],
		handlers: [userDetailDefaultHandler],
	},
} satisfies Record<string, PlanningApiScenario>;
