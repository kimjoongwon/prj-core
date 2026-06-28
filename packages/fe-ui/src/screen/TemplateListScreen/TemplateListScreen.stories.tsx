import type { Meta, StoryObj } from "@storybook/react";
import { TemplateListScreen } from "./TemplateListScreen";

const defaultArgs = {
	isLoading: false,
	isToggling: false,
	onClickCreateButton: (..._args: never[]) => undefined,
	onClickTemplateCode: (..._args: never[]) => undefined,
	onToggleTemplateStatusSwitch: async (..._args: never[]) => undefined,
	queryStates: { page: 1, take: 10, skip: 0, search: "" },
	setQueryStates: (..._args: never[]) => undefined,
	templates: [
		{
			code: "code-1",
			createdAt: "2026-04-14T09:00:00.000Z",
			id: "item-1",
			isActive: false,
		},
		{
			code: "code-1",
			createdAt: "2026-04-14T09:00:00.000Z",
			id: "item-1",
			isActive: false,
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
	templates: [],
	totalCount: 0,
};

const meta = {
	title: "screen/TemplateListScreen",
	component: TemplateListScreen,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: defaultArgs as never,
} satisfies Meta<typeof TemplateListScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
	args: loadingArgs as never,
};

export const EmptyState: Story = {
	args: emptyStateArgs as never,
};
