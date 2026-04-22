import type { Meta, StoryObj } from "@storybook/react";
import { ActionEditPage } from "./ActionEditPage";

const defaultArgs = {
  "action": {
  "actionId": "action-1",
  "description": "스토리북에서 확인할 description 예시입니다.",
  "displayName": "샘플 display name 1",
  "group": "샘플 group 1",
  "isSystem": false,
  "order": 1,
},
  "formState": {
  "description": "스토리북에서 확인할 description 예시입니다.",
  "displayName": "샘플 display name 1",
  "group": "샘플 group 1",
  "order": 1,
},
  "isLoading": false,
  "isSubmitting": false,
  "onChangeDescriptionTextarea": (..._args: never[]) => undefined,
  "onChangeDisplayNameInput": (..._args: never[]) => undefined,
  "onChangeGroupSelection": (..._args: never[]) => undefined,
  "onChangeOrderInput": (..._args: never[]) => undefined,
  "onClickBackButton": (..._args: never[]) => undefined,
  "onClickListButton": (..._args: never[]) => undefined,
  "onSubmit": (..._args: never[]) => undefined,
};

const loadingArgs = {
  ...defaultArgs,
  "isLoading": true,
};

const busyArgs = {
  ...defaultArgs,
  "isSubmitting": true,
};

const meta = {
  component: ActionEditPage,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: defaultArgs as never,
} satisfies Meta<typeof ActionEditPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  args: loadingArgs as never,
};

export const Busy: Story = {
  args: busyArgs as never,
};
