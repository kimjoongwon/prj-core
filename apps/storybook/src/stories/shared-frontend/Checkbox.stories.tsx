import { Checkbox } from '@shared/frontend';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof Checkbox> = {
  title: 'Shared Frontend/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: '공통 Checkbox 컴포넌트입니다. NextUI Checkbox를 래핑하여 사용합니다.',
      },
    },
  },
  argTypes: {
    children: { control: 'text', description: '라벨 텍스트' },
    isSelected: { control: 'boolean', description: '선택 여부' },
    isDisabled: { control: 'boolean', description: '비활성화 여부' },
    color: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'success', 'warning', 'danger'],
      description: '색상',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: '크기',
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: '체크박스',
  },
};

export const Checked: Story = {
  args: {
    children: '체크됨',
    isSelected: true,
  },
};
