import type { Meta, StoryObj } from '@storybook/react';
import { BottomTab } from './index';
import { Route } from '@shared/types';

// Mock routes for stories
const defaultRoutes: Route[] = [
  {
    name: '홈',
    pathname: '/home',
    icon: 'Home',
    active: true,
    params: {},
  },
  {
    name: '검색',
    pathname: '/search',
    icon: 'Search',
    active: false,
    params: {},
  },
  {
    name: '알림',
    pathname: '/notifications',
    icon: 'Bell',
    active: false,
    params: {},
  },
  {
    name: '프로필',
    pathname: '/profile',
    icon: 'User',
    active: false,
    params: {},
  },
];

const ecommerceRoutes: Route[] = [
  {
    name: '홈',
    pathname: '/shop',
    icon: 'Home',
    active: false,
    params: {},
  },
  {
    name: '카테고리',
    pathname: '/categories',
    icon: 'Grid3X3',
    active: true,
    params: {},
  },
  {
    name: '장바구니',
    pathname: '/cart',
    icon: 'ShoppingCart',
    active: false,
    params: {},
  },
  {
    name: '위시리스트',
    pathname: '/wishlist',
    icon: 'Heart',
    active: false,
    params: {},
  },
  {
    name: '계정',
    pathname: '/account',
    icon: 'User',
    active: false,
    params: {},
  },
];

const meta: Meta<typeof BottomTab> = {
  title: 'Components/BottomTab',
  component: BottomTab,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '모바일 환경에서 사용되는 하단 탭 네비게이션 컴포넌트입니다. Route 타입의 배열을 받아서 네비게이션 탭을 생성합니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    routes: {
      description: '네비게이션에 표시할 라우트 배열',
      control: false,
    },
    activeColor: {
      description: '활성 탭의 색상',
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'danger'],
    },
    inactiveColor: {
      description: '비활성 탭의 색상',
      control: 'select',
      options: ['default', 'secondary'],
    },
    variant: {
      description: '버튼 스타일 변형',
      control: 'select',
      options: ['light', 'solid', 'bordered', 'ghost'],
    },
    size: {
      description: '버튼 크기',
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    showLabels: {
      description: '라벨 표시 여부',
      control: 'boolean',
    },
    iconSize: {
      description: '아이콘 크기 (픽셀)',
      control: { type: 'range', min: 16, max: 32, step: 2 },
    },
    className: {
      description: '추가 CSS 클래스',
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    routes: defaultRoutes,
  },
};

export const WithoutLabels: Story = {
  args: {
    routes: defaultRoutes,
    showLabels: false,
    iconSize: 24,
  },
  parameters: {
    docs: {
      description: {
        story:
          '라벨을 숨기고 아이콘만 표시하는 경우입니다. 공간이 제한적일 때 유용합니다.',
      },
    },
  },
};

export const SolidVariant: Story = {
  args: {
    routes: defaultRoutes,
    variant: 'solid',
    activeColor: 'primary',
  },
  parameters: {
    docs: {
      description: {
        story: 'solid 변형을 사용하여 더 강조된 스타일을 적용한 경우입니다.',
      },
    },
  },
};

export const SuccessColor: Story = {
  args: {
    routes: defaultRoutes,
    activeColor: 'success',
    variant: 'light',
  },
  parameters: {
    docs: {
      description: {
        story: '활성 탭에 success 색상을 적용한 경우입니다.',
      },
    },
  },
};

export const LargeSize: Story = {
  args: {
    routes: defaultRoutes,
    size: 'lg',
    iconSize: 24,
  },
  parameters: {
    docs: {
      description: {
        story:
          '큰 크기의 탭을 사용한 경우입니다. 접근성을 고려할 때 유용합니다.',
      },
    },
  },
};

export const EcommerceExample: Story = {
  args: {
    routes: ecommerceRoutes,
    activeColor: 'primary',
    variant: 'light',
  },
  parameters: {
    docs: {
      description: {
        story: '전자상거래 앱에서 사용할 수 있는 하단 탭 예시입니다.',
      },
    },
  },
};

export const BorderedVariant: Story = {
  args: {
    routes: defaultRoutes,
    variant: 'bordered',
    activeColor: 'secondary',
  },
  parameters: {
    docs: {
      description: {
        story:
          'bordered 변형을 사용하여 경계선이 있는 스타일을 적용한 경우입니다.',
      },
    },
  },
};

export const CustomStyling: Story = {
  args: {
    routes: defaultRoutes,
    className: 'shadow-lg border-t-2 border-primary',
    activeColor: 'warning',
    variant: 'ghost',
  },
  parameters: {
    docs: {
      description: {
        story:
          '커스텀 CSS 클래스를 추가하여 그림자와 테두리 스타일을 적용한 경우입니다.',
      },
    },
  },
};

export const WithCustomHandler: Story = {
  args: {
    routes: defaultRoutes,
    onTabPress: (route: Route) => {
      alert(`탭 클릭: ${route.name} (${route.pathname})`);
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          '커스텀 탭 클릭 핸들러를 사용하는 경우입니다. 클릭 시 알림이 표시됩니다.',
      },
    },
  },
};

// Mobile layout simulation
export const InMobileLayout: Story = {
  args: {
    routes: defaultRoutes,
  },
  decorators: [
    Story => (
      <div
        style={{
          maxWidth: '375px',
          margin: '0 auto',
          border: '1px solid #ccc',
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            background: '#f0f0f0',
            padding: '16px',
            textAlign: 'center',
            fontWeight: 'bold',
          }}
        >
          모바일 앱 헤더
        </div>
        <div
          style={{
            height: '300px',
            background: '#fff',
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ textAlign: 'center', color: '#666' }}>
            <h3>메인 콘텐츠 영역</h3>
            <p>실제 앱 콘텐츠가 여기에 표시됩니다.</p>
          </div>
        </div>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story:
          '실제 모바일 앱 레이아웃에서 사용되는 모습을 시뮬레이션한 예시입니다.',
      },
    },
  },
};
