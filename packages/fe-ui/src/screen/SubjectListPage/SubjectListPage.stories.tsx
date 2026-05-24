import type { Meta, StoryObj } from "@storybook/react";
import { SubjectListPage } from "./SubjectListPage";

const defaultArgs = {
	isLoading: false,
	onClickSubject: (_subjectId: string) => undefined,
	queryStates: { page: 1, take: 10, skip: 0, search: "", group: "" },
	setQueryStates: (..._args: never[]) => Promise.resolve(new URLSearchParams()),
	subjects: [
		{
			createdAt: "2026-04-14T09:00:00.000Z",
			displayName: "사용자",
			group: "entity",
			id: "subject-1",
			isSystem: true,
			name: "entity:User",
			order: 1,
			removedAt: null,
			updatedAt: "2026-04-14T09:00:00.000Z",
		},
		{
			createdAt: "2026-04-14T09:00:00.000Z",
			displayName: "대시보드",
			group: "menu",
			id: "subject-2",
			isSystem: true,
			name: "menu:dashboard",
			order: 10,
			removedAt: null,
			updatedAt: "2026-04-14T09:00:00.000Z",
		},
	],
};

const loadingArgs = {
	...defaultArgs,
	isLoading: true,
};

const emptyStateArgs = {
	...defaultArgs,
	subjects: [],
};

const meta = {
	component: SubjectListPage,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: defaultArgs as never,
} satisfies Meta<typeof SubjectListPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
	args: loadingArgs as never,
};

export const EmptyState: Story = {
	args: emptyStateArgs as never,
};
