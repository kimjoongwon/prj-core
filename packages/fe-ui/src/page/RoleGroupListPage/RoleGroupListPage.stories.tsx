import type { Meta, StoryObj } from "@storybook/react";
import { RoleGroupListPage } from "./RoleGroupListPage";

const defaultArgs = {
  "groups": [{
  "createdAt": "2026-04-14T09:00:00.000Z",
  "id": "item-1",
  "label": "샘플 label 1",
}, {
  "createdAt": "2026-04-14T09:00:00.000Z",
  "id": "item-1",
  "label": "샘플 label 1",
}],
  "isLoading": false,
  "onClickCreateButton": (..._args: never[]) => undefined,
  "onClickDetailButton": (..._args: never[]) => undefined,
};

const loadingArgs = {
  ...defaultArgs,
  "isLoading": true,
};

const emptyStateArgs = {
  ...defaultArgs,
  "groups": [],
};

const meta = {
  component: RoleGroupListPage,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: defaultArgs as never,
} satisfies Meta<typeof RoleGroupListPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  args: loadingArgs as never,
};

export const EmptyState: Story = {
  args: emptyStateArgs as never,
};
