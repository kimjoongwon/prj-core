import type { Meta, StoryObj } from "@storybook/react-native";
import { ScrollView, View } from "react-native";
import { Text } from "../../data-display/Text";
import { QuickActionList } from "./QuickActionList";

const meta = {
  title: "widget/QuickActionList",
  component: QuickActionList,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof QuickActionList>;

export default meta;

type Story = StoryObj<typeof QuickActionList>;

export const Default: Story = {
  render: () => (
    <ScrollView contentContainerClassName="gap-4 px-4 py-5">
      <View className="gap-2">
        <Text className="text-lg font-extrabold text-foreground">
          QuickActionList
        </Text>
        <Text className="text-sm leading-5 text-muted">
          자주 쓰는 이동을 compact list로 제공합니다.
        </Text>
      </View>
      <QuickActionList
        items={[
          {
            description: "예약 확정과 대기 상태를 확인합니다.",
            iconName: "calendarCheck",
            id: "reservations",
            label: "내 예약",
            onPress: () => undefined,
          },
          {
            description: "결제 내역과 수강권 관리는 곧 연결됩니다.",
            disabled: true,
            iconName: "ticketCheck",
            id: "payments",
            label: "결제/수강권",
          },
          {
            description: "예약 알림과 앱 설정 관리는 다음 단계에서 제공합니다.",
            disabled: true,
            iconName: "info",
            id: "settings",
            label: "알림/설정",
          },
        ]}
      />
    </ScrollView>
  ),
};
