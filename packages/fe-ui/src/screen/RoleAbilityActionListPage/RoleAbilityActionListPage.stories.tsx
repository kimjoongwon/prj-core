import type { Meta, StoryObj } from "@storybook/react";
import { RoleAbilityActionListPage } from "./RoleAbilityActionListPage";

const defaultArgs = {
	abilityId: "ability-1",
	onClickBackButton: (..._args: never[]) => undefined,
};

const meta = {
	component: RoleAbilityActionListPage,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: defaultArgs as never,
} satisfies Meta<typeof RoleAbilityActionListPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
