import { Skeleton } from '@shared/frontend';
import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';

const meta: Meta<typeof Skeleton> = {
  title: 'Shared Frontend/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Skeleton 로딩 컴포넌트입니다. 콘텐츠가 로딩되는 동안 표시됩니다.',
      },
    },
  },
  argTypes: {
    children: { control: 'text', description: '스켈레톤 내용 (로딩 완료 시)' },
    className: { control: 'text', description: '추가 CSS 클래스' },
    isLoaded: { control: 'boolean', description: '로딩 완료 상태' },
    disableAnimation: {
      control: 'boolean',
      description: '애니메이션 비활성화',
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <div className="h-6 w-48 bg-gray-200 rounded" />,
    isLoaded: false,
  },
};

export const Loaded: Story = {
  args: {
    children: (
      <div className="h-6 w-48 bg-blue-500 text-white rounded p-2">로딩이 완료되었습니다!</div>
    ),
    isLoaded: true,
  },
};

export const TextSkeleton: Story = {
  render: () => (
    <div className="space-y-3">
      <Skeleton isLoaded={false}>
        <div className="h-4 bg-gray-200 rounded w-3/4" />
      </Skeleton>
      <Skeleton isLoaded={false}>
        <div className="h-4 bg-gray-200 rounded w-1/2" />
      </Skeleton>
      <Skeleton isLoaded={false}>
        <div className="h-4 bg-gray-200 rounded w-5/6" />
      </Skeleton>
    </div>
  ),
};

export const CardSkeleton: Story = {
  render: () => (
    <div className="border rounded-lg p-4 space-y-3 w-80">
      <div className="flex items-center space-x-3">
        <Skeleton isLoaded={false}>
          <div className="w-12 h-12 bg-gray-200 rounded-full" />
        </Skeleton>
        <div className="space-y-2 flex-1">
          <Skeleton isLoaded={false}>
            <div className="h-4 bg-gray-200 rounded w-24" />
          </Skeleton>
          <Skeleton isLoaded={false}>
            <div className="h-3 bg-gray-200 rounded w-16" />
          </Skeleton>
        </div>
      </div>
      <Skeleton isLoaded={false}>
        <div className="h-32 bg-gray-200 rounded" />
      </Skeleton>
      <div className="space-y-2">
        <Skeleton isLoaded={false}>
          <div className="h-4 bg-gray-200 rounded" />
        </Skeleton>
        <Skeleton isLoaded={false}>
          <div className="h-4 bg-gray-200 rounded w-4/5" />
        </Skeleton>
      </div>
    </div>
  ),
};

export const ListSkeleton: Story = {
  render: () => (
    <div className="space-y-3 w-96">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center space-x-3 p-3 border rounded">
          <Skeleton isLoaded={false}>
            <div className="w-10 h-10 bg-gray-200 rounded-full" />
          </Skeleton>
          <div className="space-y-2 flex-1">
            <Skeleton isLoaded={false}>
              <div className="h-4 bg-gray-200 rounded w-32" />
            </Skeleton>
            <Skeleton isLoaded={false}>
              <div className="h-3 bg-gray-200 rounded w-48" />
            </Skeleton>
          </div>
          <Skeleton isLoaded={false}>
            <div className="w-16 h-8 bg-gray-200 rounded" />
          </Skeleton>
        </div>
      ))}
    </div>
  ),
};

export const DisabledAnimation: Story = {
  args: {
    children: <div className="h-6 w-48 bg-gray-200 rounded" />,
    isLoaded: false,
    disableAnimation: true,
  },
};

export const ButtonSkeleton: Story = {
  render: () => (
    <div className="flex space-x-3">
      <Skeleton isLoaded={false}>
        <div className="h-10 w-24 bg-gray-200 rounded" />
      </Skeleton>
      <Skeleton isLoaded={false}>
        <div className="h-10 w-32 bg-gray-200 rounded" />
      </Skeleton>
      <Skeleton isLoaded={false}>
        <div className="h-10 w-20 bg-gray-200 rounded" />
      </Skeleton>
    </div>
  ),
};

export const TableSkeleton: Story = {
  render: () => (
    <div className="w-full">
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-gray-50 p-3 border-b">
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} isLoaded={false}>
                <div className="h-4 bg-gray-200 rounded w-16" />
              </Skeleton>
            ))}
          </div>
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-3 border-b last:border-b-0">
            <div className="grid grid-cols-4 gap-4">
              {[...Array(4)].map((_, j) => (
                <Skeleton key={j} isLoaded={false}>
                  <div className="h-4 bg-gray-200 rounded w-20" />
                </Skeleton>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const LoadingToLoaded: Story = {
  render: () => {
    const [isLoaded, setIsLoaded] = React.useState(false);

    React.useEffect(() => {
      const timer = setTimeout(() => setIsLoaded(true), 3000);
      return () => clearTimeout(timer);
    }, []);

    return (
      <div className="space-y-3">
        <button
          onClick={() => setIsLoaded(!isLoaded)}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          {isLoaded ? '로딩 상태로 되돌리기' : '로딩 중...'}
        </button>
        <Skeleton isLoaded={isLoaded}>
          <div className="p-4 bg-green-100 border border-green-300 rounded">
            <h3 className="text-lg font-semibold text-green-800">콘텐츠 로딩 완료!</h3>
            <p className="text-green-600">이제 실제 콘텐츠를 볼 수 있습니다.</p>
          </div>
        </Skeleton>
      </div>
    );
  },
};
