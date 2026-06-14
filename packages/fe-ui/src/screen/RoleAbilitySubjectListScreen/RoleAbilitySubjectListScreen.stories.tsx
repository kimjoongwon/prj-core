import type { Meta, StoryObj } from "@storybook/react";
import { RoleAbilitySubjectListScreen } from "./RoleAbilitySubjectListScreen";

const defaultArgs = {
	abilityId: "ability-1",
	onClickBackButton: (..._args: never[]) => undefined,
};

const meta = {
	component: RoleAbilitySubjectListScreen,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: defaultArgs as never,
} satisfies Meta<typeof RoleAbilitySubjectListScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
