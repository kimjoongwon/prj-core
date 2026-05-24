import type { Meta, StoryObj } from "@storybook/react-native";
import { observable } from "mobx";
import { ScrollView, View } from "react-native";
import { Text } from "../../data-display/Text";
import { SearchField } from "./index";

const state = observable({
  query: "리포머",
});

const meta = {
  title: "input/SearchField",
  component: SearchField,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof SearchField>;

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <ScrollView contentContainerClassName="gap-3 px-4 py-5">
      <View className="gap-2">
        <Text className="text-lg font-extrabold text-foreground">
          SearchField
        </Text>
        <Text className="text-sm leading-5 text-muted">
          클래스, 코치, 스튜디오 검색에 사용하는 검색 입력입니다.
        </Text>
      </View>
      <SearchField
        inputProps={{
          placeholder: "클래스 검색",
        }}
        path="query"
        state={state}
      />
    </ScrollView>
  ),
};
