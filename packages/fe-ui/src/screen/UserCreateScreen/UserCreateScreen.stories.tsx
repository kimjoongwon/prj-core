import type { Meta, StoryObj } from "@storybook/react";
import { UserCreateScreen } from "./UserCreateScreen";

const defaultArgs = {
	onClickBackButton: (..._args: never[]) => undefined,
};

const meta = {
	component: UserCreateScreen,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: defaultArgs as never,
} satisfies Meta<typeof UserCreateScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
