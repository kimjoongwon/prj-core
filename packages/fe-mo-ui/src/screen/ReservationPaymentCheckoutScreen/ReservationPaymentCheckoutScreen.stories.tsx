import type { Meta, StoryObj } from "@storybook/react-native";
import {
	ReservationPaymentCheckoutScreen,
	type ReservationPaymentProgressStep,
} from "./ReservationPaymentCheckoutScreen";

const progressSteps: ReservationPaymentProgressStep[] = [
	{ id: "select", label: "수업 선택", status: "COMPLETED" },
	{ id: "payment", label: "결제 승인", status: "CURRENT" },
	{ id: "reservation", label: "예약 확정", status: "PENDING" },
];

const meta = {
	title: "screen/ReservationPaymentCheckoutScreen",
	component: ReservationPaymentCheckoutScreen,
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof ReservationPaymentCheckoutScreen>;

export default meta;

type Story = StoryObj;

export const Idle: Story = {
	render: () => (
		<ReservationPaymentCheckoutScreen
			amountLabel="88,000"
			courseOptions={[
				{
					description: "리포머 클래스 8회권, 2026년 6월 30일까지",
					id: "reformer-8",
					meta: ["잔여 5회", "예약 취소 3시간 전까지"],
					priceLabel: "88,000 KRW",
					title: "리포머 8회권",
				},
				{
					description: "매트 필라테스 클래스 4회권",
					id: "mat-4",
					meta: ["잔여 4회"],
					priceLabel: "48,000 KRW",
					title: "매트 4회권",
				},
			]}
			currencyLabel="KRW"
			methodOptions={[
				{
					description: "앱에 등록된 기본 카드로 결제합니다.",
					label: "신용카드",
					value: "card",
				},
				{
					description: "결제 승인 전까지 예약은 확정되지 않습니다.",
					label: "간편결제",
					value: "easy-pay",
				},
			]}
			onPressSubmit={() => undefined}
			onSelectCourseOption={() => undefined}
			onSelectPaymentMethod={() => undefined}
			progressSteps={progressSteps}
			selectedCourseOfferingId="reformer-8"
			selectedPaymentMethod="card"
			status="idle"
			submitLabel="결제하고 예약 확정"
			summaryItems={[
				{ label: "수업", value: "Morning Reformer" },
				{ label: "일시", value: "2026.05.13 09:30" },
				{ label: "스튜디오", value: "Studio A" },
			]}
		/>
	),
};
