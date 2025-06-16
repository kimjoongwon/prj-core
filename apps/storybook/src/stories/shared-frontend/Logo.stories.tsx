import type { Meta, StoryObj } from '@storybook/react-vite';
import { Logo } from '@shared/frontend';

const meta: Meta<typeof Logo> = {
  title: 'Shared Frontend/Logo',
  component: Logo,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Logo 컴포넌트입니다. 브랜드 로고를 표시할 때 사용합니다.',
      },
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: '로고 크기',
    },
    variant: {
      control: 'select',
      options: ['default', 'minimal', 'text-only', 'icon-only'],
      description: '로고 스타일 variant',
    },
    theme: {
      control: 'select',
      options: ['light', 'dark', 'auto'],
      description: '테마 설정',
    },
    isClickable: { control: 'boolean', description: '클릭 가능 여부' },
    showText: { control: 'boolean', description: '텍스트 표시 여부' },
    href: { control: 'text', description: '링크 URL' },
    onClick: { action: 'click', description: '클릭 이벤트' },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: 'md',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
  },
};

export const ExtraLarge: Story = {
  args: {
    size: 'xl',
  },
};

export const ExtraSmall: Story = {
  args: {
    size: 'xs',
  },
};

export const Minimal: Story = {
  args: {
    variant: 'minimal',
    size: 'md',
  },
};

export const TextOnly: Story = {
  args: {
    variant: 'text-only',
    size: 'md',
  },
};

export const IconOnly: Story = {
  args: {
    variant: 'icon-only',
    size: 'md',
  },
};

export const DarkTheme: Story = {
  args: {
    theme: 'dark',
    size: 'md',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

export const LightTheme: Story = {
  args: {
    theme: 'light',
    size: 'md',
  },
};

export const Clickable: Story = {
  args: {
    isClickable: true,
    size: 'md',
    onClick: () => console.log('로고가 클릭되었습니다'),
  },
};

export const WithLink: Story = {
  args: {
    href: '/',
    size: 'md',
  },
};

export const WithoutText: Story = {
  args: {
    showText: false,
    size: 'md',
  },
};

export const LogoSizes: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <span className="w-16 text-sm">XS:</span>
        <Logo size="xs" />
      </div>
      <div className="flex items-center space-x-4">
        <span className="w-16 text-sm">SM:</span>
        <Logo size="sm" />
      </div>
      <div className="flex items-center space-x-4">
        <span className="w-16 text-sm">MD:</span>
        <Logo size="md" />
      </div>
      <div className="flex items-center space-x-4">
        <span className="w-16 text-sm">LG:</span>
        <Logo size="lg" />
      </div>
      <div className="flex items-center space-x-4">
        <span className="w-16 text-sm">XL:</span>
        <Logo size="xl" />
      </div>
    </div>
  ),
};

export const LogoVariants: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Default</h3>
        <Logo variant="default" size="md" />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Minimal</h3>
        <Logo variant="minimal" size="md" />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Text Only</h3>
        <Logo variant="text-only" size="md" />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Icon Only</h3>
        <Logo variant="icon-only" size="md" />
      </div>
    </div>
  ),
};

export const ResponsiveLogo: Story = {
  render: () => (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        화면 크기에 따라 로고가 달라집니다
      </p>
      <div className="border p-4 rounded">
        <div className="block sm:hidden">
          <Logo variant="icon-only" size="sm" />
          <span className="ml-2 text-xs text-gray-500">모바일: 아이콘만</span>
        </div>
        <div className="hidden sm:block md:hidden">
          <Logo variant="minimal" size="md" />
          <span className="ml-2 text-xs text-gray-500">태블릿: 미니멀</span>
        </div>
        <div className="hidden md:block">
          <Logo variant="default" size="lg" />
          <span className="ml-2 text-xs text-gray-500">데스크톱: 풀 로고</span>
        </div>
      </div>
    </div>
  ),
};
