import type { Meta, StoryObj } from "@storybook/react";
import { AdminRolesRoleIdAbilitiesAbilityIdSubjectsPage } from "./AdminRolesRoleIdAbilitiesAbilityIdSubjectsPage";

const defaultArgs = {
  "abilityId": "ability-1",
  "onClickBackButton": (..._args: never[]) => undefined,
};

const meta = {
  component: AdminRolesRoleIdAbilitiesAbilityIdSubjectsPage,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: defaultArgs as never,
} satisfies Meta<typeof AdminRolesRoleIdAbilitiesAbilityIdSubjectsPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};


