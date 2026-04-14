import type { Meta, StoryObj } from "@storybook/react";
import { UserEditPage } from "./UserEditPage";

const defaultArgs = {
  "onClickBackButton": (..._args: never[]) => undefined,
};

const meta = {
  component: UserEditPage,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: defaultArgs as never,
} satisfies Meta<typeof UserEditPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};


