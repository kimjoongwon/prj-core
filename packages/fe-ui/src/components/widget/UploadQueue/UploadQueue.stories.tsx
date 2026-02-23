import type { Meta, StoryObj } from "@storybook/react";
import { UploadQueue, type UploadQueueItemData } from "./UploadQueue";
import type { UploadStatus } from "../../ui/UploadQueueItem";

const meta: Meta<typeof UploadQueue> = {
  title: "Widget/UploadQueue",
  component: UploadQueue,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div className="w-[600px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof UploadQueue>;

const createMockItems = (
  count: number,
  status: UploadStatus = "uploading"
): UploadQueueItemData[] => {
  const names = ["banner.jpg", "photo.png", "video.mp4", "document.pdf", "logo.svg"];
  const types = ["image/jpeg", "image/png", "video/mp4", "application/pdf", "image/svg+xml"];
  const sizes = [2.4, 1.2, 45.2, 5.5, 0.1];

  return Array.from({ length: count }, (_, i) => ({
    id: `item-${i}`,
    file: new File([], names[i % names.length], { type: types[i % types.length] }),
    fileName: names[i % names.length],
    fileSize: sizes[i % sizes.length] * 1024 * 1024,
    progress: status === "completed" ? 100 : Math.floor(Math.random() * 100),
    status,
  }));
};

export const Empty: Story = {
  args: {
    items: [],
  },
};

export const SingleItem: Story = {
  args: {
    items: createMockItems(1, "uploading"),
    onItemPause: (id) => console.log("Pause:", id),
    onItemCancel: (id) => console.log("Cancel:", id),
  },
};

export const MultipleItems: Story = {
  args: {
    items: [
      { ...createMockItems(1, "uploading")[0], progress: 45 },
      { ...createMockItems(1, "completed")[1], fileName: "photo.png", fileSize: 1.2 * 1024 * 1024 },
      { ...createMockItems(1, "uploading")[2], fileName: "video.mp4", fileSize: 45.2 * 1024 * 1024, progress: 15 },
    ],
    onItemPause: (id) => console.log("Pause:", id),
    onItemResume: (id) => console.log("Resume:", id),
    onItemCancel: (id) => console.log("Cancel:", id),
    onCancelAll: () => console.log("Cancel All"),
  },
};

export const AllCompleted: Story = {
  args: {
    items: createMockItems(3, "completed"),
  },
};

export const WithFailed: Story = {
  args: {
    items: [
      { ...createMockItems(1, "completed")[0], fileName: "banner.jpg" },
      {
        id: "failed-1",
        file: new File([], "large.pdf", { type: "application/pdf" }),
        fileName: "large.pdf",
        fileSize: 150 * 1024 * 1024,
        status: "failed" as UploadStatus,
        errorMessage: "파일 크기가 제한을 초과했습니다 (최대 100MB)",
      },
      { ...createMockItems(1, "completed")[0], fileName: "photo.png" },
    ],
    onItemRetry: (id) => console.log("Retry:", id),
    onRetryFailed: () => console.log("Retry All Failed"),
  },
};

export const WithPaused: Story = {
  args: {
    items: [
      { ...createMockItems(1, "uploading")[0], progress: 60 },
      { ...createMockItems(1, "paused")[1], fileName: "video.mp4", progress: 25 },
      { ...createMockItems(1, "pending")[2], fileName: "document.pdf" },
    ],
    onItemPause: (id) => console.log("Pause:", id),
    onItemResume: (id) => console.log("Resume:", id),
    onItemCancel: (id) => console.log("Cancel:", id),
    onCancelAll: () => console.log("Cancel All"),
  },
};

export const ManyItems: Story = {
  args: {
    items: [
      ...createMockItems(3, "completed"),
      ...createMockItems(2, "uploading"),
      ...createMockItems(2, "pending"),
    ],
    maxHeight: 300,
    onCancelAll: () => console.log("Cancel All"),
  },
};
