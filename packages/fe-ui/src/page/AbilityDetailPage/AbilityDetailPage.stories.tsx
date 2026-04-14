import type { Meta, StoryObj } from "@storybook/react";
import { AbilityDetailPage } from "./AbilityDetailPage";

const defaultArgs = {
  "mode": "loading",
};

const meta = {
  component: AbilityDetailPage,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: defaultArgs as never,
} satisfies Meta<typeof AbilityDetailPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};


