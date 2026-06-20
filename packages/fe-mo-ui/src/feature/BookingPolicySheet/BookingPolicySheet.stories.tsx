import type { Meta, StoryObj } from "@storybook/react-native";
import { ScrollView, View } from "react-native";
import { Text } from "../../data-display/Text";
import type { BookingClassFeedItem } from "../../widget/BookingClassCard";
import { BookingPolicySheet } from "./index";

const item: BookingClassFeedItem = {
	availableCount: 3,
	capacity: 12,
	coachName: "Hana",
	confirmedCount: 9,
	id: "policy-reformer",
	level: "Intermediate",
	previewExerciseTags: ["core", "balance"],
	programName: "Morning Reformer",
	routineLabel: "50분",
	sessionName: "Tower + Reformer",
	status: "FEW_LEFT",
	statusLabel: "마감 임박",
	timeLabel: "09:30",
	timelineName: "Studio A",
};

const meta = {
	title: "feature/BookingPolicySheet",
	component: BookingPolicySheet,
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof BookingPolicySheet>;

export default meta;

type Story = StoryObj;

export const Default: Story = {
	render: () => (
		<ScrollView contentContainerClassName="gap-4 px-4 py-5">
			<View className="gap-2">
				<Text className="text-lg font-extrabold text-foreground">
					BookingPolicySheet
				</Text>
				<Text className="text-sm leading-5 text-muted">
					예약 확정 전에 취소 정책과 코치 메모를 확인합니다.
				</Text>
			</View>
			<BookingPolicySheet
				cancelLabel="취소"
				cancellationPolicy="수업 시작 3시간 전까지 취소할 수 있습니다."
				confirmLabel="예약 확정"
				item={item}
				memoLabel="코치에게 남길 말"
				memoPlaceholder="부상이나 요청 사항을 입력해 주세요."
				memoValue="어깨에 무리가 가지 않도록 부탁드립니다."
				onCancel={() => undefined}
				onChangeMemo={() => undefined}
				onConfirm={() => undefined}
				title="예약 확인"
			/>
		</ScrollView>
	),
};
