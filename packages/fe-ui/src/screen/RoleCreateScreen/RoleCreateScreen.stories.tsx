import type { Meta, StoryObj } from "@storybook/react";
import { RoleCreateScreen } from "./RoleCreateScreen";

const defaultArgs = {
	description: "스토리북에서 확인할 description 예시입니다.",
	displayName: "샘플 display name 1",
	displayNameError: "샘플 display name error 1",
	isSubmitPending: false,
	nameError: "샘플 name error 1",
	onChangeDescriptionTextArea: (..._args: never[]) => undefined,
	onChangeDisplayNameInput: (..._args: never[]) => undefined,
	onChangeNameInput: (..._args: never[]) => undefined,
	onClickBackButton: (..._args: never[]) => undefined,
	onClickSubmitButton: (..._args: never[]) => undefined,
};

const busyArgs = {
	...defaultArgs,
	isSubmitPending: true,
};

const meta = {
	component: RoleCreateScreen,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: defaultArgs as never,
} satisfies Meta<typeof RoleCreateScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Busy: Story = {
	args: busyArgs as never,
};
