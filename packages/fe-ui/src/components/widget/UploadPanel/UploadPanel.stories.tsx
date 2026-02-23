import type { Meta, StoryObj } from "@storybook/react";
import { UploadPanel } from "./UploadPanel";
import type { UploadQueueItemData } from "../UploadQueue";
import type { UploadStatus } from "../../ui/UploadQueueItem";

const meta: Meta<typeof UploadPanel> = {
  title: "Widget/UploadPanel",
  component: UploadPanel,
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
type Story = StoryObj<typeof UploadPanel>;

const createMockItems = (
  names: string[],
  status: UploadStatus,
  progress?: number
): UploadQueueItemData[] => {
  const types: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".png": "image/png",
    ".mp4": "video/mp4",
    ".pdf": "application/pdf",
  };

  return names.map((name, i) => {
    const ext = `.${name.split(".").pop()}`;
    return {
      id: `item-${i}`,
      file: new File([], name, { type: types[ext] || "application/octet-stream" }),
      fileName: name,
      fileSize: (i + 1) * 1024 * 1024,
      progress: progress ?? (status === "completed" ? 100 : Math.floor(Math.random() * 80) + 10),
      status,
    };
  });
};

export const Idle: Story = {
  args: {
    onFilesSelected: (files) => console.log("Files selected:", files),
    status: "idle",
  },
};

export const WithQueue: Story = {
  args: {
    onFilesSelected: (files) => console.log("Files selected:", files),
    queueItems: createMockItems(
      ["banner.jpg", "photo.png", "video.mp4"],
      "uploading"
    ),
    onCancelAll: () => console.log("Cancel all"),
    onItemPause: (id) => console.log("Pause:", id),
    onItemCancel: (id) => console.log("Cancel:", id),
  },
};

export const Completed: Story = {
  args: {
    onFilesSelected: (files) => console.log("Files selected:", files),
    queueItems: createMockItems(["banner.jpg", "photo.png", "document.pdf"], "completed"),
    status: "completed",
    completedCount: 3,
    onComplete: () => console.log("Complete"),
    onUploadMore: () => console.log("Upload more"),
  },
};

export const WithFailed: Story = {
  args: {
    onFilesSelected: (files) => console.log("Files selected:", files),
    queueItems: [
      ...createMockItems(["banner.jpg"], "completed"),
      {
        id: "failed-1",
        file: new File([], "large.pdf", { type: "application/pdf" }),
        fileName: "large.pdf",
        fileSize: 150 * 1024 * 1024,
        status: "failed" as UploadStatus,
        errorMessage: "파일 크기가 제한을 초과했습니다",
      },
    ],
    status: "failed",
    completedCount: 1,
    failedCount: 1,
    onRetryFailed: () => console.log("Retry failed"),
    onItemRetry: (id) => console.log("Retry:", id),
    onComplete: () => console.log("Complete"),
  },
};

export const WithAccept: Story = {
  args: {
    onFilesSelected: (files) => console.log("Files selected:", files),
    accept: [".jpg", ".png", ".gif"],
    maxFileSize: 10 * 1024 * 1024, // 10MB
  },
};

export const SingleFile: Story = {
  args: {
    onFilesSelected: (files) => console.log("Files selected:", files),
    multiple: false,
  },
};
