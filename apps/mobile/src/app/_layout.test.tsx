import { render, screen } from "@testing-library/react-native";

jest.mock("@cocrepo/mo-ui", () => {
	const React = require("react");
	const { View } = require("react-native");

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
	const React = require("react");
	const { Text } = require("react-native");

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
	const React = require("react");
	const { View } = require("react-native");

	return {
		GestureHandlerRootView: ({ children }) =>
			React.createElement(View, { accessibilityLabel: "gesture-root" }, children),
	};
});

import RootLayout from "./_layout";

describe("mobile root layout", () => {
	it("gesture root 안에서 design system provider 와 header hidden stack 을 렌더링해야 한다", () => {
		render(<RootLayout />);

		expect(screen.getByLabelText("gesture-root")).toBeTruthy();
		expect(screen.getByLabelText("design-system-provider")).toBeTruthy();
		expect(screen.getByText("stack-header-hidden")).toBeTruthy();
	});
});
