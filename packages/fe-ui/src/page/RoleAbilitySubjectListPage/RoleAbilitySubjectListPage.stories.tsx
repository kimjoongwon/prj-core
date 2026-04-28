import type { Meta, StoryObj } from "@storybook/react";
import { RoleAbilitySubjectListPage } from "./RoleAbilitySubjectListPage";

const defaultArgs = {
	abilityId: "ability-1",
	onClickBackButton: (..._args: never[]) => undefined,
};

const meta = {
	component: RoleAbilitySubjectListPage,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: defaultArgs as never,
} satisfies Meta<typeof RoleAbilitySubjectListPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
