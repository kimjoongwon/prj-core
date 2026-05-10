import { fireEvent, render, screen } from "@testing-library/react-native";
import {
	ReservationPaymentCheckoutScreen,
	type ReservationPaymentCheckoutScreenProps,
} from "./ReservationPaymentCheckoutScreen";

jest.mock("react-native-safe-area-context", () => ({
	useSafeAreaInsets: () => ({
		bottom: 0,
		left: 0,
		right: 0,
		top: 0,
	}),
}));

const createProps = (
	overrides: Partial<ReservationPaymentCheckoutScreenProps> = {},
): ReservationPaymentCheckoutScreenProps => ({
	amountLabel: "₩120,000",
	courseOptions: [
		{
			description: "예약 24회",
			id: "offering-1",
			meta: ["6개월", "24회"],
			priceLabel: "₩120,000 KRW",
			title: "초급 필라테스 6개월권",
		},
	],
	currencyLabel: "KRW",
	methodOptions: [
		{
			description: "provider-neutral placeholder",
			label: "카드",
			value: "CARD",
		},
	],
	onPressBack: jest.fn(),
	onPressReservations: jest.fn(),
	onPressSubmit: jest.fn(),
	onSelectCourseOption: jest.fn(),
	onSelectPaymentMethod: jest.fn(),
	progressSteps: [],
	selectedCourseOfferingId: "offering-1",
	selectedPaymentMethod: "CARD",
	status: "idle",
	summaryItems: [
		{ label: "클래스", value: "F45 Strength" },
		{ label: "시간", value: "10:00 - 11:00" },
		{ label: "지점", value: "Gangnam Studio" },
	],
	...overrides,
});

describe("ReservationPaymentCheckoutScreen", () => {
	it("예약 결제 요약과 submit/back 이벤트를 렌더링해야 한다", () => {
		const props = createProps();

		render(<ReservationPaymentCheckoutScreen {...props} />);

		expect(screen.getByText("결제 후 예약")).toBeTruthy();
		expect(screen.getByText("F45 Strength")).toBeTruthy();
		expect(screen.getByText("초급 필라테스 6개월권")).toBeTruthy();
		expect(screen.getByText("카드")).toBeTruthy();
		expect(screen.getByText("₩120,000")).toBeTruthy();

		fireEvent.press(screen.getByLabelText("checkout-back"));
		fireEvent.press(screen.getByLabelText("create-reservation-checkout"));
		fireEvent.press(screen.getByLabelText("초급 필라테스 6개월권"));
		fireEvent.press(screen.getByLabelText("카드"));

		expect(props.onPressBack).toHaveBeenCalled();
		expect(props.onPressSubmit).toHaveBeenCalled();
		expect(props.onSelectCourseOption).toHaveBeenCalledWith("offering-1");
		expect(props.onSelectPaymentMethod).toHaveBeenCalledWith("CARD");
	});

	it("success 상태에서 진행 상태와 예약 내역 액션을 보여준다", () => {
		const onPressReservations = jest.fn();

		render(
			<ReservationPaymentCheckoutScreen
				{...createProps({
					isSubmitDisabled: true,
					onPressReservations,
					progressSteps: [
						{
							id: "payment",
							label: "결제 승인 처리",
							status: "COMPLETED",
						},
						{
							id: "reservation",
							label: "예약 확정",
							status: "COMPLETED",
						},
					],
					status: "success",
				})}
			/>,
		);

		expect(screen.getByText("결제와 예약이 완료되었습니다")).toBeTruthy();
		expect(screen.getByText("결제 승인 처리")).toBeTruthy();
		expect(screen.getByText("예약 확정")).toBeTruthy();

		fireEvent.press(screen.getByLabelText("예약 내역 보기"));

		expect(onPressReservations).toHaveBeenCalled();
	});

	it("error 상태에서 retry 이벤트를 위임해야 한다", () => {
		const onPressSubmit = jest.fn();

		render(
			<ReservationPaymentCheckoutScreen
				{...createProps({
					errorDescription: "수강 상품을 찾을 수 없습니다.",
					onPressSubmit,
					status: "error",
				})}
			/>,
		);

		expect(screen.getByText("결제를 진행할 수 없습니다")).toBeTruthy();
		expect(screen.getByText("수강 상품을 찾을 수 없습니다.")).toBeTruthy();

		fireEvent.press(screen.getByLabelText("다시 시도"));

		expect(onPressSubmit).toHaveBeenCalled();
	});
});
