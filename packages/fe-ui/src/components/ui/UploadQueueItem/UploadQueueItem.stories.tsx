import type { Meta, StoryObj } from "@storybook/react";
import { UploadQueueItem } from "./UploadQueueItem";

const meta: Meta<typeof UploadQueueItem> = {
  title: "UI/UploadQueueItem",
  component: UploadQueueItem,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div className="w-[500px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof UploadQueueItem>;

const createMockFile = (name: string, size: number, type: string): File => {
  const file = new File([], name, { type });
  Object.defineProperty(file, "size", { value: size });
  return file;
};

export const Uploading: Story = {
  args: {
    id: "1",
    file: createMockFile("banner.jpg", 2.4 * 1024 * 1024, "image/jpeg"),
    fileName: "banner.jpg",
    fileSize: 2.4 * 1024 * 1024,
    progress: 45,
    status: "uploading",
    onPause: () => console.log("Pause"),
    onCancel: () => console.log("Cancel"),
  },
};

export const Completed: Story = {
  args: {
    id: "2",
    file: createMockFile("photo.png", 1.2 * 1024 * 1024, "image/png"),
    fileName: "photo.png",
    fileSize: 1.2 * 1024 * 1024,
    progress: 100,
    status: "completed",
  },
};

export const Paused: Story = {
  args: {
    id: "3",
    file: createMockFile("video.mp4", 45.2 * 1024 * 1024, "video/mp4"),
    fileName: "video.mp4",
    fileSize: 45.2 * 1024 * 1024,
    progress: 25,
    status: "paused",
    onResume: () => console.log("Resume"),
    onCancel: () => console.log("Cancel"),
  },
};

export const Failed: Story = {
  args: {
    id: "4",
    file: createMockFile("large.pdf", 150 * 1024 * 1024, "application/pdf"),
    fileName: "large.pdf",
    fileSize: 150 * 1024 * 1024,
    progress: 0,
    status: "failed",
    errorMessage: "파일 크기가 제한을 초과했습니다 (최대 100MB)",
    onRetry: () => console.log("Retry"),
  },
};

export const Pending: Story = {
  args: {
    id: "5",
    file: createMockFile("document.pdf", 5.2 * 1024 * 1024, "application/pdf"),
    fileName: "document.pdf",
    fileSize: 5.2 * 1024 * 1024,
    status: "pending",
    onCancel: () => console.log("Cancel"),
  },
};

export const WithThumbnail: Story = {
  args: {
    id: "6",
    file: createMockFile("profile.jpg", 500 * 1024, "image/jpeg"),
    fileName: "profile.jpg",
    fileSize: 500 * 1024,
    progress: 75,
    status: "uploading",
    showThumbnail: true,
    onPause: () => console.log("Pause"),
    onCancel: () => console.log("Cancel"),
  },
};

export const AllStates: Story = {
  render: () => (
    <div className="space-y-2">
      <UploadQueueItem
        id="1"
        file={createMockFile("file1.jpg", 1 * 1024 * 1024, "image/jpeg")}
        fileName="file1.jpg"
        fileSize={1 * 1024 * 1024}
        progress={30}
        status="uploading"
      />
      <UploadQueueItem
        id="2"
        file={createMockFile("file2.png", 2 * 1024 * 1024, "image/png")}
        fileName="file2.png"
        fileSize={2 * 1024 * 1024}
        progress={100}
        status="completed"
      />
      <UploadQueueItem
        id="3"
        file={createMockFile("file3.mp4", 10 * 1024 * 1024, "video/mp4")}
        fileName="file3.mp4"
        fileSize={10 * 1024 * 1024}
        progress={50}
        status="paused"
      />
      <UploadQueueItem
        id="4"
        file={createMockFile("file4.pdf", 5 * 1024 * 1024, "application/pdf")}
        fileName="file4.pdf"
        fileSize={5 * 1024 * 1024}
        status="pending"
      />
      <UploadQueueItem
        id="5"
        file={createMockFile("file5.exe", 1 * 1024 * 1024, "application/octet-stream")}
        fileName="file5.exe"
        fileSize={1 * 1024 * 1024}
        status="failed"
        errorMessage="지원하지 않는 파일 형식입니다"
      />
    </div>
  ),
};
