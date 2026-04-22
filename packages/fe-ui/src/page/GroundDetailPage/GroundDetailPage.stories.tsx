import type { Meta, StoryObj } from "@storybook/react";
import { GroundDetailPage } from "./GroundDetailPage";

const defaultArgs = {
  "ground": {
  "address": "address-1",
  "businessNo": "123-45-67891",
  "createdAt": "2026-04-14T09:00:00.000Z",
  "email": "member1@example.com",
  "label": "샘플 label 1",
  "phone": "010-1234-5670",
  "updatedAt": "2026-04-14T09:00:00.000Z",
},
  "isLoading": false,
  "isNotFound": false,
  "onClickBackButton": (..._args: never[]) => undefined,
  "onClickEditButton": (..._args: never[]) => undefined,
  "spaceId": "space-1",
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
  component: GroundDetailPage,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: defaultArgs as never,
} satisfies Meta<typeof GroundDetailPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  args: loadingArgs as never,
};

export const NotFound: Story = {
  args: notFoundArgs as never,
};
