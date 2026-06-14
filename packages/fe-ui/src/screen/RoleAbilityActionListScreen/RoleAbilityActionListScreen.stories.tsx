import type { Meta, StoryObj } from "@storybook/react";
import { RoleAbilityActionListScreen } from "./RoleAbilityActionListScreen";

const defaultArgs = {
	abilityId: "ability-1",
	onClickBackButton: (..._args: never[]) => undefined,
};

const meta = {
	component: RoleAbilityActionListScreen,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: defaultArgs as never,
} satisfies Meta<typeof RoleAbilityActionListScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
