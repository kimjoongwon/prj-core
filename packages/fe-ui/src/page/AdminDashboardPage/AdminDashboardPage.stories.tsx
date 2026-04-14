import type { Meta, StoryObj } from "@storybook/react";
import { AdminDashboardPage } from "./AdminDashboardPage";

const defaultArgs = {};

const meta = {
  component: AdminDashboardPage,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: defaultArgs as never,
} satisfies Meta<typeof AdminDashboardPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};


