import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';
import { ButtonProps } from '@heroui/react';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Example/Button',
  component: Button,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    color: {
      description: 'The color of the button',
      type: 'string',
      options: [
        'default',
        'primary',
        'secondary',
        'success',
        'danger',
        'warning',
      ] as ButtonProps['color'][],
      control: {
        type: 'select',
      },
      table: {
        defaultValue: { summary: 'primary' },
      },
    },
    variant: {
      description: 'The variant of the button',
      type: 'string',
      options: [
        'solid',
        'bordered',
        'faded',
        'ghost',
        'light',
        'shadow',
        'solid',
      ] as ButtonProps['variant'][],
      control: {
        type: 'select',
      },
      table: {
        defaultValue: { summary: 'solid' },
      },
    },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Bordered: Story = {
  args: {
    variant: 'bordered',
    children: '버튼',
    color: 'success',
  },
};

export const Faded: Story = {
  args: {
    variant: 'ghost',
    children: '버튼',
    color: 'danger',
  },
};
