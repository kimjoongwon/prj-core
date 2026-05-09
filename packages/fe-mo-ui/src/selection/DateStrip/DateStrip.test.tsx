import { fireEvent, render, screen } from "@testing-library/react-native";
import { DateStrip } from "./index";

describe("DateStrip", () => {
	it("선택 가능한 날짜를 누르면 value와 option을 전달해야 한다", () => {
		// Given
		const onSelect = jest.fn();
		const option = {
			count: 3,
			dateLabel: "12",
			dayLabel: "Mon",
			value: "2026-05-12",
		};

		render(
			<DateStrip
				onSelect={onSelect}
				options={[option]}
				selectedValue="2026-05-12"
			/>,
		);

		// When
		fireEvent.press(screen.getByLabelText("Mon 12"));

		// Then
		expect(onSelect).toHaveBeenCalledWith("2026-05-12", option);
		expect(screen.getByText("3")).toBeTruthy();
		expect(screen.getByLabelText("Mon 12").props.accessibilityState).toEqual(
			expect.objectContaining({
				selected: true,
			}),
		);
	});

	it("비활성 날짜는 선택 이벤트를 발생시키지 않아야 한다", () => {
		// Given
		const onSelect = jest.fn();

		render(
			<DateStrip
				onSelect={onSelect}
				options={[
					{
						dateLabel: "13",
						dayLabel: "Tue",
						isDisabled: true,
						value: "2026-05-13",
					},
				]}
			/>,
		);

		// When
		fireEvent.press(screen.getByLabelText("Tue 13"));

		// Then
		expect(onSelect).not.toHaveBeenCalled();
		expect(screen.getByLabelText("Tue 13").props.accessibilityState).toEqual(
			expect.objectContaining({
				disabled: true,
			}),
		);
	});
});
