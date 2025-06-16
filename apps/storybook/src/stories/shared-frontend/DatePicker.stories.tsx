import type { Meta, StoryObj } from '@storybook/react-vite';
import { DatePicker } from '@shared/frontend';

const meta: Meta<typeof DatePicker> = {
  title: 'Shared Frontend/DatePicker',
  component: DatePicker,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'DatePicker 컴포넌트입니다. 날짜를 선택할 때 사용합니다.',
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
    granularity: {
      control: 'select',
      options: ['day', 'hour', 'minute', 'second'],
      description: '시간 단위',
    },
    isDisabled: { control: 'boolean', description: '비활성화 상태' },
    isRequired: { control: 'boolean', description: '필수 필드 여부' },
    isInvalid: { control: 'boolean', description: '유효성 검사 실패 상태' },
    isReadOnly: { control: 'boolean', description: '읽기 전용 상태' },
    hideTimeZone: { control: 'boolean', description: '시간대 숨김' },
    showMonthAndYearPickers: {
      control: 'boolean',
      description: '월/년 선택기 표시',
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: '날짜 선택',
    placeholder: '날짜를 선택해주세요',
  },
};

export const WithDescription: Story = {
  args: {
    label: '이벤트 날짜',
    placeholder: '이벤트 날짜를 선택해주세요',
    description: '미래 날짜만 선택할 수 있습니다.',
  },
};

export const Required: Story = {
  args: {
    label: '생년월일 (필수)',
    placeholder: '생년월일을 선택해주세요',
    isRequired: true,
  },
};

export const Invalid: Story = {
  args: {
    label: '예약 날짜',
    placeholder: '예약 날짜를 선택해주세요',
    isInvalid: true,
    errorMessage: '날짜를 선택해주세요',
  },
};

export const Disabled: Story = {
  args: {
    label: '비활성화된 날짜 선택',
    placeholder: '선택할 수 없습니다',
    isDisabled: true,
  },
};

export const ReadOnly: Story = {
  args: {
    label: '읽기 전용 날짜',
    isReadOnly: true,
  },
};

export const WithTime: Story = {
  args: {
    label: '날짜 및 시간',
    placeholder: '날짜와 시간을 선택해주세요',
    granularity: 'minute',
  },
};

export const WithSeconds: Story = {
  args: {
    label: '정확한 시간',
    placeholder: '초 단위까지 선택해주세요',
    granularity: 'second',
  },
};

export const HideTimeZone: Story = {
  args: {
    label: '날짜 및 시간 (시간대 숨김)',
    placeholder: '날짜와 시간을 선택해주세요',
    granularity: 'minute',
    hideTimeZone: true,
  },
};

export const WithMonthYearPickers: Story = {
  args: {
    label: '월/년 선택기 포함',
    placeholder: '날짜를 선택해주세요',
    showMonthAndYearPickers: true,
  },
};

export const Small: Story = {
  args: {
    label: '작은 크기',
    placeholder: '작은 크기의 날짜 선택',
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    label: '큰 크기',
    placeholder: '큰 크기의 날짜 선택',
    size: 'lg',
  },
};

export const Bordered: Story = {
  args: {
    label: 'Bordered 스타일',
    placeholder: 'Bordered 스타일의 날짜 선택',
    variant: 'bordered',
  },
};

export const Primary: Story = {
  args: {
    label: 'Primary 색상',
    placeholder: 'Primary 색상의 날짜 선택',
    color: 'primary',
  },
};

export const Success: Story = {
  args: {
    label: 'Success 색상',
    placeholder: 'Success 색상의 날짜 선택',
    color: 'success',
  },
};
