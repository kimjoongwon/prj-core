import type { Meta, StoryObj } from "@storybook/react";
import { TaskListScreen } from "./TaskListScreen";

const defaultArgs = {
	isDeleting: false,
	isLoading: false,
	onClickCreateButton: (..._args: never[]) => undefined,
	onClickTaskName: (..._args: never[]) => undefined,
	onDeleteTask: async (..._args: never[]) => undefined,
	queryStates: { page: 1, take: 10, skip: 0, search: "" },
	setQueryStates: (..._args: never[]) => undefined,
	tasks: [
		{
			activities: [],
			createdAt: "2026-04-14T09:00:00.000Z",
			exercise: {
				count: 12,
				createdAt: "2026-04-14T09:00:00.000Z",
				description: "스토리북에서 확인할 description 예시입니다.",
				duration: 15,
				id: "exercise-1",
				name: "스쿼트",
				removedAt: null,
				taskId: "item-1",
				updatedAt: "2026-04-14T09:00:00.000Z",
				videoFileId: "video-1",
			},
			id: "item-1",
			removedAt: null,
			spaceId: "space-1",
			tenantId: "tenant-1",
			updatedAt: "2026-04-14T09:00:00.000Z",
		},
		{
			activities: [],
			createdAt: "2026-04-14T09:00:00.000Z",
			exercise: {
				count: 10,
				createdAt: "2026-04-14T09:00:00.000Z",
				description: "영상이 없는 운동 detail 예시입니다.",
				duration: 30,
				id: "exercise-2",
				name: "플랭크",
				removedAt: null,
				taskId: "item-2",
				updatedAt: "2026-04-14T09:00:00.000Z",
			},
			id: "item-2",
			removedAt: null,
			spaceId: "space-1",
			tenantId: "tenant-1",
			updatedAt: "2026-04-14T09:00:00.000Z",
		},
	],
	totalCount: 12,
};

const loadingArgs = {
	...defaultArgs,
	isLoading: true,
};

const busyArgs = {
	...defaultArgs,
	isDeleting: true,
};

const emptyStateArgs = {
	...defaultArgs,
	tasks: [],
	totalCount: 0,
};

const meta = {
	component: TaskListScreen,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: defaultArgs as never,
} satisfies Meta<typeof TaskListScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
	args: loadingArgs as never,
};

export const Busy: Story = {
	args: busyArgs as never,
};

export const EmptyState: Story = {
	args: emptyStateArgs as never,
};
