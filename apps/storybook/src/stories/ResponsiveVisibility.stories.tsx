import type { Meta, StoryObj } from '@storybook/react';
import { ResponsiveVisibility } from '@shared/frontend';

const meta: Meta<typeof ResponsiveVisibility> = {
  title: 'Components/ResponsiveVisibility',
  component: ResponsiveVisibility,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
ResponsiveVisibility 컴포넌트는 디바이스 타입에 따라 컴포넌트를 조건부로 숨기거나 보여주는 래퍼 컴포넌트입니다.

**사용법:**
- \`device="mobile"\`: 모바일에서는 숨기고 데스크톱에서만 표시
- \`device="pc"\`: 데스크톱에서는 숨기고 모바일에서만 표시

**브레이크포인트:** xl (1280px)을 기준으로 합니다.
        `,
      },
    },
  },
  argTypes: {
    device: {
      control: 'radio',
      options: ['mobile', 'pc'],
      description: '숨길 디바이스 타입',
    },
    className: {
      control: 'text',
      description: '추가 CSS 클래스',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const HideOnMobile: Story = {
  args: {
    device: 'mobile',
    children: (
      <div className="p-4 bg-blue-100 text-blue-800 rounded-lg border border-blue-300">
        🖥️ 이 컨텐츠는 데스크톱에서만 보입니다 (모바일에서 숨김)
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'mobile 디바이스에서는 숨겨지고, 데스크톱(xl 이상)에서만 표시됩니다.',
      },
    },
  },
};

export const HideOnDesktop: Story = {
  args: {
    device: 'pc',
    children: (
      <div className="p-4 bg-green-100 text-green-800 rounded-lg border border-green-300">
        📱 이 컨텐츠는 모바일에서만 보입니다 (데스크톱에서 숨김)
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: '데스크톱(xl 이상)에서는 숨겨지고, 모바일에서만 표시됩니다.',
      },
    },
  },
};

export const MultipleElements: Story = {
  render: () => (
    <div className="space-y-4">
      <ResponsiveVisibility device="mobile">
        <div className="p-4 bg-blue-100 text-blue-800 rounded-lg border border-blue-300">
          🖥️ 데스크톱 전용 네비게이션
        </div>
      </ResponsiveVisibility>

      <ResponsiveVisibility device="pc">
        <div className="p-4 bg-green-100 text-green-800 rounded-lg border border-green-300">
          📱 모바일 전용 햄버거 메뉴
        </div>
      </ResponsiveVisibility>

      <div className="p-4 bg-gray-100 text-gray-800 rounded-lg border border-gray-300">
        📄 모든 디바이스에서 표시되는 컨텐츠
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '여러 ResponsiveVisibility 컴포넌트를 함께 사용하여 반응형 레이아웃을 구성할 수 있습니다.',
      },
    },
  },
};

export const WithCustomStyling: Story = {
  args: {
    device: 'mobile',
    className: 'border-2 border-dashed border-purple-300 bg-purple-50',
    children: (
      <div className="p-6 text-center">
        <h3 className="text-lg font-bold text-purple-800 mb-2">
          커스텀 스타일링 예제
        </h3>
        <p className="text-purple-600">
          추가 className을 통해 컴포넌트를 스타일링할 수 있습니다.
        </p>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'className prop을 사용하여 컴포넌트에 추가 스타일을 적용할 수 있습니다.',
      },
    },
  },
};
