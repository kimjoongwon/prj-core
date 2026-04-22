import type { Meta, StoryObj } from "@storybook/react";
import { InquiryEditPage } from "./InquiryEditPage";

const defaultArgs = {
  "bootstrap": {
  "aiSchemas": [],
  "fieldMeta": {},
  "options": {},
  "ui": {"readOnlyPaths": [], "hiddenPaths": [], "disabledPaths": []},
},
  "categoryOptions": [{
  "label": "샘플 label 1",
  "value": "value-1",
}, {
  "label": "샘플 label 1",
  "value": "value-1",
}],
  "formState": {
  "category": "GENERAL",
  "error": "error-1",
  "priority": "LOW",
  "title": "샘플 title",
},
  "isSubmitting": false,
  "onApplyAiPatch": (..._args: never[]) => undefined,
  "onChangeCategorySelection": (..._args: never[]) => undefined,
  "onChangePrioritySelection": (..._args: never[]) => undefined,
  "onChangeTitleInput": (..._args: never[]) => undefined,
  "onClickBackButton": (..._args: never[]) => undefined,
  "onClickCancelButton": (..._args: never[]) => undefined,
  "onClickSubmitButton": (..._args: never[]) => undefined,
  "onFillAiForm": async (..._args: never[]) => undefined,
  "priorityOptions": [{
  "label": "샘플 label 1",
  "value": "value-1",
}, {
  "label": "샘플 label 1",
  "value": "value-1",
}],
};

const busyArgs = {
  ...defaultArgs,
  "isSubmitting": true,
};

const emptyStateArgs = {
  ...defaultArgs,
  "categoryOptions": [],
  "priorityOptions": [],
};

const meta = {
  component: InquiryEditPage,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: defaultArgs as never,
} satisfies Meta<typeof InquiryEditPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Busy: Story = {
  args: busyArgs as never,
};

export const EmptyState: Story = {
  args: emptyStateArgs as never,
};
