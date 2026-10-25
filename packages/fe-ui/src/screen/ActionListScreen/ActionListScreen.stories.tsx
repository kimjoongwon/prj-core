import type { Meta, StoryObj } from "@storybook/react";
import type { ComponentProps } from "react";
import { ActionListScreen } from "./ActionListScreen";

const defaultArgs: ComponentProps<typeof ActionListScreen> = {
	actions: [
		{
			createdAt: new Date("2026-04-14T09:00:00.000Z"),
			displayName: "생성",
			group: "crud",
			id: "ACT00000000000000000000011",
			name: "create",
			order: 1,
			removedAt: null,
			updatedAt: new Date("2026-04-14T09:00:00.000Z"),
		},
		{
			createdAt: new Date("2026-04-14T09:00:00.000Z"),
			displayName: "이메일 마스킹 조회",
			group: "visibility",
			id: "ACT00000000000000000000021",
			name: "read:masked:email",
			order: 20,
			removedAt: null,
			updatedAt: new Date("2026-04-14T09:00:00.000Z"),
		},
		{
			createdAt: new Date("2026-04-14T09:00:00.000Z"),
			displayName: "내보내기",
			group: "bulk",
			id: "ACT00000000000000000000031",
			name: "export",
			order: 30,
			removedAt: null,
			updatedAt: new Date("2026-04-14T09:00:00.000Z"),
		},
		{
			createdAt: new Date("2026-04-14T09:00:00.000Z"),
			displayName: "승인",
			group: "workflow",
			id: "ACT00000000000000000000041",
			name: "approve",
			order: 40,
			removedAt: null,
			updatedAt: new Date("2026-04-14T09:00:00.000Z"),
		},
	],
	onClickActionRow: () => undefined,
	onClickCreateButton: () => undefined,
	queryStates: { page: 1, take: 10, skip: 0, search: "", group: "" },
	setQueryStates: async () => new URLSearchParams(),
};

const emptyStateArgs = {
	...defaultArgs,
	actions: [],
};

const meta = {
	title: "screen/ActionListScreen",
	component: ActionListScreen,
	// bigint 응답 fixture는 JSON 기반 Controls 편집에서 제외합니다.
	argTypes: {
		actions: { control: false },
	},
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: defaultArgs,
} satisfies Meta<typeof ActionListScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const EmptyState: Story = {
	args: emptyStateArgs,
};
