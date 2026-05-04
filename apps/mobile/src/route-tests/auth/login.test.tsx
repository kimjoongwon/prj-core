import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import * as authUtils from "@/auth/_utils/auth";
import LoginPage from "@/app/auth/login";
import { mobileAuthStore } from "@/auth/auth-store";

const mockReplace = jest.fn();

const LOGIN_URL =
	"https://idp-web/api/v1/auth/login?clientId=idp-web&returnTo=prjcore%3A%2F%2Fauth%2Fcallback%3FreturnTo%3D%2Fdashboard";
const CALLBACK_URL =
	"prjcore://auth/callback?code=auth-code&state=auth-state&returnTo=%2Fdashboard";

jest.mock("@cocrepo/mo-ui", () => {
	const React = jest.requireActual<typeof import("react")>("react");
	const { Pressable, Text } =
		jest.requireActual<typeof import("react-native")>("react-native");

	return {
		Button: ({ children, onPress, isDisabled }: any) => (
			<Pressable onPress={isDisabled ? undefined : onPress}>
				<Text>{children}</Text>
			</Pressable>
		),
	};
});

jest.mock("expo-router", () => ({
	useLocalSearchParams: () => ({ returnTo: "/dashboard" }),
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
		jest.spyOn(authUtils, "parseAuthLoginParams").mockReturnValue({
			returnTo: "/dashboard",
			clientId: "idp-web",
		});
		jest.spyOn(authUtils, "buildAuthLoginUrl").mockReturnValue(LOGIN_URL);
		jest
			.spyOn(mobileAuthStore, "setNextPathAfterLogin")
			.mockImplementation(() => undefined);
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it("진입 즉시 외부 브라우저가 아니라 WebView에 로그인 URL을 로드해야 한다", async () => {
		render(<LoginPage />);

		await waitFor(() => {
			expect(screen.getByLabelText("auth-login-webview").props.source).toEqual({
				uri: LOGIN_URL,
			});
		});

		expect(mobileAuthStore.setNextPathAfterLogin).toHaveBeenCalledWith("/dashboard");
		expect(screen.getByText("오노라 로그인")).toBeTruthy();
		expect(LOGIN_URL).toContain("returnTo=prjcore");
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
				returnTo: "/dashboard",
			},
		});
	});

	it("Android WebView용 localhost 리다이렉트를 에뮬레이터 host로 보정해야 한다", () => {
		const redirectedUrl =
			"http://localhost:3207/oidc/auth?client_id=idp-web";

		expect(
			authUtils.rewriteLocalhostUrlForAndroidEmulator(
				redirectedUrl,
				"android",
			),
		).toBe("http://10.0.2.2:3207/oidc/auth?client_id=idp-web");
		expect(
			authUtils.rewriteLocalhostUrlForAndroidEmulator(
				redirectedUrl,
				"ios",
			),
		).toBe(redirectedUrl);
	});

	it("WebView 로딩 실패 시 재시도 버튼으로 동일 URL을 다시 로드해야 한다", async () => {
		render(<LoginPage />);

		const webView = screen.getByLabelText("auth-login-webview");
		fireEvent(webView, "error", {
			nativeEvent: { description: "network error" },
		});

		const retryButton = await waitFor(() => screen.getByText("오노라 로그인 다시 시도"));
		fireEvent.press(retryButton);

		await waitFor(() => {
			expect(screen.getByLabelText("auth-login-webview").props.source).toEqual({
				uri: LOGIN_URL,
			});
		});
	});
});
