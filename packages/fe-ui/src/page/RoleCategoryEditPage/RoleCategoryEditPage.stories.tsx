import type { Meta, StoryObj } from "@storybook/react";
import { RoleCategoryEditPage } from "./RoleCategoryEditPage";

const defaultArgs = {
	categoryName: "샘플 category name 1",
	isLoading: false,
	isNotFound: false,
	isSubmitting: false,
	nameError: "샘플 name error 1",
	name: "PLATFORM",
	onChangeNameInput: (..._args: never[]) => undefined,
	onChangeParentSelection: (..._args: never[]) => undefined,
	onClickBackButton: (..._args: never[]) => undefined,
	onClickListButton: (..._args: never[]) => undefined,
	onClickSubmitButton: (..._args: never[]) => undefined,
	options: [
		{
			id: "parent-1",
			name: "상위 카테고리",
		},
		{
			id: "parent-2",
			name: "하위 카테고리 후보",
		},
	],
	parentId: "parent-1",
};

const loadingArgs = {
	...defaultArgs,
	isLoading: true,
};

const notFoundArgs = {
	...defaultArgs,
	isNotFound: true,
};

const busyArgs = {
	...defaultArgs,
	isSubmitting: true,
};

const meta = {
	component: RoleCategoryEditPage,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: defaultArgs as never,
} satisfies Meta<typeof RoleCategoryEditPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
	args: loadingArgs as never,
};

export const NotFound: Story = {
	args: notFoundArgs as never,
};

export const Busy: Story = {
	args: busyArgs as never,
};
