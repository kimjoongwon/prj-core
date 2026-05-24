import type { Meta, StoryObj } from "@storybook/react-native";
import { observable } from "mobx";
import { ScrollView, View } from "react-native";
import { Text } from "../../data-display/Text";
import { Input } from "./index";

const state = observable({
  name: "김온유",
});

const meta = {
  title: "input/Input",
  component: Input,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <ScrollView contentContainerClassName="gap-3 px-4 py-5">
      <View className="gap-2">
        <Text className="text-lg font-extrabold text-foreground">Input</Text>
        <Text className="text-sm leading-5 text-muted">
          MobX form state와 연결되는 기본 텍스트 입력입니다.
        </Text>
      </View>
      <Input path="name" placeholder="이름을 입력하세요" state={state} />
    </ScrollView>
  ),
};
