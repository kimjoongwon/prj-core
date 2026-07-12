import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../../input/Button/Button";
import { TimelineSessionProgramEditScreen } from "./TimelineSessionProgramEditScreen";

const routinePreview = [
	{
		id: "activity-1",
		order: 1,
		exerciseName: "호흡",
		repetitions: 10,
		restTime: 30,
		isSchedulable: true,
	},
	{
		id: "activity-2",
		order: 2,
		exerciseName: "스트레칭",
		repetitions: 12,
		restTime: 45,
		isSchedulable: true,
	},
];

const defaultState = {
	name: "초급 요가 프로그램",
	routineId: "routine-1",
	routineName: "요가 루틴 A",
	instructorId: "user-1",
	instructorName: "김코치",
	capacity: "12",
	level: "초급",
	errors: {},
};

const meta = {
	title: "screen/TimelineSessionProgramEditScreen",
	component: TimelineSessionProgramEditScreen,
	parameters: { layout: "fullscreen" },
	tags: ["autodocs"],
	args: {
		title: "프로그램 수정",
		description: "route가 전달한 프로그램 상태를 편집합니다.",
		state: defaultState,
		routinePreview,
		actions: <Button color="primary">저장</Button>,
	},
} satisfies Meta<typeof TimelineSessionProgramEditScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Edit: Story = {};

export const Create: Story = {
	args: {
		title: "프로그램 등록",
		state: {
			name: "",
			routineId: "",
			routineName: "",
			instructorId: "",
			instructorName: "",
			capacity: "",
			level: "",
			errors: {},
		},
		routinePreview: [],
	},
};

export const Detail: Story = {
	args: {
		title: "프로그램 상세",
		state: defaultState,
		readOnly: true,
		routinePreview,
		metadata: {
			routineHref: "/routines/routine-1",
			instructorLabel: "김코치",
			activityCountLabel: "2개",
			sessionName: "월요일 오전 요가",
			sessionHref: "/timelines/timeline-1/sessions/session-1",
			createdAt: "2026-04-01T09:00:00.000Z",
		},
		actions: <Button variant="flat">수정</Button>,
	},
};

export const Loading: Story = {
	args: {
		isLoading: true,
	},
};
