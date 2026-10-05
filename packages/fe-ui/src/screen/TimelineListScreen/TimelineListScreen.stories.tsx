import type { ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { TimelineListScreen } from "./TimelineListScreen";

const defaultArgs: ComponentProps<typeof TimelineListScreen> = {
	isLoading: false,
	onClickCreateButton: () => undefined,
	onDeleteTimeline: async () => undefined,
	queryStates: { page: 1, take: 10, skip: 0, search: "" },
	setQueryStates: async () => new URLSearchParams(),
	timelines: [
		{
			createdAt: new Date("2026-04-14T09:00:00.000Z"),
			updatedAt: null,
			removedAt: null,
			name: "오전 그룹 수업",
			spaceId: 1n,
			sessions: [],
			description: "스토리북에서 확인할 description 예시입니다.",
			id: 1n,
		},
		{
			createdAt: new Date("2026-04-14T09:00:00.000Z"),
			updatedAt: null,
			removedAt: null,
			name: "오전 그룹 수업",
			spaceId: 1n,
			sessions: [],
			description: "스토리북에서 확인할 description 예시입니다.",
			id: 1n,
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
	timelines: [],
	totalCount: 0,
};

const meta = {
	title: "screen/TimelineListScreen",
	component: TimelineListScreen,
	// bigint 응답 fixture는 JSON 기반 Controls 편집에서 제외합니다.
	argTypes: {
		timelines: { control: false },
	},
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: defaultArgs,
} satisfies Meta<typeof TimelineListScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
	args: loadingArgs,
};

export const EmptyState: Story = {
	args: emptyStateArgs,
};
