import type { Meta, StoryObj } from "@storybook/react";
import { DropZone } from "./DropZone";

const meta: Meta<typeof DropZone> = {
  title: "UI/DropZone",
  component: DropZone,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "compact", "card"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    multiple: {
      control: "boolean",
    },
    disabled: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof DropZone>;

export const Default: Story = {
  args: {
    onDrop: (files) => console.log("Dropped files:", files),
    title: "파일을 드래그하여 업로드하세요",
    description: "또는",
  },
};

export const Compact: Story = {
  args: {
    onDrop: (files) => console.log("Dropped files:", files),
    variant: "compact",
    size: "sm",
  },
};

export const Card: Story = {
  args: {
    onDrop: (files) => console.log("Dropped files:", files),
    variant: "card",
    size: "lg",
  },
};

export const Disabled: Story = {
  args: {
    onDrop: (files) => console.log("Dropped files:", files),
    disabled: true,
  },
};

export const WithError: Story = {
  args: {
    onDrop: (files) => console.log("Dropped files:", files),
    error: "지원하지 않는 파일 형식입니다",
  },
};

export const ImageOnly: Story = {
  args: {
    onDrop: (files) => console.log("Dropped files:", files),
    accept: ["image/*"],
    title: "이미지를 드래그하여 업로드하세요",
  },
};

export const LimitedSize: Story = {
  args: {
    onDrop: (files) => console.log("Dropped files:", files),
    maxFileSize: 10 * 1024 * 1024, // 10MB
    title: "최대 10MB 파일만 업로드 가능",
  },
};

export const SingleFile: Story = {
  args: {
    onDrop: (files) => console.log("Dropped files:", files),
    multiple: false,
    title: "단일 파일만 업로드하세요",
  },
};
