import type { PlanningApiScenario } from "@cocrepo/type";
import { HttpResponse, http } from "msw";

const routines = [
	{
		id: "storybook-routine-yoga",
		name: "모닝 요가",
		label: "요가",
		activities: [],
	},
	{
		id: "storybook-routine-pilates",
		name: "리포머 필라테스",
		label: "필라테스",
		activities: [],
	},
];

const instructors = [
	{
		id: "storybook-instructor-a",
		name: "김코치",
		email: "coach@example.com",
	},
	{
		id: "storybook-instructor-b",
		name: "이코치",
		email: "lee@example.com",
	},
];

const programPickerHandlers = [
	http.get("/api/v1/routines", () => HttpResponse.json({ data: routines })),
	http.get("/api/v1/routines/:routineId", ({ params }) => {
		const routine = routines.find((item) => item.id === params.routineId);
		return routine
			? HttpResponse.json({ data: routine })
			: HttpResponse.json({ data: undefined }, { status: 404 });
	}),
	http.get("/api/v1/users", () => HttpResponse.json({ data: instructors })),
	http.get("/api/v1/users/:userId", ({ params }) => {
		const instructor = instructors.find((item) => item.id === params.userId);
		return instructor
			? HttpResponse.json({ data: instructor })
			: HttpResponse.json({ data: undefined }, { status: 404 });
	}),
];

export const programPickerApiScenarios = {
	default: {
		name: "Program 후보 정상 응답",
		mode: "msw",
		requests: [
			{
				method: "GET",
				path: "/api/v1/routines",
				status: 200,
				description: "루틴 후보를 반환합니다.",
			},
			{
				method: "GET",
				path: "/api/v1/users",
				status: 200,
				description: "강사 후보를 반환합니다.",
			},
		],
		handlers: programPickerHandlers,
	},
} satisfies Record<string, PlanningApiScenario>;
