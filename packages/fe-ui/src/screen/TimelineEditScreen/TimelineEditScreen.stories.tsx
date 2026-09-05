import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../../input/Button/Button";
import { TimelineEditScreen } from "./TimelineEditScreen";

const defaultState = {
	name: "2026 봄 시즌",
	description: "봄 시즌 운영 타임라인입니다.",
	errors: {},
};

const sessions = [
	{
		id: BigInt(1),
		name: "오전 세션",
		typeLabel: "일회성",
		typeColor: "primary" as const,
		programCount: 2,
		isConnected: true,
		startDateTime: new Date("2026-04-14T09:00:00.000Z"),
		recurringDayLabel: "-",
		repeatCycleLabel: "-",
		createdAt: new Date("2026-04-01T09:00:00.000Z"),
	},
	{
		id: BigInt(2),
		name: "오후 세션",
		typeLabel: "정기반복",
		typeColor: "success" as const,
		programCount: 0,
		isConnected: false,
		startDateTime: null,
		recurringDayLabel: "월",
		repeatCycleLabel: "주간",
		createdAt: new Date("2026-04-02T09:00:00.000Z"),
	},
];

const meta = {
	title: "screen/TimelineEditScreen",
	component: TimelineEditScreen,
	// bigint 응답 fixture는 JSON 기반 Controls 편집에서 제외합니다.
	argTypes: {
		sessions: { control: false },
	},
	parameters: { layout: "fullscreen" },
	tags: ["autodocs"],
	args: {
		title: "타임라인 수정",
		description: "route가 전달한 상태로 타임라인을 편집합니다.",
		state: defaultState,
		actions: <Button variant="primary">저장</Button>,
	},
} satisfies Meta<typeof TimelineEditScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Edit: Story = {};

export const Create: Story = {
	args: {
		title: "타임라인 등록",
		description: "새 타임라인을 등록합니다.",
		state: {
			name: "",
			description: "",
			errors: {},
		},
	},
};

export const Detail: Story = {
	args: {
		title: "타임라인 상세",
		description: "세션 연결 상태를 함께 확인합니다.",
		state: defaultState,
		readOnly: true,
		metadata: { createdAt: new Date("2026-04-01T09:00:00.000Z") },
		sessions,
		totalSessions: 2,
		connectedSessions: 1,
		unconnectedSessions: 1,
		actions: <Button variant="tertiary">수정</Button>,
	},
};

export const Loading: Story = {
	args: {
		isLoading: true,
	},
};
