import type { Meta, StoryObj } from "@storybook/react";
import { UserEditScreen } from "./UserEditScreen";

const defaultArgs = {
	onClickBackButton: (..._args: never[]) => undefined,
};

const meta = {
	component: UserEditScreen,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: defaultArgs as never,
} satisfies Meta<typeof UserEditScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
