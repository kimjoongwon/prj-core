import { Search } from '@shared/frontend';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof Search> = {
  title: 'Shared Frontend/Search',
  component: Search,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Search 컴포넌트입니다. 검색 기능을 제공합니다.',
      },
    },
  },
  argTypes: {
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
    radius: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'full'],
      description: '모서리 둥글기',
    },
    isClearable: { control: 'boolean', description: '지우기 버튼 표시' },
    isDisabled: { control: 'boolean', description: '비활성화 상태' },
    isReadOnly: { control: 'boolean', description: '읽기 전용 상태' },
    fullWidth: { control: 'boolean', description: '전체 너비 사용' },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: '검색어를 입력하세요',
    size: 'md',
    variant: 'flat',
    color: 'default',
    isClearable: true,
  },
};

export const Bordered: Story = {
  args: {
    placeholder: '사용자 이름 검색',
    size: 'md',
    variant: 'bordered',
    color: 'primary',
    isClearable: true,
  },
};

export const Large: Story = {
  args: {
    placeholder: '대형 검색 입력창',
    size: 'lg',
    variant: 'bordered',
    color: 'primary',
    isClearable: true,
    fullWidth: true,
  },
};

export const Small: Story = {
  args: {
    placeholder: '소형 검색',
    size: 'sm',
    variant: 'flat',
    color: 'secondary',
    isClearable: true,
  },
};

export const Underlined: Story = {
  args: {
    placeholder: '언더라인 스타일 검색',
    size: 'md',
    variant: 'underlined',
    color: 'primary',
    isClearable: true,
  },
};

export const Faded: Story = {
  args: {
    placeholder: '페이드 스타일 검색',
    size: 'md',
    variant: 'faded',
    color: 'success',
    isClearable: true,
  },
};

export const WithoutClear: Story = {
  args: {
    placeholder: '지우기 버튼이 없는 검색',
    size: 'md',
    variant: 'bordered',
    color: 'default',
    isClearable: false,
  },
};

export const Disabled: Story = {
  args: {
    placeholder: '비활성화된 검색',
    size: 'md',
    variant: 'bordered',
    color: 'default',
    isDisabled: true,
    isClearable: true,
  },
};

export const ReadOnly: Story = {
  args: {
    placeholder: '읽기 전용 검색',
    size: 'md',
    variant: 'flat',
    color: 'default',
    isReadOnly: true,
    value: '읽기 전용 값',
  },
};

export const FullWidth: Story = {
  args: {
    placeholder: '전체 너비 검색',
    size: 'md',
    variant: 'bordered',
    color: 'primary',
    isClearable: true,
    fullWidth: true,
  },
};
