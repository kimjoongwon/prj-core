import { fireEvent, render, screen } from "@testing-library/react-native";
import { type ReactNode } from "react";
import { DesignSystemProvider } from "../../design-system/provider";
import { MyPageScreen } from "./MyPageScreen";

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

describe("MyPageScreen", () => {
	it("계정 상태, 현재 지점, 빠른 이동 목록을 렌더링해야 한다", () => {
		renderWithDesignSystem(
			<MyPageScreen
				accountDescription="예약 알림과 계정 상태를 관리합니다."
				currentSpaceName="광화문 스튜디오"
				displayName="회원"
				isAuthenticated
				onPressLogout={jest.fn()}
				quickActions={[
					{
						description: "예약 확정과 대기 상태를 확인합니다.",
						iconName: "calendarCheck",
						id: "reservations",
						label: "내 예약",
						onPress: jest.fn(),
					},
				]}
			/>,
		);

		expect(screen.getByText("회원")).toBeTruthy();
		expect(screen.getByText("로그인됨")).toBeTruthy();
		expect(screen.getByText("광화문 스튜디오")).toBeTruthy();
		expect(screen.getByText("내 예약")).toBeTruthy();
	});

	it("로그아웃 이벤트를 위임해야 한다", () => {
		const onPressLogout = jest.fn();

		renderWithDesignSystem(
			<MyPageScreen
				accountDescription="예약 알림과 계정 상태를 관리합니다."
				currentSpaceName="지점 선택 필요"
				displayName="회원"
				isAuthenticated={false}
				onPressLogout={onPressLogout}
				quickActions={[]}
			/>,
		);

		fireEvent.press(screen.getByText("로그아웃"));

		expect(onPressLogout).toHaveBeenCalledTimes(1);
	});
});
