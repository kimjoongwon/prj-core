import type { Meta, StoryObj } from "@storybook/react";
import { RoutineListPage } from "./RoutineListPage";

const defaultArgs = {
	isDeleting: false,
	isLoading: false,
	onClickCreateButton: (..._args: never[]) => undefined,
	onClickRoutineName: (..._args: never[]) => undefined,
	onDeleteRoutine: async (..._args: never[]) => undefined,
	queryStates: { page: 1, take: 10, skip: 0, search: "" },
	routines: [
		{
			createdAt: "2026-04-14T09:00:00.000Z",
			id: "item-1",
			label: "샘플 label 1",
		},
		{
			createdAt: "2026-04-14T09:00:00.000Z",
			id: "item-1",
			label: "샘플 label 1",
		},
	],
	setQueryStates: (..._args: never[]) => undefined,
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
	routines: [],
	totalCount: 0,
};

const meta = {
	component: RoutineListPage,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: defaultArgs as never,
} satisfies Meta<typeof RoutineListPage>;

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
