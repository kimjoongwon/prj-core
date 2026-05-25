import type { Meta, StoryObj } from "@storybook/react-native";
import { observable } from "mobx";
import { ScrollView } from "react-native";
import { Text } from "../../data-display/Text";
import { VStack } from "../../rhythm";
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
      <VStack gap="dense">
        <Text variant="heading">SearchField</Text>
        <Text tone="muted">
          클래스, 코치, 스튜디오 검색에 사용하는 검색 입력입니다.
        </Text>
      </VStack>
      <SearchField
        description="검색어를 입력하면 가능한 예약 항목을 좁혀 봅니다."
        inputProps={{
          placeholder: "클래스 검색",
        }}
        label="검색"
        path="query"
        state={state}
      />
    </ScrollView>
  ),
};
