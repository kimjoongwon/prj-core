import type { Meta, StoryObj } from "@storybook/react";
import { ActionCreatePage } from "./ActionCreatePage";

const defaultArgs = {
  "formState": {
  "description": "스토리북에서 확인할 description 예시입니다.",
  "displayName": "샘플 display name 1",
  "errors": {},
  "group": "샘플 group 1",
  "order": 1,
},
  "isSubmitting": false,
  "onChangeDescriptionTextarea": (..._args: never[]) => undefined,
  "onChangeDisplayNameInput": (..._args: never[]) => undefined,
  "onChangeGroupSelection": (..._args: never[]) => undefined,
  "onChangeNameInput": (..._args: never[]) => undefined,
  "onChangeOrderInput": (..._args: never[]) => undefined,
  "onClickBackButton": (..._args: never[]) => undefined,
  "onSubmit": (..._args: never[]) => undefined,
};

const busyArgs = {
  ...defaultArgs,
  "isSubmitting": true,
};

const meta = {
  component: ActionCreatePage,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: defaultArgs as never,
} satisfies Meta<typeof ActionCreatePage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Busy: Story = {
  args: busyArgs as never,
};
