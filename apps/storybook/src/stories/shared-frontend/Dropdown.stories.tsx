import type { Meta, StoryObj } from '@storybook/react-vite';
import { Dropdown } from '@shared/frontend';
import { v4 } from 'uuid';

const meta: Meta<typeof Dropdown> = {
  title: 'Shared Frontend/Dropdown',
  component: Dropdown,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Dropdown 메뉴 컴포넌트입니다.',
      },
    },
  },
  argTypes: {
    trigger: { control: 'text', description: '트리거 버튼 텍스트' },
    options: { control: 'object', description: '드롭다운 옵션 배열' },
    placement: {
      control: 'select',
      options: [
        'top',
        'bottom',
        'left',
        'right',
        'top-start',
        'top-end',
        'bottom-start',
        'bottom-end',
      ],
      description: '드롭다운 위치',
    },
    color: {
      control: 'select',
      options: [
        'default',
        'primary',
        'secondary',
        'success',
        'warning',
        'danger',
      ],
      description: '색상 테마',
    },
    variant: {
      control: 'select',
      options: ['solid', 'bordered', 'light', 'flat', 'faded', 'shadow'],
      description: '스타일 variant',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: '크기',
    },
    isDisabled: { control: 'boolean', description: '비활성화 상태' },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const menuOptions = [
  { key: v4(), value: 'profile', text: '프로필', icon: '👤' },
  { key: v4(), value: 'settings', text: '설정', icon: '⚙️' },
  { key: v4(), value: 'help', text: '도움말', icon: '❓' },
  { key: v4(), value: 'logout', text: '로그아웃', icon: '🚪', isDanger: true },
];

const actionOptions = [
  { key: v4(), value: 'edit', text: '편집', icon: '✏️' },
  { key: v4(), value: 'copy', text: '복사', icon: '📋' },
  { key: v4(), value: 'share', text: '공유', icon: '🔗' },
  { key: v4(), value: 'delete', text: '삭제', icon: '🗑️', isDanger: true },
];

export const Default: Story = {
  args: {
    trigger: '메뉴',
    options: menuOptions,
  },
};

export const Actions: Story = {
  args: {
    trigger: '작업',
    options: actionOptions,
    variant: 'bordered',
  },
};

export const Primary: Story = {
  args: {
    trigger: '주요 메뉴',
    options: menuOptions,
    color: 'primary',
  },
};

export const Small: Story = {
  args: {
    trigger: '작은 메뉴',
    options: menuOptions,
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    trigger: '큰 메뉴',
    options: menuOptions,
    size: 'lg',
  },
};

export const TopPlacement: Story = {
  args: {
    trigger: '위쪽 메뉴',
    options: menuOptions,
    placement: 'top',
  },
};

export const Disabled: Story = {
  args: {
    trigger: '비활성화된 메뉴',
    options: menuOptions,
    isDisabled: true,
  },
};
