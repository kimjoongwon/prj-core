import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import LoginPage from "@/app/auth/login";
import * as authUtils from "@/auth/_utils/auth";
import { mobileAuthStore } from "@/auth/auth-store";
import { mobileApiScopeStore } from "@/auth/mobile-api-scope";

const mockReplace = jest.fn();
const mockUseLocalSearchParams = jest.fn();

jest.mock("expo-secure-store", () => ({
	deleteItemAsync: jest.fn(),
	getItemAsync: jest.fn(async () => null),
	setItemAsync: jest.fn(),
}));

jest.mock("@cocrepo/mo-ui", () => {
	const React = jest.requireActual<typeof import("react")>("react");
	const { Pressable, Text: MockText, View } =
		jest.requireActual<typeof import("react-native")>("react-native");

	return {
		Button: ({ children, onPress, isDisabled, ...props }: any) =>
			React.createElement(
				Pressable,
				{
					...props,
					accessibilityRole: "button",
					disabled: isDisabled,
					onPress,
				},
				typeof children === "string"
					? React.createElement(MockText, null, children)
					: children,
			),
		Icon: ({ name }: any) =>
			React.createElement(MockText, null, `icon:${name}`),
		ScreenFrame: ({ children }: any) =>
			React.createElement(
				View,
				{ accessibilityLabel: "screen-frame" },
				children,
			),
		Spinner: () => React.createElement(MockText, null, "loading-spinner"),
	};
});

jest.mock("expo-router", () => ({
	useLocalSearchParams: () => mockUseLocalSearchParams(),
	useRouter: () => ({
		replace: mockReplace,
	}),
}));

describe("mobile auth login route", () => {
	beforeEach(() => {
		mockReplace.mockReset();
		mockUseLocalSearchParams.mockReset();
		mockUseLocalSearchParams.mockReturnValue({ returnTo: "/" });
		mobileApiScopeStore.clear();
		jest
			.spyOn(mobileAuthStore, "setNextPathAfterLogin")
			.mockImplementation(() => undefined);
		jest
			.spyOn(mobileAuthStore, "loginWithCredentials")
			.mockResolvedValue(true);
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it("WebView 없이 native 입력 폼을 렌더링해야 한다", () => {
		render(<LoginPage />);

		expect(screen.getAllByText("로그인").length).toBeGreaterThan(0);
		expect(screen.getByLabelText("이메일")).toBeTruthy();
		expect(screen.getByLabelText("비밀번호")).toBeTruthy();
		expect(screen.queryByLabelText("auth-login-webview")).toBeNull();
	});

	it("로그인 버튼을 누르면 native credential 로그인을 요청해야 한다", async () => {
		render(<LoginPage />);

		fireEvent.changeText(screen.getByLabelText("이메일"), " user@example.com ");
		fireEvent.changeText(screen.getByLabelText("비밀번호"), "password123");
		fireEvent.press(screen.getByLabelText("login-submit"));

		await waitFor(() => {
			expect(mobileAuthStore.loginWithCredentials).toHaveBeenCalledWith(
				"user@example.com",
				"password123",
			);
		});
		expect(mobileAuthStore.setNextPathAfterLogin).toHaveBeenCalledWith("/");
		expect(mockReplace).toHaveBeenCalledWith("/");
	});

	it("로그인 후 지점 선택이 미확정이면 지점 선택 라우트로 이동해야 한다", async () => {
		mobileApiScopeStore.markSpaceSelectionPending();
		render(<LoginPage />);

		fireEvent.changeText(screen.getByLabelText("이메일"), "user@example.com");
		fireEvent.changeText(screen.getByLabelText("비밀번호"), "password123");
		fireEvent.press(screen.getByLabelText("login-submit"));

		await waitFor(() => {
			expect(mockReplace).toHaveBeenCalledWith({
				pathname: "/select-space",
				params: { returnTo: "/" },
			});
		});
	});

	it("IDP 웹 경로 returnTo가 들어오면 모바일 홈으로 정규화해야 한다", async () => {
		mockUseLocalSearchParams.mockReturnValue({ returnTo: "/dashboard" });
		render(<LoginPage />);

		fireEvent.changeText(screen.getByLabelText("이메일"), "user@example.com");
		fireEvent.changeText(screen.getByLabelText("비밀번호"), "password123");
		fireEvent.press(screen.getByLabelText("login-submit"));

		await waitFor(() => {
			expect(mobileAuthStore.setNextPathAfterLogin).toHaveBeenCalledWith("/");
		});
		expect(mockReplace).toHaveBeenCalledWith("/");
	});

	it("credential이 비어 있으면 API 요청 없이 오류를 보여줘야 한다", async () => {
		render(<LoginPage />);

		fireEvent.press(screen.getByLabelText("login-submit"));

		await waitFor(() => {
			expect(screen.getByText("이메일과 비밀번호를 입력해 주세요.")).toBeTruthy();
		});
		expect(mobileAuthStore.loginWithCredentials).not.toHaveBeenCalled();
	});

	it("native 로그인 실패 메시지를 화면에 표시해야 한다", async () => {
		jest
			.spyOn(mobileAuthStore, "loginWithCredentials")
			.mockRejectedValue(new Error("이메일 또는 비밀번호가 올바르지 않습니다."));
		render(<LoginPage />);

		fireEvent.changeText(screen.getByLabelText("이메일"), "user@example.com");
		fireEvent.changeText(screen.getByLabelText("비밀번호"), "wrong-password");
		fireEvent.press(screen.getByLabelText("login-submit"));

		await waitFor(() => {
			expect(
				screen.getByText("이메일 또는 비밀번호가 올바르지 않습니다."),
			).toBeTruthy();
		});
	});

	it("Android localhost 보정 유틸은 유지해야 한다", () => {
		const redirectedUrl =
			"http://localhost:3006/api/v1/auth/native/login";

		expect(
			authUtils.rewriteLocalhostUrlForAndroidEmulator(redirectedUrl, "android"),
		).toBe("http://10.0.2.2:3006/api/v1/auth/native/login");
		expect(
			authUtils.rewriteLocalhostUrlForAndroidEmulator(redirectedUrl, "ios"),
		).toBe(redirectedUrl);
	});
});
