import type { Meta, StoryObj } from "@storybook/react";
import { AdminRolesCategoriesPage } from "./AdminRolesCategoriesPage";

const defaultArgs = {
  "categories": [{
  "childrenCount": 12,
  "createdAt": "2026-04-14T09:00:00.000Z",
  "id": "item-1",
  "parentName": "샘플 parent name 1",
}, {
  "childrenCount": 12,
  "createdAt": "2026-04-14T09:00:00.000Z",
  "id": "item-1",
  "parentName": "샘플 parent name 1",
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
  "categories": [],
};

const meta = {
  component: AdminRolesCategoriesPage,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: defaultArgs as never,
} satisfies Meta<typeof AdminRolesCategoriesPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  args: loadingArgs as never,
};

export const EmptyState: Story = {
  args: emptyStateArgs as never,
};
