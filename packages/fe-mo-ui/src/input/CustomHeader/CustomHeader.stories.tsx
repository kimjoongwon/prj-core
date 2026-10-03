import type { Meta, StoryObj } from "@storybook/react-native";
import { ScrollView } from "react-native";
import { Typography } from "../../data-display/Typography";
import { VStack } from "../../rhythm";
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
		<ScrollView contentContainerClassName="px-4 py-5">
			<VStack gap="block">
				<VStack gap="block">
					<Typography className="font-extrabold" type="h5">
						CustomHeader
					</Typography>
					<Typography color="muted" type="body-sm">
						모바일 화면 상단 제목, 뒤로 가기, 우측 액션을 표시합니다.
					</Typography>
				</VStack>
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
			</VStack>
		</ScrollView>
	),
};
