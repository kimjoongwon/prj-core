import type { Meta, StoryObj } from "@storybook/react";
import { AssetUploader } from "./AssetUploader";
import type { UploadQueueItemData } from "../../widget/UploadQueue";
import type { UploadStatus } from "../../ui/UploadQueueItem";

const meta: Meta<typeof AssetUploader> = {
  title: "Feature/AssetUploader",
  component: AssetUploader,
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
type Story = StoryObj<typeof AssetUploader>;

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

export const Default: Story = {
  args: {
    onUploadStart: (files) => console.log("Upload start:", files),
    onUploadComplete: (assets) => console.log("Upload complete:", assets),
    onUploadError: (errors) => console.log("Upload error:", errors),
  },
};

export const WithFolder: Story = {
  args: {
    folderId: "folder-123",
    onUploadStart: (files) => console.log("Upload start to folder:", files),
    onUploadFiles: (files, folderId) =>
      console.log("Upload files to folder:", files, folderId),
  },
};

export const ImageOnly: Story = {
  args: {
    allowedTypes: ["IMAGE"],
    onUploadStart: (files) => console.log("Upload images:", files),
  },
};

export const CustomExtensions: Story = {
  args: {
    allowedExtensions: [".jpg", ".png", ".webp"],
    onUploadStart: (files) => console.log("Upload custom extensions:", files),
  },
};

export const LimitedSize: Story = {
  args: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    onUploadStart: (files) => console.log("Upload limited size:", files),
    onUploadError: (errors) => console.log("Upload error:", errors),
  },
};

export const SingleFileMode: Story = {
  args: {
    multiple: false,
    maxFiles: 1,
    onUploadStart: (files) => console.log("Upload single file:", files),
  },
};

export const WithUploadingQueue: Story = {
  args: {
    queueItems: createMockItems(["banner.jpg", "photo.png", "video.mp4"], "uploading"),
    onUploadStart: (files) => console.log("Upload start:", files),
    onPauseUpload: (id) => console.log("Pause:", id),
    onResumeUpload: (id) => console.log("Resume:", id),
    onCancelUpload: (id) => console.log("Cancel:", id),
    onCancelAllUploads: () => console.log("Cancel all"),
  },
};

export const WithCompletedQueue: Story = {
  args: {
    queueItems: createMockItems(
      ["banner.jpg", "photo.png", "document.pdf"],
      "completed"
    ),
    onUploadStart: (files) => console.log("Upload start:", files),
    onClose: () => console.log("Close"),
    onReset: () => console.log("Reset"),
  },
};

export const WithFailedQueue: Story = {
  args: {
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
    onUploadStart: (files) => console.log("Upload start:", files),
    onRetryUpload: (id) => console.log("Retry:", id),
    onRetryFailedUploads: () => console.log("Retry all failed"),
    onClose: () => console.log("Close"),
  },
};

export const ManualUpload: Story = {
  args: {
    autoUpload: false,
    onUploadStart: (files) => console.log("Upload start:", files),
    onUploadFiles: (files) => console.log("Manual upload:", files),
  },
};
