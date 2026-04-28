import type { Meta, StoryObj } from "@storybook/react";
import { UserCreatePage } from "./UserCreatePage";

const defaultArgs = {
	onClickBackButton: (..._args: never[]) => undefined,
};

const meta = {
	component: UserCreatePage,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: defaultArgs as never,
} satisfies Meta<typeof UserCreatePage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
