import type { Meta, StoryObj } from "@storybook/react";
import { RoleEditScreen } from "./RoleEditScreen";

const defaultArgs = {
	description: "스토리북에서 확인할 description 예시입니다.",
	displayName: "샘플 display name 1",
	displayNameError: "샘플 display name error 1",
	isLoading: false,
	isNotFound: false,
	isSubmitPending: false,
	isSystemRole: false,
	onChangeDescriptionTextArea: (..._args: never[]) => undefined,
	onChangeDisplayNameInput: (..._args: never[]) => undefined,
	onClickBackButton: (..._args: never[]) => undefined,
	onClickListButton: (..._args: never[]) => undefined,
	onClickSubmitButton: (..._args: never[]) => undefined,
	roleDisplayName: "샘플 role display name 1",
	roleName: "샘플 role name 1",
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
	isSubmitPending: true,
};

const meta = {
	component: RoleEditScreen,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: defaultArgs as never,
} satisfies Meta<typeof RoleEditScreen>;

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
