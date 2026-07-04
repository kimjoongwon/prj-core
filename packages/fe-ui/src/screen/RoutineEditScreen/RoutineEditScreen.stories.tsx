import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../../input/Button/Button";
import { RoutineEditScreen } from "./RoutineEditScreen";

const activities = [
	{
		taskId: "task-push-up",
		exerciseName: "푸시업",
		isSchedulable: true,
		repetitions: "12",
		restTime: "30",
		notes: "상체 워밍업",
	},
	{
		taskId: "task-squat",
		exerciseName: "스쿼트",
		isSchedulable: true,
		repetitions: "15",
		restTime: "45",
		notes: "",
	},
];

const candidateTasks = [
	{
		id: "task-lunge",
		exerciseName: "런지",
		exerciseCount: 10,
		isSchedulable: true,
	},
	{
		id: "task-plank",
		exerciseName: "플랭크",
		exerciseCount: 1,
		isSchedulable: true,
	},
];

const defaultState = {
	name: "풀바디 루틴 A",
	label: "FULL-A",
	exerciseQuery: "",
	activities,
	errors: {},
};

const meta = {
	title: "screen/RoutineEditScreen",
	component: RoutineEditScreen,
	parameters: { layout: "fullscreen" },
	tags: ["autodocs"],
	args: {
		title: "루틴 수정",
		description: "route가 전달한 루틴 상태를 편집합니다.",
		state: defaultState,
		candidateTasks,
		activities,
		actions: <Button color="primary">저장</Button>,
	},
} satisfies Meta<typeof RoutineEditScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Edit: Story = {};

export const Create: Story = {
	args: {
		title: "루틴 등록",
		description: "새로운 운동 루틴을 등록합니다.",
		state: {
			name: "",
			label: "",
			exerciseQuery: "",
			activities: [],
			errors: {},
		},
	},
};

export const Detail: Story = {
	args: {
		title: "루틴 상세",
		description: "루틴의 상세 정보입니다.",
		state: defaultState,
		activities,
		readOnly: true,
		programs: [{ id: "program-1", name: "월요일 프로그램" }],
		metadata: {
			createdAt: "2026-04-01T09:00:00.000Z",
			updatedAt: "2026-04-03T09:00:00.000Z",
		},
		actions: <Button variant="flat">수정</Button>,
	},
};

export const Loading: Story = {
	args: {
		isLoading: true,
	},
};
