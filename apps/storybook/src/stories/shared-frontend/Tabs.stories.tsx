import { Tabs } from '@shared/frontend';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { v4 } from 'uuid';

const meta: Meta<typeof Tabs> = {
  title: 'Shared Frontend/Tabs',
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
  { key: v4(), value: 'one', text: '탭 1' },
  { key: v4(), value: 'two', text: '탭 2' },
  { key: v4(), value: 'three', text: '탭 3' },
];

export const Default: Story = {
  args: {
    options: sampleOptions,
  },
};
