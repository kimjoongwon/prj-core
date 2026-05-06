import { fireEvent, render, screen } from "@testing-library/react-native";
import { SelectableCardList } from "./index";

describe("SelectableCardList", () => {
	it("선택 가능한 카드를 누르면 value를 전달해야 한다", () => {
		// Given
		const onSelect = jest.fn();

		render(
			<SelectableCardList
				items={[
					{
						description: "초급자에게 적합한 수업",
						meta: ["30분", "잔여 4석"],
						tags: ["Morning"],
						title: "Morning Pilates",
						value: "program-1",
					},
					{
						title: "Evening Strength",
						value: "program-2",
					},
				]}
				onSelect={onSelect}
				selectLabel="선택"
				selectedLabel="선택됨"
				selectedValue="program-2"
				title="옵션 선택"
			/>,
		);

		// When
		fireEvent.press(screen.getByLabelText("Morning Pilates"));

		// Then
		expect(onSelect).toHaveBeenCalledWith("program-1");
		expect(screen.getByText("초급자에게 적합한 수업")).toBeTruthy();
		expect(screen.getByText("잔여 4석")).toBeTruthy();
		expect(screen.getByText("선택")).toBeTruthy();
		expect(screen.getByText("선택됨")).toBeTruthy();
		expect(screen.getByLabelText("Evening Strength").props.accessibilityState).toEqual(
			expect.objectContaining({
				selected: true,
			}),
		);
	});

	it("비활성 카드는 선택 이벤트를 발생시키지 않아야 한다", () => {
		// Given
		const onSelect = jest.fn();

		render(
			<SelectableCardList
				items={[
					{
						disabledReason: "정원이 마감되었습니다.",
						isDisabled: true,
						title: "Closed Session",
						value: "session-closed",
					},
				]}
				onSelect={onSelect}
			/>,
		);

		// When
		fireEvent.press(screen.getByLabelText("Closed Session"));

		// Then
		expect(onSelect).not.toHaveBeenCalled();
		expect(screen.getByText("정원이 마감되었습니다.")).toBeTruthy();
		expect(screen.getByLabelText("Closed Session").props.accessibilityState).toEqual(
			expect.objectContaining({
				disabled: true,
			}),
		);
	});

	it("선택 라벨과 빈 상태 라벨을 호출부 문구로 바꿀 수 있어야 한다", () => {
		// Given
		render(
			<SelectableCardList
				emptyLabel="예약 가능한 옵션이 없습니다."
				items={[]}
				title="옵션 선택"
			/>,
		);

		// When & Then
		expect(screen.getByText("예약 가능한 옵션이 없습니다.")).toBeTruthy();
	});
});
