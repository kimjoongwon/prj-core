import type { Meta, StoryObj } from "@storybook/react-native";
import { ScrollView, View } from "react-native";
import { Text } from "../../data-display/Text";
import { PureSelectableCardList as SelectableCardList } from "./index";

const meta = {
	title: "selection/SelectableCardList",
	component: SelectableCardList,
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof SelectableCardList>;

export default meta;

type Story = StoryObj;

export const Default: Story = {
	render: () => (
		<ScrollView contentContainerClassName="gap-3 px-4 py-5">
			<View className="gap-2">
				<Text className="text-lg font-extrabold text-foreground">
					SelectableCardList
				</Text>
				<Text className="text-sm leading-5 text-muted">
					예약 전에 사용할 수강권이나 결제 옵션을 카드 형태로 고릅니다.
				</Text>
			</View>
			<SelectableCardList
				description="예약 전에 사용할 수강권을 한 번 더 확인합니다."
				items={[
					{
						description: "리포머 클래스 8회권, 2026년 6월 30일까지",
						eyebrow: "잔여 5회",
						meta: ["월/수/금 사용 가능", "예약 취소 3시간 전까지"],
						tags: ["추천", "즉시 예약"],
						title: "리포머 8회권",
						value: "reformer-8",
					},
					{
						description: "개인 레슨 전용 수강권입니다.",
						disabledReason: "그룹 수업에는 사용할 수 없습니다.",
						eyebrow: "잔여 2회",
						isDisabled: true,
						title: "PT 1:1 세션",
						value: "private",
					},
				]}
				onSelect={() => undefined}
				selectedLabel="선택됨"
				selectedValue="reformer-8"
				title="수강권 선택"
			/>
		</ScrollView>
	),
};
