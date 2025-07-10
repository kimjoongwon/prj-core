import { Switch } from '@shared/frontend';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof Switch> = {
  title: 'Shared Frontend/Switch',
  component: Switch,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: '공통 Switch 컴포넌트입니다. NextUI Switch를 래핑하여 사용합니다.',
      },
    },
  },
  argTypes: {
    isSelected: { control: 'boolean', description: '활성 여부' },
    isDisabled: { control: 'boolean', description: '비활성화 여부' },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: '크기',
    },
    color: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'success', 'warning', 'danger'],
      description: '색상',
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Checked: Story = {
  args: {
    isSelected: true,
  },
};
