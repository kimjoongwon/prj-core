import type { Meta, StoryObj } from "@storybook/react";
import { AccountUserMenu } from "./AccountUserMenu";

const meta = {
	title: "domain/account/AccountUserMenu",
	component: AccountUserMenu,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
} satisfies Meta<typeof AccountUserMenu>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
