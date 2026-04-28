import type { Meta, StoryObj } from "@storybook/react";
import { RoleGroupCreatePage } from "./RoleGroupCreatePage";

const defaultArgs = {
	isSubmitting: false,
	label: "샘플 label 1",
	nameError: "샘플 name error 1",
	onChangeLabelInput: (..._args: never[]) => undefined,
	onChangeNameInput: (..._args: never[]) => undefined,
	onClickBackButton: (..._args: never[]) => undefined,
	onClickSubmitButton: (..._args: never[]) => undefined,
};

const busyArgs = {
	...defaultArgs,
	isSubmitting: true,
};

const meta = {
	component: RoleGroupCreatePage,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: defaultArgs as never,
} satisfies Meta<typeof RoleGroupCreatePage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Busy: Story = {
	args: busyArgs as never,
};
