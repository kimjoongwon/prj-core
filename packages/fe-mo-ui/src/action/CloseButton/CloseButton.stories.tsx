import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";
import { Text } from "../../data-display/Text";
import { CloseButton } from "./index";

const meta = {
  title: "action/CloseButton",
  component: CloseButton,
  args: {
    accessibilityLabel: "닫기",
    size: "sm",
  },
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof CloseButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <View className="items-center gap-4">
      <Text className="text-sm font-semibold text-muted">Close actions</Text>
      <View className="flex-row items-center gap-3 rounded-lg border border-border bg-surface p-3">
        <CloseButton accessibilityLabel="작게 닫기" size="sm" />
        <CloseButton accessibilityLabel="기본 닫기" size="md" />
        <CloseButton accessibilityLabel="크게 닫기" size="lg" />
      </View>
    </View>
  ),
};
