import type { Meta, StoryObj } from "@storybook/react";
import { SpaceCreatePage } from "./SpaceCreatePage";

const defaultArgs = {
  "address": "address-1",
  "businessNo": "123-45-67891",
  "email": "member1@example.com",
  "errors": {},
  "isSubmitPending": false,
  "label": "샘플 label 1",
  "onChangeAddressInput": (..._args: never[]) => undefined,
  "onChangeBusinessNoInput": (..._args: never[]) => undefined,
  "onChangeEmailInput": (..._args: never[]) => undefined,
  "onChangeLabelInput": (..._args: never[]) => undefined,
  "onChangeNameInput": (..._args: never[]) => undefined,
  "onChangePhoneInput": (..._args: never[]) => undefined,
  "onClickCancelButton": (..._args: never[]) => undefined,
  "onClickSaveButton": (..._args: never[]) => undefined,
  "phone": "010-1234-5670",
};

const busyArgs = {
  ...defaultArgs,
  "isSubmitPending": true,
};

const meta = {
  component: SpaceCreatePage,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: defaultArgs as never,
} satisfies Meta<typeof SpaceCreatePage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Busy: Story = {
  args: busyArgs as never,
};
