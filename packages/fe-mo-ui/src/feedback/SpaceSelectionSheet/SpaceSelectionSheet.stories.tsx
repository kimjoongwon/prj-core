import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";
import { Text } from "../../data-display/Text";
import { Button } from "../../action/Button";
import { SpaceSelectionSheet } from "./index";

const spaces = [
  {
    address: "서울특별시 강남구 테헤란로 123",
    id: "gangnam",
    name: "강남 리포머 센터",
  },
  {
    address: "서울특별시 마포구 양화로 45",
    id: "hongdae",
    name: "홍대 밸런스 스튜디오",
  },
  {
    address: "서울특별시 성동구 왕십리로 88",
    id: "seongsu",
    name: "성수 모션 랩",
  },
];

const meta = {
  title: "feedback/SpaceSelectionSheet",
  component: SpaceSelectionSheet,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof SpaceSelectionSheet>;

export default meta;

type Story = StoryObj;

export const Open: Story = {
  render: () => (
    <View className="flex-1 justify-end px-4 py-5">
      <View className="gap-2 rounded-lg border border-border bg-surface p-4">
        <Text className="text-lg font-extrabold text-foreground">
          SpaceSelectionSheet
        </Text>
        <Text className="text-sm leading-5 text-muted">
          아래에서 열린 상태의 지점 선택 시트를 확인합니다.
        </Text>
        <Button variant="secondary">지점 변경</Button>
      </View>
      <SpaceSelectionSheet
        isOpen
        onOpenChange={() => undefined}
        onSelectSpace={() => undefined}
        selectedSpaceId="gangnam"
        spaces={spaces}
      />
    </View>
  ),
};
