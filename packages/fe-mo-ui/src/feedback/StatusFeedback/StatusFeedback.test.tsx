import { fireEvent, render, screen } from "@testing-library/react-native";
import { type ReactNode } from "react";
import { DesignSystemProvider } from "../../design-system/provider";
import { StatusFeedback } from "./index";

jest.mock("react-native-safe-area-context", () => ({
	SafeAreaListener: ({ children }: { children: ReactNode }) => children,
	useSafeAreaInsets: () => ({
		bottom: 0,
		left: 0,
		right: 0,
		top: 0,
	}),
}));

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

describe("StatusFeedback", () => {
	it("에러 상태의 retry 액션을 실행해야 한다", () => {
		// Given
		const onRetry = jest.fn();

		renderWithDesignSystem(
			<StatusFeedback
				description="카탈로그를 다시 불러올 수 있습니다."
				onPressPrimaryAction={onRetry}
				primaryActionLabel="Retry"
				status="error"
				testID="catalog-state"
				title="카탈로그 조회 실패"
			/>,
		);

		// When
		fireEvent.press(screen.getByLabelText("Retry"));

		// Then
		expect(onRetry).toHaveBeenCalledTimes(1);
		expect(screen.getByText("Needs attention")).toBeTruthy();
		expect(screen.getByTestId("catalog-state").props.accessibilityRole).toBe(
			"alert",
		);
	});

	it("제출 중 상태는 busy 접근성 상태를 가져야 한다", () => {
		// Given
		renderWithDesignSystem(
			<StatusFeedback
				description="예약 요청을 보내는 중입니다."
				status="submitting"
				testID="submit-state"
				title="예약 요청 중"
			/>,
		);

		// When & Then
		expect(screen.getByText("Submitting")).toBeTruthy();
		expect(screen.getByTestId("submit-state").props.accessibilityState).toEqual(
			expect.objectContaining({
				busy: true,
			}),
		);
	});
});
