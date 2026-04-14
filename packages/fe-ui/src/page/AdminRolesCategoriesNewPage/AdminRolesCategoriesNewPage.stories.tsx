import type { Meta, StoryObj } from "@storybook/react";
import { AdminRolesCategoriesNewPage } from "./AdminRolesCategoriesNewPage";

const defaultArgs = {
  "isSubmitting": false,
  "nameError": "샘플 name error 1",
  "name": "PLATFORM",
  "onChangeNameInput": (..._args: never[]) => undefined,
  "onChangeParentSelection": (..._args: never[]) => undefined,
  "onClickBackButton": (..._args: never[]) => undefined,
  "onClickSubmitButton": (..._args: never[]) => undefined,
  "options": [{
  "id": "parent-1",
  "name": "최상위 카테고리",
}, {
  "id": "parent-2",
  "name": "보조 카테고리",
}],
  "parentId": "parent-1",
};

const busyArgs = {
  ...defaultArgs,
  "isSubmitting": true,
};

const emptyStateArgs = {
  ...defaultArgs,
  "options": [],
  "parentId": "",
};

const meta = {
  component: AdminRolesCategoriesNewPage,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: defaultArgs as never,
} satisfies Meta<typeof AdminRolesCategoriesNewPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Busy: Story = {
  args: busyArgs as never,
};

export const EmptyState: Story = {
  args: emptyStateArgs as never,
};
