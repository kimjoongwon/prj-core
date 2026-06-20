import type { Meta, StoryObj } from "@storybook/react-native";
import { ScrollView, View } from "react-native";
import { Text } from "../../data-display/Text";
import { StatusFeedback } from "./index";

const meta = {
	title: "feedback/StatusFeedback",
	component: StatusFeedback,
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof StatusFeedback>;

export default meta;

type Story = StoryObj;

export const States: Story = {
	render: () => (
		<ScrollView contentContainerClassName="gap-3 px-4 py-5">
			<View className="gap-2">
				<Text className="text-lg font-extrabold text-foreground">
					StatusFeedback
				</Text>
				<Text className="text-sm leading-5 text-muted">
					로딩, 빈 상태, 오류, 성공 상태를 같은 표면에서 비교합니다.
				</Text>
			</View>
			<StatusFeedback
				description="예약 가능한 클래스와 내 예약 상태를 확인하고 있습니다."
				status="loading"
				title="수업 피드를 불러오는 중"
			/>
			<StatusFeedback
				description="다른 날짜나 필터를 선택해 예약 가능한 수업을 확인해 주세요."
				onPressPrimaryAction={() => undefined}
				primaryActionLabel="피드 새로고침"
				status="empty"
				title="표시할 수업이 없습니다"
			/>
			<StatusFeedback
				description="네트워크 상태를 확인한 뒤 다시 시도해 주세요."
				onPressPrimaryAction={() => undefined}
				primaryActionLabel="다시 시도"
				status="error"
				title="예약 피드를 확인할 수 없습니다"
			/>
			<StatusFeedback
				description="예약 확정과 알림 예약이 완료되었습니다."
				status="success"
				title="예약이 완료되었습니다"
			/>
		</ScrollView>
	),
};
