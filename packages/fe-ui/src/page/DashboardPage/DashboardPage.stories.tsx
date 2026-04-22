import type { Meta, StoryObj } from "@storybook/react";
import { DashboardPage } from "./DashboardPage";

const defaultArgs = {};

const meta = {
  component: DashboardPage,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: defaultArgs as never,
} satisfies Meta<typeof DashboardPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};


