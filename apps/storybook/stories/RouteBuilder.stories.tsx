import type { Meta, StoryObj } from "@storybook/react-vite";
import { RouteBuilder } from "@shared/frontend";

const meta = {
  title: "빌더 컴포넌트/RouteBuilder",
  component: RouteBuilder,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    routeBuilder: {
      control: "object",
      description: "라우트 빌더 설정 객체",
    },
  },
} satisfies Meta<typeof RouteBuilder>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 기본: Story = {
  args: {
    routeBuilder: {
      layout: {
        type: "default",
      },
      page: {
        elements: [
          {
            name: "Text",
            props: {
              children: "RouteBuilder 기본 예제",
              className: "p-4 bg-gray-100 rounded-lg",
            },
          },
        ],
      },
    },
  },
};

export const 페이지컴포넌트포함: Story = {
  args: {
    routeBuilder: {
      layout: {
        type: "default",
      },
      page: {
        elements: [
          {
            name: "Text",
            props: {
              children: "RouteBuilder 예제 - 다양한 컴포넌트",
              className: "p-6 bg-blue-50 border border-blue-200 rounded-lg mb-4",
            },
          },
          {
            name: "Text",
            props: {
              children: "두 번째 엘리먼트",
              className: "p-4 bg-green-50 border border-green-200 rounded-lg",
            },
          },
        ],
      },
    },
  },
};
