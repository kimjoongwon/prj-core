import type { Meta, StoryObj } from "@storybook/react";
import { TemplateEditPage } from "./TemplateEditPage";

const defaultArgs = {
  "errors": {},
  "formData": {
  "code": "code-1",
  "content": "스토리북에서 확인할 content 예시입니다.",
  "description": "스토리북에서 확인할 description 예시입니다.",
  "subject": "subject-1",
  "type": "EMAIL",
},
  "isLoading": false,
  "isNotFound": false,
  "isSubmitting": false,
  "onClickCancelButton": (..._args: never[]) => undefined,
  "onFormDataChange": (..._args: never[]) => undefined,
  "onSubmitForm": (..._args: never[]) => undefined,
  "onVariablesChange": (..._args: never[]) => undefined,
  "templateName": "샘플 template name 1",
  "variables": [{
  "defaultValue": "default-value-1",
  "description": "스토리북에서 확인할 description 예시입니다.",
  "id": "template-variable-1",
  "isRequired": false,
  "name": "userName",
}, {
  "defaultValue": "default-value-1",
  "description": "스토리북에서 확인할 description 예시입니다.",
  "id": "template-variable-2",
  "isRequired": false,
  "name": "orderNumber",
}],
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
  component: TemplateEditPage,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: defaultArgs as never,
} satisfies Meta<typeof TemplateEditPage>;

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
