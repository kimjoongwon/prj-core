import type { Meta, StoryObj } from "@storybook/react";
import { AdminRolesGroupsGroupIdEditPage } from "./AdminRolesGroupsGroupIdEditPage";

const defaultArgs = {
  "groupName": "샘플 group name 1",
  "isLoading": false,
  "isNotFound": false,
  "isSubmitting": false,
  "label": "샘플 label 1",
  "nameError": "샘플 name error 1",
  "onChangeLabelInput": (..._args: never[]) => undefined,
  "onChangeNameInput": (..._args: never[]) => undefined,
  "onClickBackButton": (..._args: never[]) => undefined,
  "onClickListButton": (..._args: never[]) => undefined,
  "onClickSubmitButton": (..._args: never[]) => undefined,
};

const loadingArgs = {
  ...defaultArgs,
  "isLoading": true,
};

const notFoundArgs = {
  ...defaultArgs,
  "isNotFound": true,
};

const busyArgs = {
  ...defaultArgs,
  "isSubmitting": true,
};

const meta = {
  component: AdminRolesGroupsGroupIdEditPage,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: defaultArgs as never,
} satisfies Meta<typeof AdminRolesGroupsGroupIdEditPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  args: loadingArgs as never,
};

export const NotFound: Story = {
  args: notFoundArgs as never,
};

export const Busy: Story = {
  args: busyArgs as never,
};
