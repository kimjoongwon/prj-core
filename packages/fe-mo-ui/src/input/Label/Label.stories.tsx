import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";
import { Text } from "../../data-display/Text";
import { Label } from "./index";

const meta = {
  title: "input/Label",
  component: Label,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Label>;

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <View className="w-[280px] gap-2 rounded-xl border border-border bg-surface p-4">
      <Label>예약자 이름</Label>
      <Text tone="muted">필드와 연결되는 기본 라벨입니다.</Text>
    </View>
  ),
};

export const States: Story = {
  render: () => (
    <View className="w-[280px] gap-4 rounded-xl border border-border bg-surface p-4">
      <View className="gap-1">
        <Label isRequired>이메일</Label>
        <Text tone="muted">필수 입력 라벨</Text>
      </View>
      <View className="gap-1">
        <Label isInvalid>인증 코드</Label>
        <Text tone="danger">검증 실패 라벨</Text>
      </View>
    </View>
  ),
};
