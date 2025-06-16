import type { Meta, StoryObj } from '@storybook/react-vite';
import { Chip } from '@shared/frontend';

const meta: Meta<typeof Chip> = {
  title: 'Shared Frontend/Chip',
  component: Chip,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Chip 컴포넌트입니다. 태그나 라벨을 표시할 때 사용합니다.',
      },
    },
  },
  argTypes: {
    children: { control: 'text', description: '칩 내용' },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: '컴포넌트 크기',
    },
    variant: {
      control: 'select',
      options: ['solid', 'bordered', 'light', 'flat', 'faded', 'shadow', 'dot'],
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
    radius: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'full'],
      description: '모서리 둥글기',
    },
    startContent: { control: 'text', description: '시작 아이콘/내용' },
    endContent: { control: 'text', description: '끝 아이콘/내용' },
    avatar: { control: 'text', description: '아바타 이미지 URL' },
    isDisabled: { control: 'boolean', description: '비활성화 상태' },
    onClose: { action: 'close', description: '닫기 버튼 클릭 이벤트' },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: '기본 칩',
  },
};

export const Primary: Story = {
  args: {
    children: 'Primary',
    color: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary',
    color: 'secondary',
  },
};

export const Success: Story = {
  args: {
    children: 'Success',
    color: 'success',
  },
};

export const Warning: Story = {
  args: {
    children: 'Warning',
    color: 'warning',
  },
};

export const Danger: Story = {
  args: {
    children: 'Danger',
    color: 'danger',
  },
};

export const Small: Story = {
  args: {
    children: '작은 칩',
    size: 'sm',
    color: 'primary',
  },
};

export const Large: Story = {
  args: {
    children: '큰 칩',
    size: 'lg',
    color: 'primary',
  },
};

export const Bordered: Story = {
  args: {
    children: 'Bordered',
    variant: 'bordered',
    color: 'primary',
  },
};

export const Light: Story = {
  args: {
    children: 'Light',
    variant: 'light',
    color: 'primary',
  },
};

export const Flat: Story = {
  args: {
    children: 'Flat',
    variant: 'flat',
    color: 'primary',
  },
};

export const Faded: Story = {
  args: {
    children: 'Faded',
    variant: 'faded',
    color: 'primary',
  },
};

export const Shadow: Story = {
  args: {
    children: 'Shadow',
    variant: 'shadow',
    color: 'primary',
  },
};

export const Dot: Story = {
  args: {
    children: 'Dot',
    variant: 'dot',
    color: 'primary',
  },
};

export const WithStartIcon: Story = {
  args: {
    children: '태그',
    startContent: '🏷️',
    color: 'primary',
  },
};

export const WithEndIcon: Story = {
  args: {
    children: '사용자',
    endContent: '👤',
    color: 'secondary',
  },
};

export const WithCloseButton: Story = {
  args: {
    children: '닫을 수 있는 칩',
    color: 'primary',
    onClose: () => console.log('칩이 닫혔습니다'),
  },
};

export const FullRadius: Story = {
  args: {
    children: '완전 둥근 칩',
    radius: 'full',
    color: 'primary',
  },
};

export const NoRadius: Story = {
  args: {
    children: '각진 칩',
    radius: 'none',
    color: 'primary',
  },
};

export const Disabled: Story = {
  args: {
    children: '비활성화된 칩',
    isDisabled: true,
    color: 'primary',
  },
};

export const ChipGroup: Story = {
  render: () => (
    <div className="flex gap-2 flex-wrap">
      <Chip color="primary">React</Chip>
      <Chip color="secondary">TypeScript</Chip>
      <Chip color="success">JavaScript</Chip>
      <Chip color="warning">CSS</Chip>
      <Chip color="danger">HTML</Chip>
      <Chip variant="bordered" color="primary">
        Next.js
      </Chip>
      <Chip variant="light" color="secondary">
        Tailwind
      </Chip>
      <Chip variant="dot" color="success">
        Storybook
      </Chip>
    </div>
  ),
};
