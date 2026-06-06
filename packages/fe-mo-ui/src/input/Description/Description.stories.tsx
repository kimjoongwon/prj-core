import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";
import { Text } from "../../data-display/Text";
import { Description } from "./index";

const meta = {
  title: "input/Description",
  component: Description,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Description>;

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <View className="w-[280px] gap-2 rounded-xl border border-border bg-surface p-4">
      <Text variant="label">예약 메모</Text>
      <Description>
        운영자가 확인할 수 있는 간단한 요청 사항을 남겨주세요.
      </Description>
    </View>
  ),
};

export const States: Story = {
  render: () => (
    <View className="w-[280px] gap-4 rounded-xl border border-border bg-surface p-4">
      <Description isDisabled>
        비활성 필드는 보조 설명도 함께 낮은 강조도로 표시됩니다.
      </Description>
      <Description isInvalid>
        오류 상태에서는 설명이 danger 톤으로 전환됩니다.
      </Description>
      <Description hideOnInvalid isInvalid>
        invalid 상태에서는 숨겨지는 보조 설명입니다.
      </Description>
    </View>
  ),
};
