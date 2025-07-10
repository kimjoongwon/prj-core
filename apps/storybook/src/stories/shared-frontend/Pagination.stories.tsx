import { Pagination } from '@shared/frontend';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof Pagination> = {
  title: 'Shared Frontend/Pagination',
  component: Pagination,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Pagination 컴포넌트입니다.',
      },
    },
  },
  argTypes: {
    total: { control: 'number', description: '전체 페이지 수' },
    page: { control: 'number', description: '현재 페이지' },
    initialPage: { control: 'number', description: '초기 페이지' },
    siblings: {
      control: 'number',
      description: '현재 페이지 주변에 표시할 페이지 수',
    },
    boundaries: {
      control: 'number',
      description: '시작/끝에 표시할 페이지 수',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: '컴포넌트 크기',
    },
    variant: {
      control: 'select',
      options: ['flat', 'bordered', 'light', 'faded'],
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
    showControls: { control: 'boolean', description: '이전/다음 버튼 표시' },
    showShadow: { control: 'boolean', description: '그림자 효과' },
    isCompact: { control: 'boolean', description: '컴팩트 모드' },
    isDisabled: { control: 'boolean', description: '비활성화 상태' },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    total: 10,
    initialPage: 1,
  },
};

export const ManyPages: Story = {
  args: {
    total: 50,
    initialPage: 25,
  },
};

export const WithControls: Story = {
  args: {
    total: 20,
    initialPage: 10,
    showControls: true,
  },
};

export const CompactMode: Story = {
  args: {
    total: 15,
    initialPage: 8,
    isCompact: true,
  },
};

export const Primary: Story = {
  args: {
    total: 12,
    initialPage: 6,
    color: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    total: 12,
    initialPage: 6,
    color: 'secondary',
  },
};

export const Success: Story = {
  args: {
    total: 12,
    initialPage: 6,
    color: 'success',
  },
};

export const Small: Story = {
  args: {
    total: 8,
    initialPage: 4,
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    total: 8,
    initialPage: 4,
    size: 'lg',
  },
};

export const Bordered: Story = {
  args: {
    total: 10,
    initialPage: 5,
    variant: 'bordered',
  },
};

export const Light: Story = {
  args: {
    total: 10,
    initialPage: 5,
    variant: 'light',
  },
};

export const WithShadow: Story = {
  args: {
    total: 10,
    initialPage: 5,
    showShadow: true,
  },
};

export const FullRadius: Story = {
  args: {
    total: 10,
    initialPage: 5,
    radius: 'full',
  },
};

export const NoRadius: Story = {
  args: {
    total: 10,
    initialPage: 5,
    radius: 'none',
  },
};

export const CustomSiblings: Story = {
  args: {
    total: 20,
    initialPage: 10,
    siblings: 3,
  },
};

export const CustomBoundaries: Story = {
  args: {
    total: 20,
    initialPage: 10,
    boundaries: 2,
  },
};

export const Disabled: Story = {
  args: {
    total: 10,
    initialPage: 5,
    isDisabled: true,
  },
};
