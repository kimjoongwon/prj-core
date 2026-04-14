import type { Meta, StoryObj } from "@storybook/react";
import { AdminActionsPage } from "./AdminActionsPage";

const defaultArgs = {
  "actions": [{
  "createdAt": "2026-04-14T09:00:00.000Z",
  "displayName": "샘플 display name 1",
  "group": "샘플 group 1",
  "id": "item-1",
  "isSystem": false,
  "order": 1,
  "removedAt": "2026-04-14T09:00:00.000Z",
}, {
  "createdAt": "2026-04-14T09:00:00.000Z",
  "displayName": "샘플 display name 1",
  "group": "샘플 group 1",
  "id": "item-1",
  "isSystem": false,
  "order": 1,
  "removedAt": "2026-04-14T09:00:00.000Z",
}],
  "isLoading": false,
  "onClickCreateButton": (..._args: never[]) => undefined,
  "queryStates": {"page": 1, "take": 10, "skip": 0, "search": ""},
  "setQueryStates": (..._args: never[]) => undefined,
  "totalCount": 12,
};

const loadingArgs = {
  ...defaultArgs,
  "isLoading": true,
};

const emptyStateArgs = {
  ...defaultArgs,
  "actions": [],
  "totalCount": 0,
};

const meta = {
  component: AdminActionsPage,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: defaultArgs as never,
} satisfies Meta<typeof AdminActionsPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  args: loadingArgs as never,
};

export const EmptyState: Story = {
  args: emptyStateArgs as never,
};
