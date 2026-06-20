import type { Meta, StoryObj } from "@storybook/react-native";
import { ScrollView, View } from "react-native";
import { Text } from "../../data-display/Text";
import { ReservationCheckoutSummary } from "./index";

const meta = {
	title: "widget/ReservationCheckoutSummary",
	component: ReservationCheckoutSummary,
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof ReservationCheckoutSummary>;

export default meta;

type Story = StoryObj;

export const Default: Story = {
	render: () => (
		<ScrollView contentContainerClassName="gap-3 px-4 py-5">
			<View className="gap-2">
				<Text className="text-lg font-extrabold text-foreground">
					ReservationCheckoutSummary
				</Text>
				<Text className="text-sm leading-5 text-muted">
					결제 전 예약 대상과 금액을 요약합니다.
				</Text>
			</View>
			<ReservationCheckoutSummary
				amountLabel="88,000"
				currencyLabel="KRW"
				items={[
					{ label: "수업", value: "Morning Reformer" },
					{ label: "일시", value: "2026.05.13 09:30" },
					{ label: "스튜디오", value: "Studio A" },
				]}
				title="예약하려는 수업"
			/>
		</ScrollView>
	),
};
