import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar } from '@shared/frontend';

const meta: Meta<typeof Avatar> = {
  title: 'Shared Frontend/Avatar',
  component: Avatar,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: '사용자 정보를 표시하는 Avatar 컴포넌트입니다.',
      },
    },
  },
  argTypes: {
    showInfo: { control: 'boolean', description: '이름 및 메뉴 표시' },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithInfo: Story = {
  args: {
    showInfo: true,
  },
};
