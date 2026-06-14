import { fireEvent, render, screen } from "@testing-library/react-native";
import { BookingClassCard, type BookingClassFeedItem } from "./index";

describe("BookingClassCard", () => {
	it("예약 피드 카드 정보를 렌더링하고 CTA 클릭 시 item을 전달해야 한다", () => {
		// Given
		const onPressCta = jest.fn();
		const item: BookingClassFeedItem = {
			availableCount: 2,
			capacity: 12,
			coachName: "Jamie",
			confirmedCount: 10,
			ctaLabel: "예약하기",
			id: "class-1",
			level: "Beginner",
			myReservationStatus: "내 예약 없음",
			previewExerciseTags: ["Squat", "Breathing"],
			programName: "Morning Pilates",
			routineLabel: "Core routine",
			sessionName: "Small group",
			status: "FEW_LEFT",
			timeLabel: "09:00",
			timelineName: "May weekday feed",
			waitlistCount: 1,
		};

		render(<BookingClassCard item={item} onPressCta={onPressCta} />);

		// When
		fireEvent.press(screen.getByLabelText("예약하기"));

		// Then
		expect(onPressCta).toHaveBeenCalledWith(item);
		expect(screen.getByText("Morning Pilates")).toBeTruthy();
		expect(screen.getByText("Few left")).toBeTruthy();
		expect(screen.getByText("잔여 2석 · 예약 10/12 · 대기 1명")).toBeTruthy();
		expect(screen.getByText("Squat")).toBeTruthy();
		expect(screen.getByText("내 예약 없음")).toBeTruthy();
	});

	it("마감/내 예약 상태 카드는 CTA 이벤트를 발생시키지 않아야 한다", () => {
		// Given
		const onPressCta = jest.fn();

		render(
			<BookingClassCard
				item={{
					id: "class-closed",
					programName: "Closed Class",
					status: "BOOKING_CLOSED",
					timeLabel: "21:00",
				}}
				onPressCta={onPressCta}
			/>,
		);

		// When
		fireEvent.press(screen.getByLabelText("Closed"));

		// Then
		expect(onPressCta).not.toHaveBeenCalled();
		expect(screen.getByLabelText("Closed").props.accessibilityState).toEqual(
			expect.objectContaining({
				disabled: true,
			}),
		);
	});
});
