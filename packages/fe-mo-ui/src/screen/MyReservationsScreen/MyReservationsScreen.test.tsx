import { fireEvent, render, screen } from "@testing-library/react-native";
import { type ReactNode } from "react";
import { DesignSystemProvider } from "../../design-system/provider";
import {
	MyReservationsScreen,
	type MyReservationsScreenProps,
} from "./MyReservationsScreen";

jest.mock("react-native-safe-area-context", () => ({
	SafeAreaListener: ({ children }: { children: ReactNode }) => children,
	useSafeAreaInsets: () => ({
		bottom: 0,
		left: 0,
		right: 0,
		top: 0,
	}),
}));

const createProps = (
	overrides: Partial<MyReservationsScreenProps> = {},
): MyReservationsScreenProps => ({
	items: [
		{
			dateLabel: "5월 9일",
			id: "reservation-1",
			metaLabel: "10:00 · Gangnam Studio · Morning Class",
			statusLabel: "예약 확정",
			title: "F45 Strength",
		},
	],
	onPressRetry: jest.fn(),
	status: "ready",
	...overrides,
});

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

describe("MyReservationsScreen", () => {
	it("내 예약 카드 목록을 상태 Chip과 함께 렌더링해야 한다", () => {
		renderWithDesignSystem(<MyReservationsScreen {...createProps()} />);

		expect(screen.getByText("내 예약")).toBeTruthy();
		expect(screen.getByText("F45 Strength")).toBeTruthy();
		expect(screen.getByText("예약 확정")).toBeTruthy();
		expect(
			screen.getByText("10:00 · Gangnam Studio · Morning Class"),
		).toBeTruthy();
	});

	it("empty/error 상태에서 retry 이벤트를 위임해야 한다", () => {
		const onPressRetry = jest.fn();
		const emptyView = renderWithDesignSystem(
			<MyReservationsScreen
				{...createProps({
					items: [],
					onPressRetry,
					status: "empty",
				})}
			/>,
		);

		expect(screen.getByText("아직 예약이 없습니다")).toBeTruthy();
		fireEvent.press(screen.getByLabelText("목록 새로고침"));
		expect(onPressRetry).toHaveBeenCalled();
		emptyView.unmount();

		renderWithDesignSystem(
			<MyReservationsScreen
				{...createProps({
					errorDescription: "권한을 확인해 주세요.",
					items: [],
					onPressRetry,
					status: "error",
				})}
			/>,
		);

		expect(screen.getByText("내 예약을 확인할 수 없습니다")).toBeTruthy();
		fireEvent.press(screen.getByLabelText("다시 시도"));
		expect(onPressRetry).toHaveBeenCalledTimes(2);
	});
});
