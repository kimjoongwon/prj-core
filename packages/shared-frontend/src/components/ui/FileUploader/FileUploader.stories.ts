import type { Meta, StoryObj } from '@storybook/react';
import { FileUploader } from './FileUploader';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Example/FileUploader',
  component: FileUploader,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    label: {
      description: 'The label of the file uploader',
      type: 'string',
      control: {
        type: 'text',
      },
    },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
} satisfies Meta<typeof FileUploader>;

export default meta;

type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const VideoUploader: Story = {
  args: {
    type: 'video',
    value: [],
    selectionMode: 'single',
    label: '비디오 업로드',
  },
};

export const ImageUploader: Story = {
  args: {
    type: 'image',
    value: [],
    selectionMode: 'single',
    label: '이미지 업로드',
  },
};
