import type { Meta, StoryObj } from '@storybook/react';
import { Tabs } from './index';

const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  component: Tabs,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: '옵션 기반의 Tabs 컴포넌트입니다.',
      },
    },
  },
  argTypes: {
    options: { control: 'object', description: '탭 옵션 배열' },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const sampleOptions = [
  { value: 'one', text: '탭 1' },
  { value: 'two', text: '탭 2' },
  { value: 'three', text: '탭 3' },
];

export const Default: Story = {
  args: {
    options: sampleOptions,
  },
};
