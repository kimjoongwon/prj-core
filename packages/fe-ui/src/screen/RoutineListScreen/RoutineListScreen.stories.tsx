import type { ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { RoutineListScreen } from "./RoutineListScreen";

const defaultArgs: ComponentProps<typeof RoutineListScreen> = {
	isLoading: false,
	onClickCreateButton: () => undefined,
	onClickRoutineName: () => undefined,
	onDeleteRoutine: async () => undefined,
	queryStates: { page: 1, take: 10, skip: 0, search: "", spaceScope: "CURRENT" },
	routines: [
		{
			createdAt: new Date("2026-04-14T09:00:00.000Z"),
			id: 1n,
			updatedAt: null,
			removedAt: null,
			name: "기초 루틴",
			spaceId: 1n,
			programs: [],
			activities: [],
			label: "샘플 label 1",
		},
		{
			createdAt: new Date("2026-04-14T09:00:00.000Z"),
			id: 1n,
			updatedAt: null,
			removedAt: null,
			name: "기초 루틴",
			spaceId: 1n,
			programs: [],
			activities: [],
			label: "샘플 label 1",
		},
	],
	setQueryStates: async () => new URLSearchParams(),
	totalCount: 12,
};

const loadingArgs = {
	...defaultArgs,
	isLoading: true,
};

const emptyStateArgs = {
	...defaultArgs,
	routines: [],
	totalCount: 0,
};

const meta = {
	title: "screen/RoutineListScreen",
	component: RoutineListScreen,
	// bigint 응답 fixture는 JSON 기반 Controls 편집에서 제외합니다.
	argTypes: {
		routines: { control: false },
	},
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: defaultArgs,
} satisfies Meta<typeof RoutineListScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
	args: loadingArgs,
};

export const EmptyState: Story = {
	args: emptyStateArgs,
};
