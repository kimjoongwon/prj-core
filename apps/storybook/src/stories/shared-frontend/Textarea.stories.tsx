import type { Meta, StoryObj } from '@storybook/react-vite';
import { Textarea } from '@shared/frontend';

const meta: Meta<typeof Textarea> = {
  title: 'Shared Frontend/Textarea',
  component: Textarea,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Textarea 입력 컴포넌트입니다.',
      },
    },
  },
  argTypes: {
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
    isDisabled: { control: 'boolean', description: '비활성화 상태' },
    isRequired: { control: 'boolean', description: '필수 필드 여부' },
    isInvalid: { control: 'boolean', description: '유효성 검사 실패 상태' },
    isReadOnly: { control: 'boolean', description: '읽기 전용 상태' },
    minRows: { control: 'number', description: '최소 행 수' },
    maxRows: { control: 'number', description: '최대 행 수' },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: '메시지',
    placeholder: '메시지를 입력해주세요',
  },
};

export const WithDescription: Story = {
  args: {
    label: '의견',
    placeholder: '의견을 입력해주세요',
    description: '최대 500자까지 입력할 수 있습니다.',
  },
};

export const Required: Story = {
  args: {
    label: '필수 입력',
    placeholder: '내용을 입력해주세요',
    isRequired: true,
  },
};

export const Invalid: Story = {
  args: {
    label: '내용',
    placeholder: '내용을 입력해주세요',
    isInvalid: true,
    errorMessage: '내용을 입력해주세요',
  },
};

export const Disabled: Story = {
  args: {
    label: '비활성화된 텍스트 영역',
    placeholder: '입력할 수 없습니다',
    value: '수정할 수 없는 내용입니다.',
    isDisabled: true,
  },
};

export const ReadOnly: Story = {
  args: {
    label: '읽기 전용',
    value: '이 내용은 읽기 전용입니다. 수정할 수 없습니다.',
    isReadOnly: true,
  },
};

export const MinMaxRows: Story = {
  args: {
    label: '최소/최대 행 제한',
    placeholder: '최소 3행, 최대 6행까지 확장됩니다',
    minRows: 3,
    maxRows: 6,
  },
};

export const Small: Story = {
  args: {
    label: '작은 크기',
    placeholder: '작은 크기의 텍스트 영역',
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    label: '큰 크기',
    placeholder: '큰 크기의 텍스트 영역',
    size: 'lg',
  },
};

export const Bordered: Story = {
  args: {
    label: 'Bordered 스타일',
    placeholder: 'Bordered 스타일의 텍스트 영역',
    variant: 'bordered',
  },
};

export const Primary: Story = {
  args: {
    label: 'Primary 색상',
    placeholder: 'Primary 색상의 텍스트 영역',
    color: 'primary',
  },
};
