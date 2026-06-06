import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";
import { Text } from "../../data-display/Text";
import { FieldError } from "./index";

const meta = {
  title: "input/FieldError",
  component: FieldError,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof FieldError>;

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <View className="w-[280px] gap-2 rounded-xl border border-border bg-surface p-4">
      <Text variant="label">이메일</Text>
      <FieldError isInvalid>올바른 이메일 주소를 입력해주세요.</FieldError>
    </View>
  ),
};

export const States: Story = {
  render: () => (
    <View className="w-[280px] gap-4 rounded-xl border border-border bg-surface p-4">
      <View className="gap-1">
        <Text variant="label">표시됨</Text>
        <FieldError isInvalid>필수 항목입니다.</FieldError>
      </View>
      <View className="gap-1">
        <Text variant="label">숨김</Text>
        <FieldError isInvalid={false}>이 메시지는 렌더되지 않습니다.</FieldError>
      </View>
    </View>
  ),
};
