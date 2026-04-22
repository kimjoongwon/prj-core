import type { Meta, StoryObj } from "@storybook/react";
import { createStorybookMock } from "../storybookMock";
import { TemplateDetailPage } from "./TemplateDetailPage";

const defaultArgs = {
  "isDeleteModalOpen": false,
  "isDeletePending": false,
  "isLoading": false,
  "isNotFound": false,
  "isPreviewModalOpen": false,
  "isSendTestModalOpen": false,
  "isTogglePending": false,
  "onClickBackButton": (..._args: never[]) => undefined,
  "onClickDeleteButton": (..._args: never[]) => undefined,
  "onClickDeleteCancelButton": (..._args: never[]) => undefined,
  "onClickDeleteConfirmButton": (..._args: never[]) => undefined,
  "onClickEditButton": (..._args: never[]) => undefined,
  "onClickPreviewButton": (..._args: never[]) => undefined,
  "onClickPreviewCloseButton": (..._args: never[]) => undefined,
  "onClickSendTestButton": (..._args: never[]) => undefined,
  "onClickSendTestCloseButton": (..._args: never[]) => undefined,
  "onClickToggleButton": (..._args: never[]) => undefined,
  "onSubmitPreviewTemplate": async (..._args: never[]) => undefined,
  "onSubmitSendTestTemplate": async (..._args: never[]) => undefined,
  "template": {
  "code": "code-1",
  "content": "스토리북에서 확인할 content 예시입니다.",
  "createdAt": "2026-04-14T09:00:00.000Z",
  "description": "스토리북에서 확인할 description 예시입니다.",
  "id": "item-1",
  "isActive": false,
  "subject": "subject-1",
  "type": "EMAIL",
  "updatedAt": "2026-04-14T09:00:00.000Z",
  "variables": [{
  "defaultValue": createStorybookMock("defaultValue") as never,
  "description": createStorybookMock("description") as never,
  "id": "item-1",
  "isRequired": createStorybookMock("isRequired") as never,
}, {
  "defaultValue": createStorybookMock("defaultValue") as never,
  "description": createStorybookMock("description") as never,
  "id": "item-1",
  "isRequired": createStorybookMock("isRequired") as never,
}],
},
  "templateId": "template-1",
};

const loadingArgs = {
  ...defaultArgs,
  "isLoading": true,
};

const notFoundArgs = {
  ...defaultArgs,
  "isNotFound": true,
};

const meta = {
  component: TemplateDetailPage,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: defaultArgs as never,
} satisfies Meta<typeof TemplateDetailPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  args: loadingArgs as never,
};

export const NotFound: Story = {
  args: notFoundArgs as never,
};
