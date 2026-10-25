import type { Meta, StoryObj } from "@storybook/react";
import type { ComponentProps } from "react";
import { SubjectListScreen } from "./SubjectListScreen";

const defaultArgs: ComponentProps<typeof SubjectListScreen> = {
	onClickSubject: () => undefined,
	queryStates: { page: 1, take: 10, skip: 0, search: "", group: "" },
	setQueryStates: () => Promise.resolve(new URLSearchParams()),
	subjects: [
		{
			createdAt: new Date("2026-04-14T09:00:00.000Z"),
			displayName: "사용자",
			group: "entity",
			id: "01J00000000000000000000001",
			name: "entity:User",
			order: 1,
			removedAt: null,
			updatedAt: new Date("2026-04-14T09:00:00.000Z"),
		},
		{
			createdAt: new Date("2026-04-14T09:00:00.000Z"),
			displayName: "대시보드",
			group: "menu",
			id: "01J00000000000000000000002",
			name: "menu:dashboard",
			order: 10,
			removedAt: null,
			updatedAt: new Date("2026-04-14T09:00:00.000Z"),
		},
	],
};

const emptyStateArgs = {
	...defaultArgs,
	subjects: [],
};

const meta = {
	title: "screen/SubjectListScreen",
	component: SubjectListScreen,
	// bigint 응답 fixture는 JSON 기반 Controls 편집에서 제외합니다.
	argTypes: {
		subjects: { control: false },
	},
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: defaultArgs,
} satisfies Meta<typeof SubjectListScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const EmptyState: Story = {
	args: emptyStateArgs,
};
