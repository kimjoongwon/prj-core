import type { Meta, StoryObj } from "@storybook/react";
import { SubjectDetailPage } from "./SubjectDetailPage";

const defaultArgs = {
	isFieldsLoading: false,
	isLoading: false,
	onClickBackButton: (..._args: never[]) => undefined,
	subject: {
		createdAt: "2026-04-14T09:00:00.000Z",
		displayName: "샘플 display name 1",
		group: "샘플 group 1",
		icon: "icon-1",
		isSystem: false,
		order: 1,
		updatedAt: "2026-04-14T09:00:00.000Z",
	},
	subjectFields: [
		{
			displayName: "샘플 display name 1",
			isRelation: false,
			isRequired: false,
			type: "샘플 type 1",
		},
		{
			displayName: "샘플 display name 1",
			isRelation: false,
			isRequired: false,
			type: "샘플 type 1",
		},
	],
};

const loadingArgs = {
	...defaultArgs,
	isLoading: true,
};

const emptyStateArgs = {
	...defaultArgs,
	subjectFields: [],
};

const meta = {
	component: SubjectDetailPage,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: defaultArgs as never,
} satisfies Meta<typeof SubjectDetailPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
	args: loadingArgs as never,
};

export const EmptyState: Story = {
	args: emptyStateArgs as never,
};
