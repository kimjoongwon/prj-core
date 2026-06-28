import type { Meta, StoryObj } from "@storybook/react";
import { ActionListScreen } from "./ActionListScreen";

const defaultArgs = {
	actions: [
		{
			createdAt: "2026-04-14T09:00:00.000Z",
			displayName: "생성",
			group: "crud",
			id: "action-create",
			isSystem: true,
			name: "create",
			order: 1,
			removedAt: null,
			updatedAt: "2026-04-14T09:00:00.000Z",
		},
		{
			createdAt: "2026-04-14T09:00:00.000Z",
			displayName: "이메일 마스킹 조회",
			group: "visibility",
			id: "action-read-masked-email",
			isSystem: true,
			name: "read:masked:email",
			order: 20,
			removedAt: null,
			updatedAt: "2026-04-14T09:00:00.000Z",
		},
		{
			createdAt: "2026-04-14T09:00:00.000Z",
			displayName: "내보내기",
			group: "bulk",
			id: "action-export",
			isSystem: true,
			name: "export",
			order: 30,
			removedAt: null,
			updatedAt: "2026-04-14T09:00:00.000Z",
		},
		{
			createdAt: "2026-04-14T09:00:00.000Z",
			displayName: "승인",
			group: "workflow",
			id: "action-approve",
			isSystem: true,
			name: "approve",
			order: 40,
			removedAt: null,
			updatedAt: "2026-04-14T09:00:00.000Z",
		},
	],
	isLoading: false,
	onClickActionRow: (..._args: never[]) => undefined,
	onClickCreateButton: (..._args: never[]) => undefined,
	queryStates: { page: 1, take: 10, skip: 0, search: "", group: "" },
	setQueryStates: (..._args: never[]) => undefined,
};

const loadingArgs = {
	...defaultArgs,
	isLoading: true,
};

const emptyStateArgs = {
	...defaultArgs,
	actions: [],
};

const meta = {
	title: "screen/ActionListScreen",
	component: ActionListScreen,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: defaultArgs as never,
} satisfies Meta<typeof ActionListScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
	args: loadingArgs as never,
};

export const EmptyState: Story = {
	args: emptyStateArgs as never,
};
