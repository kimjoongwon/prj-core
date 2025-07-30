import type { Meta, StoryObj } from "@storybook/react";
import { Logo } from "./Logo";

const meta = {
  title: "UI/로고",
  component: Logo,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "로고 컴포넌트입니다. 텍스트 또는 아이콘 변형으로 사용할 수 있습니다.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    onClick: {
      description: "로고 클릭 시 호출되는 콜백 함수",
    },
    className: {
      control: "text",
      description: "추가 CSS 클래스",
    },
    children: {
      control: "text",
      description: "자식 컨텐츠",
    },
  },
} satisfies Meta<typeof Logo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const 기본: Story = {
  parameters: {
    docs: {
      description: {
        story: "기본 텍스트 로고입니다.",
      },
    },
  },
};

export const 텍스트: Story = {
  parameters: {
    docs: {
      description: {
        story: "텍스트 형태의 로고입니다.",
      },
    },
  },
};
