import type { Meta, StoryObj } from "@storybook/react-native";
import { ScrollView, View } from "react-native";
import { Text } from "../../data-display/Text";
import { Button } from "../../input/Button";
import { CustomHeader } from "./index";

const meta = {
	title: "input/CustomHeader",
	component: CustomHeader,
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof CustomHeader>;

export default meta;

type Story = StoryObj;

export const Default: Story = {
	render: () => (
		<ScrollView contentContainerClassName="gap-3 px-4 py-5">
			<View className="gap-2">
				<Text className="text-lg font-extrabold text-foreground">
					CustomHeader
				</Text>
				<Text className="text-sm leading-5 text-muted">
					모바일 화면 상단 제목, 뒤로 가기, 우측 액션을 표시합니다.
				</Text>
			</View>
			<CustomHeader
				canGoBack
				onPressBack={() => undefined}
				right={
					<Button size="sm" variant="ghost">
						저장
					</Button>
				}
				subtitle="2026년 5월 13일"
				title="예약 상세"
			/>
		</ScrollView>
	),
};
