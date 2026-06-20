import { fireEvent, render, screen } from "@testing-library/react-native";
import { type ReactNode } from "react";
import { DesignSystemProvider } from "../../design-system/provider";
import { QuickActionList } from "./QuickActionList";

const renderWithDesignSystem = (children: ReactNode) =>
	render(
		<DesignSystemProvider
			config={{
				animation: "disable-all",
				devInfo: {
					stylingPrinciples: false,
				},
				toast: false,
			}}
		>
			{children}
		</DesignSystemProvider>,
	);

describe("QuickActionList", () => {
	it("빠른 이동 행을 렌더링하고 enabled 행 이벤트를 위임해야 한다", () => {
		const onPress = jest.fn();

		renderWithDesignSystem(
			<QuickActionList
				items={[
					{
						description: "예약 상태를 확인합니다.",
						iconName: "calendarCheck",
						id: "reservations",
						label: "내 예약",
						onPress,
					},
				]}
			/>,
		);

		fireEvent.press(screen.getByText("내 예약"));

		expect(screen.getByText("예약 상태를 확인합니다.")).toBeTruthy();
		expect(onPress).toHaveBeenCalledTimes(1);
	});

	it("disabled 행은 press 이벤트를 발생시키지 않아야 한다", () => {
		const onPress = jest.fn();

		renderWithDesignSystem(
			<QuickActionList
				items={[
					{
						description: "곧 연결됩니다.",
						disabled: true,
						iconName: "ticketCheck",
						id: "payments",
						label: "결제/수강권",
						onPress,
					},
				]}
			/>,
		);

		fireEvent.press(screen.getByText("결제/수강권"));

		expect(onPress).not.toHaveBeenCalled();
		expect(screen.getByText("곧 연결됩니다.")).toBeTruthy();
	});
});
