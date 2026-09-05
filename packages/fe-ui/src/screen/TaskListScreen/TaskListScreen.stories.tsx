import type { ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { TaskListScreen } from "./TaskListScreen";

const defaultArgs: ComponentProps<typeof TaskListScreen> = {
	isLoading: false,
	onClickCreateButton: () => undefined,
	onClickTaskName: () => undefined,
	onDeleteTask: async () => undefined,
	queryStates: { page: 1, take: 10, skip: 0, search: "", spaceScope: "CURRENT" },
	setQueryStates: async () => new URLSearchParams(),
	tasks: [
		{
			createdAt: new Date("2026-04-14T09:00:00.000Z"),
			exercise: {
				count: 12,
				description: "스토리북에서 확인할 description 예시입니다.",
				duration: 15,
				name: "스쿼트",
				videoFileId: "video-1",
			},
			id: 1n,
		},
		{
			createdAt: new Date("2026-04-14T09:00:00.000Z"),
			exercise: {
				count: 10,
				description: "영상이 없는 운동 detail 예시입니다.",
				duration: 30,
				name: "플랭크",
			},
			id: 2n,
		},
	],
	totalCount: 12,
};

const loadingArgs = {
	...defaultArgs,
	isLoading: true,
};

const emptyStateArgs = {
	...defaultArgs,
	tasks: [],
	totalCount: 0,
};

const meta = {
	title: "screen/TaskListScreen",
	component: TaskListScreen,
	// bigint 응답 fixture는 JSON 기반 Controls 편집에서 제외합니다.
	argTypes: {
		tasks: { control: false },
	},
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: defaultArgs,
} satisfies Meta<typeof TaskListScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
	args: loadingArgs,
};

export const EmptyState: Story = {
	args: emptyStateArgs,
};
