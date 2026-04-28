import type { Meta, StoryObj } from "@storybook/react";
import { RoleCategoryListPage } from "./RoleCategoryListPage";

const defaultArgs = {
	categories: [
		{
			childrenCount: 12,
			createdAt: "2026-04-14T09:00:00.000Z",
			id: "category-1",
			name: "운영",
			parentName: "관리자",
		},
		{
			childrenCount: 4,
			createdAt: "2026-04-15T09:00:00.000Z",
			id: "category-2",
			name: "감사",
			parentName: "운영",
		},
	],
	isLoading: false,
	onClickCreateButton: (..._args: never[]) => undefined,
	onClickDetailButton: (..._args: never[]) => undefined,
};

const loadingArgs = {
	...defaultArgs,
	isLoading: true,
};

const emptyStateArgs = {
	...defaultArgs,
	categories: [],
};

const meta = {
	component: RoleCategoryListPage,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: defaultArgs as never,
} satisfies Meta<typeof RoleCategoryListPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
	args: loadingArgs as never,
};

export const EmptyState: Story = {
	args: emptyStateArgs as never,
};
