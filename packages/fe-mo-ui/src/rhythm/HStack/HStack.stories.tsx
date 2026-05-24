import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";
import { Text } from "../../data-display/Text";
import { HStack } from "./index";

const meta = {
  title: "rhythm/HStack",
  component: HStack,
  args: {
    alignItems: "center",
    fullWidth: true,
    gap: "inline",
    justifyContent: "between",
  },
  argTypes: {
    alignItems: {
      control: "select",
      options: ["start", "center", "end", "stretch", "baseline"],
    },
    gap: {
      control: "select",
      options: [
        "flush",
        "dense",
        "inline",
        "block",
        "section",
        "page",
        "roomy",
      ],
    },
    justifyContent: {
      control: "select",
      options: ["start", "center", "end", "between", "around", "evenly"],
    },
  },
  parameters: {
    layout: "centered",
  },
  render: (args) => (
    <HStack {...args} className="w-[280px] rounded-xl bg-content1 p-4">
      <View>
        <Text className="text-base font-bold text-foreground">내 예약</Text>
        <Text className="text-xs text-muted">오늘 확인할 항목</Text>
      </View>
      <View className="rounded-full bg-primary px-3 py-1">
        <Text className="text-xs font-bold text-primary-foreground">3건</Text>
      </View>
    </HStack>
  ),
} satisfies Meta<typeof HStack>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
