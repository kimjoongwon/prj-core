import { render, screen } from "@testing-library/react-native";
import RootLayout from "@/app/_layout";
import type { ComponentType, ReactNode } from "react";

type ChildrenProps = {
	children?: ReactNode;
};

type HeaderProps = {
	title?: string;
};

type StackProps = ChildrenProps & {
	screenOptions?: {
		header?: unknown;
	};
};

type StackScreenProps = {
	name: string;
	options?: {
		headerShown?: boolean;
	};
};

const mockSetIdpBaseUrl = jest.fn();
const mockSetIdpLoginRedirectUrl = jest.fn();
const mockSetLoginRedirectUrl = jest.fn();
const mockSetApiPersistStore = jest.fn();
const mockSetIdpPersistStore = jest.fn();
const mockSetUniwindTheme = jest.fn();

jest.mock("@cocrepo/mo-ui", () => {
	const React = jest.requireActual<typeof import("react")>("react");
	const { Text, View } =
		jest.requireActual<typeof import("react-native")>("react-native");
	const { useQueryClient } =
		jest.requireActual<typeof import("@tanstack/react-query")>(
			"@tanstack/react-query",
		);

	return {
		DesignSystemProvider: ({ children }: ChildrenProps) => {
			const queryClient = useQueryClient();
			const ProviderView = View as unknown as ComponentType<
				ChildrenProps & {
					accessibilityLabel: string;
					queryClientReady: boolean;
				}
			>;

			return React.createElement(
				ProviderView,
				{
					accessibilityLabel: "design-system-provider",
					queryClientReady: Boolean(queryClient),
				},
				children,
			);
		},
		CustomHeader: ({ title }: HeaderProps) =>
			React.createElement(Text, null, `custom-header:${title ?? ""}`),
	};
});

jest.mock("react-native-safe-area-context", () => {
	const React = jest.requireActual<typeof import("react")>("react");
	const { View } =
		jest.requireActual<typeof import("react-native")>("react-native");

	return {
		SafeAreaProvider: ({ children }: ChildrenProps) =>
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
	setIdpPersistStore: (...args: unknown[]) => mockSetIdpPersistStore(...args),
}));

jest.mock("@cocrepo/api/core/client", () => ({
	setApiPersistStore: (...args: unknown[]) => mockSetApiPersistStore(...args),
	setLoginRedirectUrl: (...args: string[]) => mockSetLoginRedirectUrl(...args),
}));

jest.mock("@/auth/auth-config", () => ({
	getIdpApiBaseUrl: () => "http://localhost:3207",
	getLoginPath: () => "/auth/login",
}));

jest.mock("expo-splash-screen", () => ({
	preventAutoHideAsync: jest.fn(),
}));

jest.mock("uniwind", () => ({
	Uniwind: {
		setTheme: (...args: string[]) => mockSetUniwindTheme(...args),
	},
}));

jest.mock("@/auth/AuthSessionGate", () => {
	const React = jest.requireActual<typeof import("react")>("react");
	const { Text, View } =
		jest.requireActual<typeof import("react-native")>("react-native");

	return {
		AuthSessionGate: ({ children }: ChildrenProps) =>
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
	const { Text, View } =
		jest.requireActual<typeof import("react-native")>("react-native");

	const StackScreen = ({ name, options }: StackScreenProps) =>
		React.createElement(
			Text,
			null,
			options?.headerShown === false ? `${name}:header-hidden` : name,
		);

	StackScreen.displayName = "StackScreen";
	const Stack = Object.assign(
		({ children, screenOptions }: StackProps) =>
			React.createElement(View, null, [
				React.createElement(
					Text,
					{ key: "stack-mode" },
					typeof screenOptions?.header === "function"
						? "stack-custom-header"
						: "stack",
				),
				children,
			]),
		{ Screen: StackScreen },
	);

	return {
		usePathname: () => "/",
		useRouter: () => ({
			replace: jest.fn(),
		}),
		Stack,
	};
});

jest.mock("react-native-gesture-handler", () => {
	const React = jest.requireActual<typeof import("react")>("react");
	const { View } =
		jest.requireActual<typeof import("react-native")>("react-native");

	return {
		GestureHandlerRootView: ({ children }: ChildrenProps) =>
			React.createElement(View, { accessibilityLabel: "gesture-root" }, children),
	};
});

describe("mobile root layout", () => {
	beforeEach(() => {
		mockSetIdpBaseUrl.mockReset();
		mockSetIdpLoginRedirectUrl.mockReset();
		mockSetLoginRedirectUrl.mockReset();
		mockSetApiPersistStore.mockReset();
		mockSetIdpPersistStore.mockReset();
		mockSetUniwindTheme.mockReset();
	});

	it("gesture root 안에서 design system provider, AuthSessionGate, custom header stack 을 렌더링해야 한다", () => {
		render(<RootLayout />);

		expect(mockSetUniwindTheme).toHaveBeenCalledWith("system");
		expect(mockSetLoginRedirectUrl).toHaveBeenCalledWith("/auth/login");
		expect(mockSetIdpBaseUrl).toHaveBeenCalledWith("http://localhost:3207");
		expect(mockSetIdpLoginRedirectUrl).toHaveBeenCalledWith("/auth/login");
		expect(screen.getByLabelText("gesture-root")).toBeTruthy();
		expect(screen.getByLabelText("safe-area-provider")).toBeTruthy();
		expect(
			screen.getByLabelText("design-system-provider").props.queryClientReady,
		).toBe(true);
		expect(screen.getByLabelText("auth-session-gate")).toBeTruthy();
		expect(screen.getByText("stack-custom-header")).toBeTruthy();
		expect(screen.getByText("(tabs):header-hidden")).toBeTruthy();
		expect(screen.getByText("auth/login:header-hidden")).toBeTruthy();
		expect(screen.getByText("select-space:header-hidden")).toBeTruthy();
		expect(screen.getByText("payments/checkout")).toBeTruthy();
	});
});
