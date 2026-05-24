import type { Meta, StoryObj } from "@storybook/react-native";
import { ScrollView, View } from "react-native";
import { Text } from "../Text";
import { Icon } from "../../icon";
import { Avatar } from "./index";

const meta = {
  title: "data-display/Avatar",
  component: Avatar,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Avatar>;

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <ScrollView contentContainerClassName="gap-4 px-4 py-5">
      <View className="gap-2">
        <Text className="text-lg font-extrabold text-foreground">Avatar</Text>
        <Text className="text-sm leading-5 text-muted">
          사용자, 코치, 지점 이미지를 원형 또는 soft 톤으로 표시합니다.
        </Text>
      </View>
      <View className="flex-row items-center gap-4 rounded-lg border border-border bg-surface p-4">
        <Avatar alt="Hana coach" color="accent" size="lg">
          <Avatar.Fallback>HA</Avatar.Fallback>
        </Avatar>
        <Avatar alt="Jin coach" color="success" size="md" variant="soft">
          <Avatar.Fallback>JI</Avatar.Fallback>
        </Avatar>
        <Avatar alt="Studio branch" color="warning" size="lg" variant="soft">
          <Avatar.Fallback>
            <Icon name="mapPin" size="md" tone="warning" />
          </Avatar.Fallback>
        </Avatar>
      </View>
    </ScrollView>
  ),
};
