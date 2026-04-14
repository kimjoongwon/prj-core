import type { Meta, StoryObj } from "@storybook/react";
import { createStorybookMock } from "../storybookMock";
import { UserListPage } from "./UserListPage";

const defaultArgs = {
  "isLoading": false,
  "onChangeSearchValue": (..._args: never[]) => undefined,
  "onClearSearch": (..._args: never[]) => undefined,
  "queryStates": {"page": 1, "take": 10, "skip": 0, "search": ""},
  "searchValue": "샘플",
  "setQueryStates": (..._args: never[]) => undefined,
  "stats": {
  "active": 1,
  "inactive": 1,
  "total": 12,
},
  "totalCount": 12,
  "users": [{
  "createdAt": "2026-04-14T09:00:00.000Z",
  "email": "member1@example.com",
  "id": "item-1",
  "phone": "010-1234-5670",
  "removedAt": "2026-04-14T09:00:00.000Z",
  "tenants": [{
  "role": createStorybookMock("role") as never,
}, {
  "role": createStorybookMock("role") as never,
}],
}, {
  "createdAt": "2026-04-14T09:00:00.000Z",
  "email": "member1@example.com",
  "id": "item-1",
  "phone": "010-1234-5670",
  "removedAt": "2026-04-14T09:00:00.000Z",
  "tenants": [{
  "role": createStorybookMock("role") as never,
}, {
  "role": createStorybookMock("role") as never,
}],
}],
};

const loadingArgs = {
  ...defaultArgs,
  "isLoading": true,
};

const emptyStateArgs = {
  ...defaultArgs,
  "users": [],
  "totalCount": 0,
  "stats": {"total": 0, "active": 0, "inactive": 0},
};

const meta = {
  component: UserListPage,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: defaultArgs as never,
} satisfies Meta<typeof UserListPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  args: loadingArgs as never,
};

export const EmptyState: Story = {
  args: emptyStateArgs as never,
};
