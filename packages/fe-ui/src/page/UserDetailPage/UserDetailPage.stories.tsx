import type { Meta, StoryObj } from "@storybook/react";
import { UserDetailPage } from "./UserDetailPage";

const defaultArgs = {
  "onClickBackButton": (..._args: never[]) => undefined,
  "userId": "user-1",
};

const meta = {
  component: UserDetailPage,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: defaultArgs as never,
} satisfies Meta<typeof UserDetailPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};


