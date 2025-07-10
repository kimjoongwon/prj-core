import { Select } from '@shared/frontend';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { v4 } from 'uuid';

const meta: Meta<typeof Select> = {
  title: 'Shared Frontend/Select',
  component: Select,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Select 드롭다운 컴포넌트입니다.',
      },
    },
  },
  argTypes: {
    options: { control: 'object', description: '선택 옵션 배열' },
    label: { control: 'text', description: '라벨 텍스트' },
    placeholder: { control: 'text', description: '플레이스홀더 텍스트' },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: '컴포넌트 크기',
    },
    variant: {
      control: 'select',
      options: ['flat', 'bordered', 'underlined', 'faded'],
      description: '스타일 variant',
    },
    color: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'success', 'warning', 'danger'],
      description: '색상 테마',
    },
    isDisabled: { control: 'boolean', description: '비활성화 상태' },
    isRequired: { control: 'boolean', description: '필수 필드 여부' },
    isInvalid: { control: 'boolean', description: '유효성 검사 실패 상태' },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const sampleOptions = [
  { key: v4(), value: 'apple', text: '사과' },
  { key: v4(), value: 'banana', text: '바나나' },
  { key: v4(), value: 'orange', text: '오렌지' },
  { key: v4(), value: 'grape', text: '포도' },
  { key: v4(), value: 'strawberry', text: '딸기' },
];

export const Default: Story = {
  args: {
    options: sampleOptions,
    label: '과일 선택',
    placeholder: '과일을 선택해주세요',
  },
};

export const Required: Story = {
  args: {
    options: sampleOptions,
    label: '과일 선택 (필수)',
    placeholder: '과일을 선택해주세요',
    isRequired: true,
  },
};

export const Invalid: Story = {
  args: {
    options: sampleOptions,
    label: '과일 선택',
    placeholder: '과일을 선택해주세요',
    isInvalid: true,
    errorMessage: '과일을 선택해주세요',
  },
};

export const Disabled: Story = {
  args: {
    options: sampleOptions,
    label: '과일 선택 (비활성화)',
    placeholder: '과일을 선택해주세요',
    isDisabled: true,
  },
};

export const Small: Story = {
  args: {
    options: sampleOptions,
    label: '과일 선택 (작은 크기)',
    placeholder: '과일을 선택해주세요',
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    options: sampleOptions,
    label: '과일 선택 (큰 크기)',
    placeholder: '과일을 선택해주세요',
    size: 'lg',
  },
};

export const Bordered: Story = {
  args: {
    options: sampleOptions,
    label: '과일 선택 (Bordered)',
    placeholder: '과일을 선택해주세요',
    variant: 'bordered',
  },
};

export const Primary: Story = {
  args: {
    options: sampleOptions,
    label: '과일 선택 (Primary)',
    placeholder: '과일을 선택해주세요',
    color: 'primary',
  },
};
