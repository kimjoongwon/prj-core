import type { Meta, StoryObj } from "@storybook/react-native";
import { ScrollView, View } from "react-native";
import { Text } from "../../data-display/Text";
import { Radio } from "./index";

const meta = {
  title: "selection/Radio",
  component: Radio,
  args: {
    isSelected: true,
  },
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Radio>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const States: Story = {
  render: () => (
    <ScrollView contentContainerClassName="gap-4 px-4 py-5">
      <View className="gap-2">
        <Text className="text-lg font-extrabold text-foreground">Radio</Text>
        <Text className="text-sm leading-5 text-muted">
          단독 radio primitive 또는 RadioGroup 내부 indicator로 사용합니다.
        </Text>
      </View>
      <View className="gap-3 rounded-lg border border-border bg-surface p-4">
        <View className="flex-row items-center gap-3">
          <Radio isSelected />
          <Text className="text-sm font-semibold text-foreground">
            SMS 알림
          </Text>
        </View>
        <View className="flex-row items-center gap-3">
          <Radio />
          <Text className="text-sm font-semibold text-foreground">앱 푸시</Text>
        </View>
        <View className="flex-row items-center gap-3 opacity-50">
          <Radio isDisabled />
          <Text className="text-sm font-semibold text-foreground">이메일</Text>
        </View>
      </View>
    </ScrollView>
  ),
};
