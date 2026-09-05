import type { ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { SubjectDetailScreen } from "./SubjectDetailScreen";

const defaultArgs: ComponentProps<typeof SubjectDetailScreen> = {
	isFieldsLoading: false,
	isLoading: false,
	onClickBackButton: () => undefined,
	subject: {
		name: "User",
		createdAt: new Date("2026-04-14T09:00:00.000Z"),
		displayName: "샘플 display name 1",
		group: "샘플 group 1",
		icon: "icon-1",
		order: 1,
		updatedAt: new Date("2026-04-14T09:00:00.000Z"),
	},
	subjectFields: [
		{
			name: "email",
			displayName: "샘플 display name 1",
			isRelation: false,
			isRequired: false,
			type: "샘플 type 1",
		},
		{
			name: "email",
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
	title: "screen/SubjectDetailScreen",
	component: SubjectDetailScreen,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: defaultArgs,
} satisfies Meta<typeof SubjectDetailScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
	args: loadingArgs,
};

export const EmptyState: Story = {
	args: emptyStateArgs,
};
