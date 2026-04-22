import type { Meta, StoryObj } from "@storybook/react";
import { SubjectListPage } from "./SubjectListPage";

const defaultArgs = {
  "isLoading": false,
  "queryStates": {"page": 1, "take": 10, "skip": 0, "search": ""},
  "setQueryStates": (..._args: never[]) => undefined,
  "subjects": [{
  "createdAt": "2026-04-14T09:00:00.000Z",
  "displayName": "샘플 display name 1",
  "group": "샘플 group 1",
  "id": "item-1",
  "removedAt": "2026-04-14T09:00:00.000Z",
}, {
  "createdAt": "2026-04-14T09:00:00.000Z",
  "displayName": "샘플 display name 1",
  "group": "샘플 group 1",
  "id": "item-1",
  "removedAt": "2026-04-14T09:00:00.000Z",
}],
  "totalCount": 12,
};

const loadingArgs = {
  ...defaultArgs,
  "isLoading": true,
};

const emptyStateArgs = {
  ...defaultArgs,
  "subjects": [],
  "totalCount": 0,
};

const meta = {
  component: SubjectListPage,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: defaultArgs as never,
} satisfies Meta<typeof SubjectListPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  args: loadingArgs as never,
};

export const EmptyState: Story = {
  args: emptyStateArgs as never,
};
