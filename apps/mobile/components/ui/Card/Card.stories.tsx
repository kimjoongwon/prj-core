import type { Meta, StoryObj } from "@storybook/react";
import { View, Text } from "react-native";
import { Card } from "./Card";

const meta: Meta<typeof Card> = {
  title: "components/ui/card/Card",
  component: Card,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lg"],
    },
    variant: {
      control: { type: "select" },
      options: ["elevated", "outline", "ghost", "filled"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const 기본: Story = {
  args: {
    size: "md",
    variant: "elevated",
  },
  render: (args) => (
    <Card {...args}>
      <Text>기본 카드입니다</Text>
    </Card>
  ),
};

export const 작은크기: Story = {
  args: {
    size: "sm",
    variant: "elevated",
  },
  render: (args) => (
    <Card {...args}>
      <Text>작은 크기 카드</Text>
    </Card>
  ),
};

export const 큰크기: Story = {
  args: {
    size: "lg",
    variant: "elevated",
  },
  render: (args) => (
    <Card {...args}>
      <Text>큰 크기 카드</Text>
    </Card>
  ),
};

export const 아웃라인: Story = {
  args: {
    size: "md",
    variant: "outline",
  },
  render: (args) => (
    <Card {...args}>
      <Text>아웃라인 카드</Text>
    </Card>
  ),
};

export const 고스트: Story = {
  args: {
    size: "md",
    variant: "ghost",
  },
  render: (args) => (
    <Card {...args}>
      <Text>고스트 카드</Text>
    </Card>
  ),
};

export const 채워진: Story = {
  args: {
    size: "md",
    variant: "filled",
  },
  render: (args) => (
    <Card {...args}>
      <Text>채워진 카드</Text>
    </Card>
  ),
};

export const 콘텐츠있는카드: Story = {
  args: {
    size: "md",
    variant: "elevated",
  },
  render: (args) => (
    <Card {...args}>
      <View style={{ padding: 8 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>
          카드 제목
        </Text>
        <Text style={{ fontSize: 14, color: "#666", marginBottom: 12 }}>
          카드 설명 텍스트입니다. 이 카드는 다양한 콘텐츠를 담을 수 있습니다.
        </Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ fontSize: 12, color: "#999" }}>2024.08.20</Text>
          <Text style={{ fontSize: 12, color: "#007AFF" }}>자세히 보기</Text>
        </View>
      </View>
    </Card>
  ),
};
