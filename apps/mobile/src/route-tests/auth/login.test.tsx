import { render, screen, waitFor } from "@testing-library/react-native";
import LoginPage from "@/app/auth/login";
import * as authUtils from "@/auth/_utils/auth";
import { mobileAuthStore } from "@/auth/auth-store";

const mockReplace = jest.fn();
const mockUseLocalSearchParams = jest.fn();

const CALLBACK_URL =
	"onora-mobile://auth/callback?code=auth-code&state=auth-state&returnTo=%2F";

jest.mock("@cocrepo/mo-ui", () => {
	const React = jest.requireActual<typeof import("react")>("react");
	const { View } =
		jest.requireActual<typeof import("react-native")>("react-native");

	return {
		ScreenFrame: ({ children }: any) =>
			React.createElement(View, { accessibilityLabel: "screen-frame" }, children),
	};
});

jest.mock("expo-router", () => ({
	useLocalSearchParams: () => mockUseLocalSearchParams(),
	useRouter: () => ({
		replace: mockReplace,
	}),
}));

jest.mock("react-native-webview", () => {
	const React = jest.requireActual<typeof import("react")>("react");
	const { Text, View } =
		jest.requireActual<typeof import("react-native")>("react-native");

	return {
		WebView: (props: any) =>
			React.createElement(
				View,
				{ ...props, accessibilityLabel: "auth-login-webview" },
				React.createElement(Text, null, props.source?.uri),
			),
	};
});

describe("mobile auth login route", () => {
	beforeEach(() => {
		mockReplace.mockReset();
		mockUseLocalSearchParams.mockReset();
		mockUseLocalSearchParams.mockReturnValue({ returnTo: "/" });
		jest
			.spyOn(mobileAuthStore, "setNextPathAfterLogin")
			.mockImplementation(() => undefined);
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it("full-screen WebView에 user-mobile 로그인 URL만 로드해야 한다", async () => {
		render(<LoginPage />);

		await waitFor(() => {
			const source = screen.getByLabelText("auth-login-webview").props.source;

			expect(source.uri).toContain("/api/v1/auth/login");
			expect(source.uri).toContain("clientId=user-mobile");
			expect(source.uri).toContain("onora-mobile");
		});

		expect(mobileAuthStore.setNextPathAfterLogin).toHaveBeenCalledWith("/");
		expect(screen.queryByText("로그인 계속")).toBeNull();
	});

	it("WebView에서 callback scheme을 감지하면 앱 내부 callback 라우트로 이동해야 한다", async () => {
		render(<LoginPage />);

		const shouldStart = screen.getByLabelText("auth-login-webview").props
			.onShouldStartLoadWithRequest;
		const shouldContinue = shouldStart({ url: CALLBACK_URL });

		expect(shouldContinue).toBe(false);
		expect(mockReplace).toHaveBeenCalledWith({
			pathname: "/auth/callback",
			params: {
				code: "auth-code",
				state: "auth-state",
				returnTo: "/",
			},
		});
	});

	it("Android WebView용 localhost 리다이렉트를 에뮬레이터 host로 보정해야 한다", () => {
		const redirectedUrl =
			"http://localhost:3007/oidc/auth?client_id=user-mobile";

		expect(
			authUtils.rewriteLocalhostUrlForAndroidEmulator(
				redirectedUrl,
				"android",
			),
		).toBe("http://10.0.2.2:3007/oidc/auth?client_id=user-mobile");
		expect(
			authUtils.rewriteLocalhostUrlForAndroidEmulator(redirectedUrl, "ios"),
		).toBe(redirectedUrl);
	});
});
