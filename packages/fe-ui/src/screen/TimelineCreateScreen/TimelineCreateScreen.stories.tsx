import type { Meta, StoryObj } from "@storybook/react";
import { TimelineCreateScreen } from "./TimelineCreateScreen";

const defaultArgs = {
	description: "스토리북에서 확인할 description 예시입니다.",
	descriptionError: "스토리북에서 확인할 description error 예시입니다.",
	isSubmitDisabled: false,
	isSubmitPending: false,
	nameError: "샘플 name error 1",
	onChangeDescriptionTextArea: (..._args: never[]) => undefined,
	onChangeNameInput: (..._args: never[]) => undefined,
	onClickCancelButton: (..._args: never[]) => undefined,
	onClickSubmitButton: (..._args: never[]) => undefined,
};

const busyArgs = {
	...defaultArgs,
	isSubmitPending: true,
};

const meta = {
	component: TimelineCreateScreen,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: defaultArgs as never,
} satisfies Meta<typeof TimelineCreateScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Busy: Story = {
	args: busyArgs as never,
};
