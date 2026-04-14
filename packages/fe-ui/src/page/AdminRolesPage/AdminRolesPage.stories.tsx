import type { Meta, StoryObj } from "@storybook/react";
import { AdminRolesPage } from "./AdminRolesPage";

const defaultArgs = {
  "isLoading": false,
  "onClickCreateButton": (..._args: never[]) => undefined,
  "queryStates": {"page": 1, "take": 10, "skip": 0, "search": ""},
  "roles": [{
  "createdAt": "2026-04-14T09:00:00.000Z",
  "description": "스토리북에서 확인할 description 예시입니다.",
  "displayName": "샘플 display name 1",
  "id": "item-1",
  "isSystem": false,
  "removedAt": "2026-04-14T09:00:00.000Z",
}, {
  "createdAt": "2026-04-14T09:00:00.000Z",
  "description": "스토리북에서 확인할 description 예시입니다.",
  "displayName": "샘플 display name 1",
  "id": "item-1",
  "isSystem": false,
  "removedAt": "2026-04-14T09:00:00.000Z",
}],
  "setQueryStates": (..._args: never[]) => undefined,
  "totalCount": 12,
};

const loadingArgs = {
  ...defaultArgs,
  "isLoading": true,
};

const emptyStateArgs = {
  ...defaultArgs,
  "roles": [],
  "totalCount": 0,
};

const meta = {
  component: AdminRolesPage,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: defaultArgs as never,
} satisfies Meta<typeof AdminRolesPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  args: loadingArgs as never,
};

export const EmptyState: Story = {
  args: emptyStateArgs as never,
};
