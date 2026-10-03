import type { Meta, StoryObj } from "@storybook/react-native";
import { ScrollView, View } from "react-native";
import { Typography } from "../../data-display/Typography";
import { OccurrencePicker } from "./index";

const meta = {
	title: "widget/OccurrencePicker",
	component: OccurrencePicker,
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof OccurrencePicker>;

export default meta;

type Story = StoryObj;

export const Recurring: Story = {
	render: () => (
		<ScrollView contentContainerClassName="gap-4 px-4 py-5">
			<View className="gap-2">
				<Typography className="font-extrabold" type="h5">
					OccurrencePicker
				</Typography>
				<Typography color="muted" type="body-sm">
					반복 수업 또는 시간대 선택이 필요한 예약에서 발생 회차를 고릅니다.
				</Typography>
			</View>
			<OccurrencePicker
				description="예약 가능한 회차 중 하나를 선택해 주세요."
				onChange={() => undefined}
				options={[
					{
						description: "5월 23일 토요일 09:30 · Studio A",
						label: "오전 리포머",
						value: "2026-05-23T09:30",
					},
					{
						description: "5월 23일 토요일 11:00 · Studio B",
						label: "코어 밸런스",
						value: "2026-05-23T11:00",
					},
					{
						description: "정원이 모두 찼습니다.",
						isDisabled: true,
						label: "저녁 바레",
						unavailableReason: "대기 예약만 가능합니다.",
						value: "2026-05-23T19:00",
					},
				]}
				selectedValue="2026-05-23T09:30"
				sessionType="RECURRING"
				title="회차 선택"
			/>
		</ScrollView>
	),
};

export const OneTime: Story = {
	render: () => (
		<ScrollView contentContainerClassName="gap-4 px-4 py-5">
			<OccurrencePicker
				fixedDescription="5월 23일 토요일 09:30 · Studio A"
				fixedLabel="고정 시간 수업"
				fixedValue="fixed-session"
				sessionType="ONE_TIME"
				title="예약 시간"
			/>
		</ScrollView>
	),
};
