import type { Meta, StoryObj } from "@storybook/react";
import { AdminRolesRoleIdAbilitiesAbilityIdActionsPage } from "./AdminRolesRoleIdAbilitiesAbilityIdActionsPage";

const defaultArgs = {
  "abilityId": "ability-1",
  "onClickBackButton": (..._args: never[]) => undefined,
};

const meta = {
  component: AdminRolesRoleIdAbilitiesAbilityIdActionsPage,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: defaultArgs as never,
} satisfies Meta<typeof AdminRolesRoleIdAbilitiesAbilityIdActionsPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};


