import type { Meta, StoryObj } from "@storybook/react";
import { TaskListPage } from "./TaskListPage";

const defaultArgs = {
  "isDeleting": false,
  "isLoading": false,
  "onClickCreateButton": (..._args: never[]) => undefined,
  "onClickTaskName": (..._args: never[]) => undefined,
  "onDeleteTask": async (..._args: never[]) => undefined,
  "queryStates": {"page": 1, "take": 10, "skip": 0, "search": ""},
  "setQueryStates": (..._args: never[]) => undefined,
  "tasks": [{
  "count": 12,
  "createdAt": "2026-04-14T09:00:00.000Z",
  "description": "스토리북에서 확인할 description 예시입니다.",
  "duration": 15,
  "id": "item-1",
  "isSchedulable": false,
}, {
  "count": 12,
  "createdAt": "2026-04-14T09:00:00.000Z",
  "description": "스토리북에서 확인할 description 예시입니다.",
  "duration": 15,
  "id": "item-1",
  "isSchedulable": false,
}],
  "totalCount": 12,
};

const loadingArgs = {
  ...defaultArgs,
  "isLoading": true,
};

const busyArgs = {
  ...defaultArgs,
  "isDeleting": true,
};

const emptyStateArgs = {
  ...defaultArgs,
  "tasks": [],
  "totalCount": 0,
};

const meta = {
  component: TaskListPage,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: defaultArgs as never,
} satisfies Meta<typeof TaskListPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  args: loadingArgs as never,
};

export const Busy: Story = {
  args: busyArgs as never,
};

export const EmptyState: Story = {
  args: emptyStateArgs as never,
};
