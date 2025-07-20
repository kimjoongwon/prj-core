import type { Meta, StoryObj } from "@storybook/react-vite";
import { RouteBuilder } from "@shared/frontend";
import { getLoginPage } from "@shared/meta";

const meta = {
  title: "페이지/LoginPage",
  component: RouteBuilder,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    routeBuilder: {
      control: "object",
      description: "로그인 페이지 라우트 빌더 설정",
    },
  },
} satisfies Meta<typeof RouteBuilder>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 기본로그인페이지: Story = {
  args: {
    routeBuilder: {
      layout: {
        type: "Auth",
      },
      page: getLoginPage(),
    },
  },
};

export const 모달형태로그인: Story = {
  args: {
    routeBuilder: {
      layout: {
        type: "Modal",
        name: "로그인",
      },
      page: getLoginPage(),
    },
  },
};

export const 기본레이아웃로그인: Story = {
  args: {
    routeBuilder: {
      layout: {
        type: "default",
      },
      page: getLoginPage(),
    },
  },
};
