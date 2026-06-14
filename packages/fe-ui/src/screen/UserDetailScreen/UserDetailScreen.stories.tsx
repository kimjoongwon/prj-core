import type { Meta, StoryObj } from "@storybook/react";
import { UserDetailScreen } from "./UserDetailScreen";

const defaultArgs = {
	onClickBackButton: (..._args: never[]) => undefined,
	userId: "user-1",
};

const meta = {
	component: UserDetailScreen,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: defaultArgs as never,
} satisfies Meta<typeof UserDetailScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
