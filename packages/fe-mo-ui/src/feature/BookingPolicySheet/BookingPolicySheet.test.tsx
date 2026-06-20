import { fireEvent, render, screen } from "@testing-library/react-native";
import { BookingPolicySheet } from "./index";

describe("BookingPolicySheet", () => {
	it("예약 확인 정보와 정책을 렌더링하고 메모와 함께 confirm 해야 한다", () => {
		// Given
		const onChangeMemo = jest.fn();
		const onConfirm = jest.fn();
		const item = {
			id: "class-1",
			programName: "Morning Pilates",
			sessionName: "Small group",
			status: "AVAILABLE" as const,
			timeLabel: "09:00",
		};

		render(
			<BookingPolicySheet
				cancellationPolicy="시작 12시간 전까지 취소할 수 있습니다."
				confirmLabel="예약 확정"
				item={item}
				memoLabel="요청사항"
				memoValue="허리 부상 주의"
				onChangeMemo={onChangeMemo}
				onConfirm={onConfirm}
			/>,
		);

		// When
		fireEvent.changeText(screen.getByLabelText("요청사항"), "매트 가까이 배정");
		fireEvent.press(screen.getByLabelText("예약 확정"));

		// Then
		expect(onChangeMemo).toHaveBeenCalledWith("매트 가까이 배정");
		expect(onConfirm).toHaveBeenCalledWith(item, "허리 부상 주의");
		expect(screen.getByText("09:00 · Morning Pilates")).toBeTruthy();
		expect(
			screen.getByText("시작 12시간 전까지 취소할 수 있습니다."),
		).toBeTruthy();
	});

	it("로딩 중에는 확인 버튼을 비활성화해야 한다", () => {
		// Given
		const onConfirm = jest.fn();

		render(
			<BookingPolicySheet
				isLoading={true}
				item={{
					id: "class-2",
					programName: "Evening Strength",
					status: "WAITLIST_OPEN",
					timeLabel: "20:00",
				}}
				onConfirm={onConfirm}
				testID="policy-sheet"
			/>,
		);

		// When
		fireEvent.press(screen.getByLabelText("Booking..."));

		// Then
		expect(onConfirm).not.toHaveBeenCalled();
		expect(screen.getByTestId("policy-sheet").props.accessibilityState).toEqual(
			expect.objectContaining({
				busy: true,
			}),
		);
	});
});
