import type { Meta, StoryObj } from '@storybook/react-vite';
import { Breadcrumb, BreadcrumbBuilder } from '@shared/frontend';

// BreadcrumbItem type definition for stories
interface BreadcrumbItem {
  name: string;
  pathname: string;
  active: boolean;
}

const meta: Meta<typeof Breadcrumb> = {
  title: 'Shared Frontend/Breadcrumb',
  component: Breadcrumb,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'HeroUI 기반의 반응형 Breadcrumb 컴포넌트입니다. 모바일과 PC 환경 모두에서 적절하게 표시됩니다.',
      },
    },
  },
  argTypes: {
    items: {
      description: 'Breadcrumb에 표시할 아이템 배열',
      control: 'object',
    },
    separator: {
      description: '구분자 (기본값: ChevronRight 아이콘)',
      control: 'text',
    },
    className: {
      description: '추가 CSS 클래스',
      control: 'text',
    },
    itemClassName: {
      description: '아이템에 적용할 CSS 클래스',
      control: 'text',
    },
    activeItemClassName: {
      description: '활성 아이템에 적용할 CSS 클래스',
      control: 'text',
    },
    maxItems: {
      description: '표시할 최대 아이템 수',
      control: 'number',
    },
    showHomeIcon: {
      description: '홈 아이콘 표시 여부',
      control: 'boolean',
    },
    homeRouteName: {
      description: '홈 라우트 이름',
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Breadcrumb>;

const mockItems: BreadcrumbItem[] = [
  { name: '홈', pathname: '/', active: false },
  { name: '제품', pathname: '/products', active: false },
  { name: '카테고리', pathname: '/products/category', active: false },
  { name: '상세정보', pathname: '/products/category/detail', active: true },
];

const longMockItems: BreadcrumbItem[] = [
  { name: '홈', pathname: '/', active: false },
  { name: '관리자', pathname: '/admin', active: false },
  { name: '사용자 관리', pathname: '/admin/users', active: false },
  { name: '권한 설정', pathname: '/admin/users/permissions', active: false },
  {
    name: '역할 관리',
    pathname: '/admin/users/permissions/roles',
    active: false,
  },
  {
    name: '상세 설정',
    pathname: '/admin/users/permissions/roles/detail',
    active: true,
  },
];

export const Default: Story = {
  args: {
    items: mockItems,
  },
};

export const WithHomeIcon: Story = {
  args: {
    items: mockItems.slice(1), // 홈 제외
    showHomeIcon: true,
    homeRouteName: '홈',
  },
};

export const CustomSeparator: Story = {
  args: {
    items: mockItems,
    separator: '→',
  },
};

export const MaxItems: Story = {
  args: {
    items: longMockItems,
    maxItems: 3,
  },
  parameters: {
    docs: {
      description: {
        story:
          '긴 경로에서 maxItems를 사용하여 표시할 아이템 수를 제한할 수 있습니다.',
      },
    },
  },
};

export const CustomStyling: Story = {
  args: {
    items: mockItems,
    className: 'bg-gray-50 p-4 rounded-lg',
    itemClassName: 'font-medium',
    activeItemClassName: 'text-primary-600 font-bold',
  },
};

export const LongItemNames: Story = {
  args: {
    items: [
      { name: '홈', pathname: '/', active: false },
      {
        name: '매우 긴 카테고리 이름이 있는 페이지',
        pathname: '/long-category',
        active: false,
      },
      {
        name: '또 다른 매우 긴 서브카테고리 이름',
        pathname: '/long-category/sub',
        active: false,
      },
      {
        name: '현재 페이지의 긴 제목',
        pathname: '/long-category/sub/current',
        active: true,
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          '긴 아이템 이름은 자동으로 잘리고 hover 시 전체 이름을 볼 수 있습니다.',
      },
    },
  },
};

export const MobileResponsive: Story = {
  args: {
    items: mockItems,
    showHomeIcon: true,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: '모바일 환경에서는 홈 아이콘만 표시되고 텍스트는 숨겨집니다.',
      },
    },
  },
};

// BreadcrumbBuilder Stories
export const BuilderDefault: StoryObj<typeof BreadcrumbBuilder> = {
  render: args => <BreadcrumbBuilder {...args} />,
  args: {
    routeNames: ['홈', '제품', '카테고리', '상세정보'],
  },
  parameters: {
    docs: {
      description: {
        story:
          'BreadcrumbBuilder는 라우트 이름 배열로부터 자동으로 breadcrumb을 생성합니다.',
      },
    },
  },
};

export const BuilderWithCustomSeparator: StoryObj<typeof BreadcrumbBuilder> = {
  render: args => <BreadcrumbBuilder {...args} />,
  args: {
    routeNames: ['홈', '제품', '카테고리', '상세정보'],
    separator: '•',
  },
};

// Interactive Story
export const Interactive: Story = {
  args: {
    items: mockItems,
    showHomeIcon: true,
    onItemClick: item => {
      console.log('Clicked item:', item);
      alert(`클릭된 아이템: ${item.name}`);
    },
  },
  parameters: {
    docs: {
      description: {
        story: '클릭 가능한 아이템을 클릭하면 콜백 함수가 호출됩니다.',
      },
    },
  },
};
