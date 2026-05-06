import { render, screen } from "@testing-library/react-native";
import RootLayout from "@/app/_layout";

const mockSetIdpBaseUrl = jest.fn();
const mockSetIdpLoginRedirectUrl = jest.fn();
const mockSetLoginRedirectUrl = jest.fn();

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

jest.mock("react-native-safe-area-context", () => {
	const React = jest.requireActual<typeof import("react")>("react");
	const { View } =
		jest.requireActual<typeof import("react-native")>("react-native");

	return {
		SafeAreaProvider: ({ children }) =>
			React.createElement(
				View,
				{ accessibilityLabel: "safe-area-provider" },
				children,
			),
	};
});

jest.mock("@cocrepo/api/idp/client", () => ({
	setIdpBaseUrl: (...args: string[]) => mockSetIdpBaseUrl(...args),
	setIdpLoginRedirectUrl: (...args: string[]) =>
		mockSetIdpLoginRedirectUrl(...args),
}));

jest.mock("@cocrepo/api/core/client", () => ({
	setLoginRedirectUrl: (...args: string[]) => mockSetLoginRedirectUrl(...args),
}));

jest.mock("@/auth/auth-config", () => ({
	getIdpApiBaseUrl: () => "http://localhost:3207",
	getLoginPath: () => "/auth/login",
}));

jest.mock("expo-splash-screen", () => ({
	preventAutoHideAsync: jest.fn(),
}));

jest.mock("@/auth/AuthSessionGate", () => {
	const React = jest.requireActual<typeof import("react")>("react");
	const { Text, View } =
		jest.requireActual<typeof import("react-native")>("react-native");

	return {
		AuthSessionGate: ({ children }: { children: any }) =>
			React.createElement(
				View,
				{ accessibilityLabel: "auth-session-gate" },
				React.createElement(Text, null, "auth-session-gate"),
				children,
			),
	};
});

jest.mock("expo-router", () => {
	const React = jest.requireActual<typeof import("react")>("react");
	const { Text } =
		jest.requireActual<typeof import("react-native")>("react-native");

	return {
		usePathname: () => "/",
		useRouter: () => ({
			replace: jest.fn(),
		}),
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
	beforeEach(() => {
		mockSetIdpBaseUrl.mockReset();
		mockSetIdpLoginRedirectUrl.mockReset();
		mockSetLoginRedirectUrl.mockReset();
	});

	it("gesture root 안에서 design system provider, AuthSessionGate, header hidden stack 을 렌더링해야 한다", () => {
		render(<RootLayout />);

		expect(mockSetLoginRedirectUrl).toHaveBeenCalledWith("/auth/login");
		expect(mockSetIdpBaseUrl).toHaveBeenCalledWith("http://localhost:3207");
		expect(mockSetIdpLoginRedirectUrl).toHaveBeenCalledWith("/auth/login");
		expect(screen.getByLabelText("gesture-root")).toBeTruthy();
		expect(screen.getByLabelText("safe-area-provider")).toBeTruthy();
		expect(screen.getByLabelText("design-system-provider")).toBeTruthy();
		expect(screen.getByLabelText("auth-session-gate")).toBeTruthy();
		expect(screen.getByText("stack-header-hidden")).toBeTruthy();
	});
});
