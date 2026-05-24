import type { Meta, StoryObj } from "@storybook/react-native";
import { observable } from "mobx";
import { ScrollView, View } from "react-native";
import { Text } from "../../data-display/Text";
import { Textarea } from "./index";

const state = observable({
  memo: "어깨가 불편해서 오늘은 상체 운동 강도를 낮춰 주세요.",
});

const meta = {
  title: "input/Textarea",
  component: Textarea,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Textarea>;

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <ScrollView contentContainerClassName="gap-3 px-4 py-5">
      <View className="gap-2">
        <Text className="text-lg font-extrabold text-foreground">Textarea</Text>
        <Text className="text-sm leading-5 text-muted">
          예약 메모처럼 여러 줄 입력이 필요한 필드입니다.
        </Text>
      </View>
      <Textarea
        path="memo"
        placeholder="코치에게 전달할 내용을 입력하세요"
        state={state}
      />
    </ScrollView>
  ),
};
