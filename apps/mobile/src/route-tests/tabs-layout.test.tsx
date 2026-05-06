import { render, screen } from "@testing-library/react-native";
import MainTabsLayout from "@/app/(tabs)/_layout";

jest.mock("expo-router", () => {
	const React = jest.requireActual<typeof import("react")>("react");
	const { Text, View } =
		jest.requireActual<typeof import("react-native")>("react-native");

	function MockTabs({ children, screenOptions }: any) {
		return React.createElement(
			View,
			{
				accessibilityLabel:
					screenOptions?.headerShown === false
						? "expo-tabs-header-hidden"
						: "expo-tabs",
			},
			children,
		);
	}

	function MockTabsScreen({ name, options }: any) {
		return React.createElement(Text, null, `${name}:${options.title}`);
	}

	MockTabs.Screen = MockTabsScreen;

	return { Tabs: MockTabs };
});

describe("mobile expo tabs layout", () => {
	it("홈, 예약, 내 정보 라우트를 Expo Router Tabs로 등록해야 한다", () => {
		render(<MainTabsLayout />);

		expect(screen.getByLabelText("expo-tabs-header-hidden")).toBeTruthy();
		expect(screen.getByText("index:홈")).toBeTruthy();
		expect(screen.getByText("reservations:예약")).toBeTruthy();
		expect(screen.getByText("profile:내 정보")).toBeTruthy();
	});
});
