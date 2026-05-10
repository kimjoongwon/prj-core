import { act, render, screen, waitFor } from "@testing-library/react-native";
import { Platform } from "react-native";
import LoginPage from "@/app/auth/login";
import * as authUtils from "@/auth/_utils/auth";
import { mobileAuthStore } from "@/auth/auth-store";

const mockReplace = jest.fn();
const mockUseLocalSearchParams = jest.fn();

const CALLBACK_URL =
	"kr.co.cocdev.onoramobile://auth/callback?code=auth-code&state=auth-state&returnTo=%2F";

jest.mock("@cocrepo/mo-ui", () => {
	const React = jest.requireActual<typeof import("react")>("react");
	const { View } =
		jest.requireActual<typeof import("react-native")>("react-native");

	return {
		ScreenFrame: ({ children }: any) =>
			React.createElement(
				View,
				{ accessibilityLabel: "screen-frame" },
				children,
			),
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
			expect(source.uri).toContain("kr.co.cocdev.onoramobile");
		});

		expect(mobileAuthStore.setNextPathAfterLogin).toHaveBeenCalledWith("/");
		expect(screen.getByLabelText("auth-login-webview").props.incognito).toBe(
			true,
		);
		expect(
			screen.getByLabelText("auth-login-webview").props.sharedCookiesEnabled,
		).toBe(false);
		expect(screen.queryByText("로그인 계속")).toBeNull();
	});

	it("IDP 웹 경로 returnTo가 들어오면 모바일 홈으로 정규화해야 한다", async () => {
		mockUseLocalSearchParams.mockReturnValue({ returnTo: "/dashboard" });

		render(<LoginPage />);

		await waitFor(() => {
			const source = screen.getByLabelText("auth-login-webview").props.source;
			const loginUrl = new URL(source.uri);
			const returnTo = loginUrl.searchParams.get("returnTo") ?? "";

			expect(decodeURIComponent(returnTo)).toBe(
				"kr.co.cocdev.onoramobile://auth/callback?returnTo=/",
			);
			expect(source.uri).not.toContain("dashboard");
		});
		expect(mobileAuthStore.setNextPathAfterLogin).toHaveBeenCalledWith("/");
	});

	it("WebView에서 callback scheme을 감지하면 앱 내부 callback 라우트로 이동해야 한다", async () => {
		render(<LoginPage />);

		const shouldStart =
			screen.getByLabelText("auth-login-webview").props
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

	it("WebView가 IDP Web 로그인 라우트로 드리프트하면 user-mobile 흐름을 다시 로드해야 한다", async () => {
		render(<LoginPage />);

		await waitFor(() => {
			expect(
				screen.getByLabelText("auth-login-webview").props.source.uri,
			).toContain("clientId=user-mobile");
		});

		const shouldStart =
			screen.getByLabelText("auth-login-webview").props
				.onShouldStartLoadWithRequest;
		let shouldContinue = true;

		act(() => {
			shouldContinue = shouldStart({
				url: "http://10.0.2.2:3008/auth/login?returnTo=http%3A%2F%2F10.0.2.2%3A3008%2Fdashboard",
			});
		});

		expect(shouldContinue).toBe(false);
		await waitFor(() => {
			const source = screen.getByLabelText("auth-login-webview").props.source;

			expect(source.uri).toContain("/api/v1/auth/login");
			expect(source.uri).toContain("clientId=user-mobile");
			expect(source.uri).not.toContain("clientId=idp-web");
		});
	});

	it("WebView가 idp-web OIDC authorize URL로 드리프트하면 따라가지 않아야 한다", async () => {
		render(<LoginPage />);

		const shouldStart =
			screen.getByLabelText("auth-login-webview").props
				.onShouldStartLoadWithRequest;
		let shouldContinue = true;

		act(() => {
			shouldContinue = shouldStart({
				url: "http://10.0.2.2:3007/oidc/auth?client_id=idp-web&redirect_uri=http%3A%2F%2F10.0.2.2%3A3008%2Fapi%2Fv1%2Fauth%2Fcallback",
			});
		});

		expect(shouldContinue).toBe(false);
		await waitFor(() => {
			const source = screen.getByLabelText("auth-login-webview").props.source;

			expect(source.uri).toContain("clientId=user-mobile");
		});
	});

	it("Android WebView용 localhost 리다이렉트를 에뮬레이터 host로 보정해야 한다", () => {
		const redirectedUrl =
			"http://localhost:3007/oidc/auth?client_id=user-mobile";

		expect(
			authUtils.rewriteLocalhostUrlForAndroidEmulator(redirectedUrl, "android"),
		).toBe("http://10.0.2.2:3007/oidc/auth?client_id=user-mobile");
		expect(
			authUtils.rewriteLocalhostUrlForAndroidEmulator(redirectedUrl, "ios"),
		).toBe(redirectedUrl);
	});

	it("WebView가 localhost redirect를 에러로 보고해도 에뮬레이터 host로 다시 로드해야 한다", async () => {
		jest.replaceProperty(Platform, "OS", "android");
		render(<LoginPage />);

		const webView = screen.getByLabelText("auth-login-webview");
		const onError = webView.props.onError;
		act(() => {
			onError({
				nativeEvent: {
					url: "http://localhost:3007/oidc/auth?client_id=user-mobile",
				},
			});
		});

		await waitFor(() => {
			expect(screen.getByLabelText("auth-login-webview").props.source.uri).toBe(
				"http://10.0.2.2:3007/oidc/auth?client_id=user-mobile",
			);
		});
	});
});
