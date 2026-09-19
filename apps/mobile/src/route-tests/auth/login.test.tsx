import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import LoginScreen from "@/app/auth/login";
import * as authUtils from "@/auth/_utils/auth";
import { mobileSession } from "@/auth/mobile-session";
import { mobileApiScope } from "@/auth/mobile-api-scope";

const mockReplace = jest.fn();
const mockUseLocalSearchParams = jest.fn();

jest.mock("expo-secure-store", () => ({
	deleteItemAsync: jest.fn(),
	getItemAsync: jest.fn(async () => null),
	setItemAsync: jest.fn(),
}));

jest.mock("@/auth/oidc/oidc-login", () => ({
	openOidcAuthPage: jest.fn(),
}));

jest.mock("@cocrepo/mo-ui", () => {
	const React = jest.requireActual<typeof import("react")>("react");
	const { Pressable, Text: MockText, View } =
		jest.requireActual<typeof import("react-native")>("react-native");

	type ButtonProps = {
		children?: React.ReactNode;
		onPress?: () => void;
		isDisabled?: boolean;
		[key: string]: unknown;
	};

	return {
		Button: ({ children, onPress, isDisabled, ...props }: ButtonProps) =>
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
		Icon: ({ name }: { name: string }) =>
			React.createElement(MockText, null, `icon:${name}`),
		ScreenFrame: ({ children }: { children?: React.ReactNode }) =>
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
		mobileApiScope.clear();
		jest
			.spyOn(mobileSession, "setNextPathAfterLogin")
			.mockImplementation(() => undefined);
		jest.spyOn(mobileSession, "loginWithOidc").mockResolvedValue(true);
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it("IDP 시트 로그인 버튼을 렌더링해야 한다", () => {
		render(<LoginScreen />);

		expect(screen.getAllByText("로그인").length).toBeGreaterThan(0);
		expect(screen.getByLabelText("oidc-login-submit")).toBeTruthy();
		expect(screen.queryByLabelText("이메일")).toBeNull();
	});

	it("IDP 로그인 버튼을 누르면 OIDC 시트 로그인을 요청해야 한다", async () => {
		render(<LoginScreen />);

		fireEvent.press(screen.getByLabelText("oidc-login-submit"));

		await waitFor(() => {
			expect(mobileSession.loginWithOidc).toHaveBeenCalledTimes(1);
		});
		expect(mobileSession.setNextPathAfterLogin).toHaveBeenCalledWith("/");
		expect(mockReplace).toHaveBeenCalledWith("/");
	});

	it("로그인 후 지점 선택이 미확정이면 지점 선택 라우트로 이동해야 한다", async () => {
		mobileApiScope.markSpaceSelectionPending();
		render(<LoginScreen />);

		fireEvent.press(screen.getByLabelText("oidc-login-submit"));

		await waitFor(() => {
			expect(mockReplace).toHaveBeenCalledWith({
				pathname: "/select-space",
				params: { returnTo: "/" },
			});
		});
	});

	it("IDP 웹 경로 returnTo가 들어오면 모바일 홈으로 정규화해야 한다", async () => {
		mockUseLocalSearchParams.mockReturnValue({ returnTo: "/dashboard" });
		render(<LoginScreen />);

		fireEvent.press(screen.getByLabelText("oidc-login-submit"));

		await waitFor(() => {
			expect(mobileSession.setNextPathAfterLogin).toHaveBeenCalledWith("/");
		});
		expect(mockReplace).toHaveBeenCalledWith("/");
	});

	it("로그인 실패 메시지를 화면에 표시해야 한다", async () => {
		jest
			.spyOn(mobileSession, "loginWithOidc")
			.mockRejectedValue(new Error("이메일 또는 비밀번호가 올바르지 않습니다."));
		render(<LoginScreen />);

		fireEvent.press(screen.getByLabelText("oidc-login-submit"));

		await waitFor(() => {
			expect(
				screen.getByText("이메일 또는 비밀번호가 올바르지 않습니다."),
			).toBeTruthy();
		});
	});

	it("Android localhost 보정 유틸은 유지해야 한다", () => {
		const redirectedUrl = "http://localhost:3006/api/v1/auth/login";

		expect(
			authUtils.rewriteLocalhostUrlForAndroidEmulator(redirectedUrl, "android"),
		).toBe("http://10.0.2.2:3006/api/v1/auth/login");
		expect(
			authUtils.rewriteLocalhostUrlForAndroidEmulator(redirectedUrl, "ios"),
		).toBe(redirectedUrl);
	});
});
