import { MultiSelect } from '@shared/frontend';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { v4 } from 'uuid';

const meta: Meta<typeof MultiSelect> = {
  title: 'Shared Frontend/MultiSelect',
  component: MultiSelect,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: '다중 선택이 가능한 Select 컴포넌트입니다.',
      },
    },
  },
  argTypes: {
    options: { control: 'object', description: '선택 옵션 배열' },
    label: { control: 'text', description: '라벨 텍스트' },
    placeholder: { control: 'text', description: '플레이스홀더 텍스트' },
    description: { control: 'text', description: '설명 텍스트' },
    errorMessage: { control: 'text', description: '에러 메시지' },
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
    selectionMode: {
      control: 'select',
      options: ['single', 'multiple'],
      description: '선택 모드',
    },
    isDisabled: { control: 'boolean', description: '비활성화 상태' },
    isRequired: { control: 'boolean', description: '필수 필드 여부' },
    isInvalid: { control: 'boolean', description: '유효성 검사 실패 상태' },
    closeOnSelect: { control: 'boolean', description: '선택 시 자동 닫기' },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const categoryOptions = [
  { key: v4(), value: 'frontend', text: 'Frontend' },
  { key: v4(), value: 'backend', text: 'Backend' },
  { key: v4(), value: 'mobile', text: 'Mobile' },
  { key: v4(), value: 'devops', text: 'DevOps' },
  { key: v4(), value: 'design', text: 'Design' },
  { key: v4(), value: 'data', text: 'Data Science' },
  { key: v4(), value: 'ai', text: 'AI/ML' },
  { key: v4(), value: 'blockchain', text: 'Blockchain' },
];

const languageOptions = [
  { key: v4(), value: 'javascript', text: 'JavaScript' },
  { key: v4(), value: 'typescript', text: 'TypeScript' },
  { key: v4(), value: 'python', text: 'Python' },
  { key: v4(), value: 'java', text: 'Java' },
  { key: v4(), value: 'csharp', text: 'C#' },
  { key: v4(), value: 'go', text: 'Go' },
  { key: v4(), value: 'rust', text: 'Rust' },
  { key: v4(), value: 'swift', text: 'Swift' },
];

export const Default: Story = {
  args: {
    options: categoryOptions,
    label: '관심 분야',
    placeholder: '관심 있는 분야를 선택해주세요',
    selectionMode: 'multiple',
  },
};

export const SingleSelection: Story = {
  args: {
    options: languageOptions,
    label: '주 사용 언어',
    placeholder: '주로 사용하는 언어를 선택해주세요',
    selectionMode: 'single',
  },
};

export const WithDescription: Story = {
  args: {
    options: categoryOptions,
    label: '기술 스택',
    placeholder: '경험이 있는 기술 스택을 선택해주세요',
    description: '여러 개를 선택할 수 있습니다.',
    selectionMode: 'multiple',
  },
};

export const Required: Story = {
  args: {
    options: categoryOptions,
    label: '필수 선택',
    placeholder: '최소 하나 이상 선택해주세요',
    isRequired: true,
    selectionMode: 'multiple',
  },
};

export const Invalid: Story = {
  args: {
    options: categoryOptions,
    label: '관심 분야',
    placeholder: '관심 있는 분야를 선택해주세요',
    isInvalid: true,
    errorMessage: '최소 하나 이상 선택해주세요',
    selectionMode: 'multiple',
  },
};

export const Disabled: Story = {
  args: {
    options: categoryOptions,
    label: '비활성화된 선택',
    placeholder: '선택할 수 없습니다',
    isDisabled: true,
    selectionMode: 'multiple',
  },
};

export const CloseOnSelect: Story = {
  args: {
    options: languageOptions,
    label: '선택 시 자동 닫기',
    placeholder: '언어를 선택해주세요',
    closeOnSelect: true,
    selectionMode: 'multiple',
  },
};

export const Small: Story = {
  args: {
    options: categoryOptions,
    label: '작은 크기',
    placeholder: '작은 크기의 다중 선택',
    size: 'sm',
    selectionMode: 'multiple',
  },
};

export const Large: Story = {
  args: {
    options: categoryOptions,
    label: '큰 크기',
    placeholder: '큰 크기의 다중 선택',
    size: 'lg',
    selectionMode: 'multiple',
  },
};

export const Bordered: Story = {
  args: {
    options: categoryOptions,
    label: 'Bordered 스타일',
    placeholder: 'Bordered 스타일의 다중 선택',
    variant: 'bordered',
    selectionMode: 'multiple',
  },
};

export const Primary: Story = {
  args: {
    options: categoryOptions,
    label: 'Primary 색상',
    placeholder: 'Primary 색상의 다중 선택',
    color: 'primary',
    selectionMode: 'multiple',
  },
};
