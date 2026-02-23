import type { Meta, StoryObj } from "@storybook/react";
import { FileIcon } from "./FileIcon";

const meta: Meta<typeof FileIcon> = {
  title: "UI/FileIcon",
  component: FileIcon,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl"],
    },
    color: {
      control: "select",
      options: ["auto", "primary", "secondary", "success", "warning", "danger", "default"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof FileIcon>;

export const Image: Story = {
  args: {
    mimeType: "image/png",
    fileName: "photo.png",
    size: "lg",
  },
};

export const Video: Story = {
  args: {
    mimeType: "video/mp4",
    fileName: "video.mp4",
    size: "lg",
  },
};

export const Audio: Story = {
  args: {
    mimeType: "audio/mp3",
    fileName: "music.mp3",
    size: "lg",
  },
};

export const PDF: Story = {
  args: {
    mimeType: "application/pdf",
    fileName: "document.pdf",
    size: "lg",
  },
};

export const Excel: Story = {
  args: {
    extension: ".xlsx",
    fileName: "spreadsheet.xlsx",
    size: "lg",
  },
};

export const Word: Story = {
  args: {
    extension: ".docx",
    fileName: "document.docx",
    size: "lg",
  },
};

export const Archive: Story = {
  args: {
    extension: ".zip",
    fileName: "archive.zip",
    size: "lg",
  },
};

export const Code: Story = {
  args: {
    extension: ".ts",
    fileName: "index.ts",
    size: "lg",
  },
};

export const Unknown: Story = {
  args: {
    fileName: "unknown.xyz",
    size: "lg",
  },
};

export const WithLabel: Story = {
  args: {
    mimeType: "image/jpeg",
    fileName: "banner.jpg",
    size: "md",
    showLabel: true,
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <div className="text-center">
        <FileIcon mimeType="image/png" size="sm" />
        <p className="text-xs mt-1">sm</p>
      </div>
      <div className="text-center">
        <FileIcon mimeType="image/png" size="md" />
        <p className="text-xs mt-1">md</p>
      </div>
      <div className="text-center">
        <FileIcon mimeType="image/png" size="lg" />
        <p className="text-xs mt-1">lg</p>
      </div>
      <div className="text-center">
        <FileIcon mimeType="image/png" size="xl" />
        <p className="text-xs mt-1">xl</p>
      </div>
    </div>
  ),
};

export const AllTypes: Story = {
  render: () => (
    <div className="grid grid-cols-5 gap-4">
      <div className="text-center">
        <FileIcon mimeType="image/png" size="xl" />
        <p className="text-xs mt-1">Image</p>
      </div>
      <div className="text-center">
        <FileIcon mimeType="video/mp4" size="xl" />
        <p className="text-xs mt-1">Video</p>
      </div>
      <div className="text-center">
        <FileIcon mimeType="audio/mp3" size="xl" />
        <p className="text-xs mt-1">Audio</p>
      </div>
      <div className="text-center">
        <FileIcon mimeType="application/pdf" size="xl" />
        <p className="text-xs mt-1">PDF</p>
      </div>
      <div className="text-center">
        <FileIcon extension=".xlsx" size="xl" />
        <p className="text-xs mt-1">Excel</p>
      </div>
      <div className="text-center">
        <FileIcon extension=".docx" size="xl" />
        <p className="text-xs mt-1">Word</p>
      </div>
      <div className="text-center">
        <FileIcon extension=".pptx" size="xl" />
        <p className="text-xs mt-1">PPT</p>
      </div>
      <div className="text-center">
        <FileIcon extension=".zip" size="xl" />
        <p className="text-xs mt-1">Archive</p>
      </div>
      <div className="text-center">
        <FileIcon extension=".ts" size="xl" />
        <p className="text-xs mt-1">Code</p>
      </div>
      <div className="text-center">
        <FileIcon fileName="unknown" size="xl" />
        <p className="text-xs mt-1">Unknown</p>
      </div>
    </div>
  ),
};
