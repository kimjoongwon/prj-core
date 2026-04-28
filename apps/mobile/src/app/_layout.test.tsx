import { render, screen } from "@testing-library/react-native";
import RootLayout from "./_layout";

jest.mock("@cocrepo/mo-ui", () => {
	const React = jest.requireActual<typeof import("react")>("react");
	const { View } =
		jest.requireActual<typeof import("react-native")>("react-native");

	return {
		DesignSystemProvider: ({ children }) =>
			React.createElement(
				View,
				{ accessibilityLabel: "design-system-provider" },
				children,
			),
	};
});

jest.mock("expo-router", () => {
	const React = jest.requireActual<typeof import("react")>("react");
	const { Text } =
		jest.requireActual<typeof import("react-native")>("react-native");

	return {
		Stack: ({ screenOptions }) =>
			React.createElement(
				Text,
				null,
				screenOptions?.headerShown === false ? "stack-header-hidden" : "stack",
			),
	};
});

jest.mock("react-native-gesture-handler", () => {
	const React = jest.requireActual<typeof import("react")>("react");
	const { View } =
		jest.requireActual<typeof import("react-native")>("react-native");

	return {
		GestureHandlerRootView: ({ children }) =>
			React.createElement(View, { accessibilityLabel: "gesture-root" }, children),
	};
});

describe("mobile root layout", () => {
	it("gesture root 안에서 design system provider 와 header hidden stack 을 렌더링해야 한다", () => {
		render(<RootLayout />);

		expect(screen.getByLabelText("gesture-root")).toBeTruthy();
		expect(screen.getByLabelText("design-system-provider")).toBeTruthy();
		expect(screen.getByText("stack-header-hidden")).toBeTruthy();
	});
});
