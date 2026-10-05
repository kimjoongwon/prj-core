import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../../input/Button/Button";
import { TimelineSessionEditScreen } from "./TimelineSessionEditScreen";

const defaultState = {
	name: "월요일 오전 요가",
	type: "RECURRING" as const,
	description: "매주 진행되는 오전 요가 세션입니다.",
	startDateTime: "",
	endDateTime: "",
	recurringDayOfWeek: "MONDAY" as const,
	repeatCycleType: "WEEKLY" as const,
	errors: {},
};

const programs = [
	{
		id: BigInt(1),
		href: "/timelines/timeline-1/sessions/session-1/programs/program-1" as const,
		name: "초급 요가 프로그램",
		routineName: "요가 루틴 A",
		activityCountLabel: "8개",
		previewText: "호흡, 스트레칭",
		instructorName: "김코치",
		isConnectionResolved: true,
		capacityLabel: "12명",
		levelLabel: "초급",
	},
];

const meta = {
	title: "screen/TimelineSessionEditScreen",
	component: TimelineSessionEditScreen,
	// bigint 응답 fixture는 JSON 기반 Controls 편집에서 제외합니다.
	argTypes: {
		programs: { control: false },
	},
	parameters: { layout: "fullscreen" },
	tags: ["autodocs"],
	args: {
		title: "세션 수정",
		description: "route가 전달한 세션 상태를 편집합니다.",
		state: defaultState,
		actions: <Button variant="primary">저장</Button>,
	},
} satisfies Meta<typeof TimelineSessionEditScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Edit: Story = {};

export const Create: Story = {
	args: {
		title: "세션 등록",
		description: "타임라인에 새 세션을 등록합니다.",
		state: {
			name: "",
			type: "ONE_TIME",
			description: "",
			startDateTime: "",
			endDateTime: "",
			recurringDayOfWeek: null,
			repeatCycleType: "",
			errors: {},
		},
	},
};

export const Detail: Story = {
	args: {
		title: "세션 상세",
		description: "봄 시즌 타임라인",
		state: defaultState,
		readOnly: true,
		metadata: {
			typeLabel: "정기반복",
			typeColor: "success",
			recurringDayLabel: "월요일",
			repeatCycleLabel: "주간",
			timelineName: "봄 시즌 타임라인",
			timelineHref: "/timelines/timeline-1",
			createdAt: new Date("2026-04-01T09:00:00.000Z"),
		},
		programs,
		totalPrograms: 1,
		resolvedPrograms: 1,
		unresolvedPrograms: 0,
		actions: <Button variant="tertiary">수정</Button>,
	},
};

export const Loading: Story = {
	args: {
		isLoading: true,
	},
};
