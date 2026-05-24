import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";
import { Text } from "./index";

const meta = {
	title: "data-display/Text",
	component: Text,
	args: {
		children: "다음 예약 상태를 확인해 주세요.",
	},
} satisfies Meta<typeof Text>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const Variants: Story = {
	render: () => (
		<View className="gap-3 rounded-lg border border-border bg-surface p-4">
			<Text variant="heading">오늘의 예약</Text>
			<Text tone="muted">상태를 먼저 보여주고 다음 행동을 안내합니다.</Text>
			<Text tone="success" variant="label">
				예약 확정
			</Text>
			<Text tone="danger" variant="caption">
				취소 가능 시간이 지났습니다.
			</Text>
		</View>
	),
};
