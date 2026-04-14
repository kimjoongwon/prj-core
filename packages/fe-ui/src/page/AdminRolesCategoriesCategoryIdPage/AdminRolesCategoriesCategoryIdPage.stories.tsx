import type { Meta, StoryObj } from "@storybook/react";
import { createStorybookMock } from "../storybookMock";
import { AdminRolesCategoriesCategoryIdPage } from "./AdminRolesCategoriesCategoryIdPage";

const defaultArgs = {
  "category": {
  "createdAt": "2026-04-14T09:00:00.000Z",
  "id": "item-1",
  "parent": {
  "id": "item-1",
},
  "parentId": "parent-1",
  "roleClassifications": [{
  "id": createStorybookMock("id") as never,
  "role": createStorybookMock("role") as never,
  "roleId": createStorybookMock("roleId") as never,
}, {
  "id": createStorybookMock("id") as never,
  "role": createStorybookMock("role") as never,
  "roleId": createStorybookMock("roleId") as never,
}],
  "type": "샘플 type 1",
  "updatedAt": "2026-04-14T09:00:00.000Z",
},
  "isDeleteModalOpen": false,
  "isDeleting": false,
  "isLoading": false,
  "onClickBackButton": (..._args: never[]) => undefined,
  "onClickDeleteButton": (..._args: never[]) => undefined,
  "onClickDeleteConfirm": (..._args: never[]) => undefined,
  "onClickEditButton": (..._args: never[]) => undefined,
  "onCloseDeleteModal": (..._args: never[]) => undefined,
};

const loadingArgs = {
  ...defaultArgs,
  "isLoading": true,
};

const busyArgs = {
  ...defaultArgs,
  "isDeleting": true,
};

const meta = {
  component: AdminRolesCategoriesCategoryIdPage,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: defaultArgs as never,
} satisfies Meta<typeof AdminRolesCategoriesCategoryIdPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  args: loadingArgs as never,
};

export const Busy: Story = {
  args: busyArgs as never,
};
