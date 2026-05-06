import { act, render, screen, waitFor } from "@testing-library/react-native";
import { Text } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { AuthSessionGate } from "@/auth/AuthSessionGate";
import { mobileAuthStore } from "@/auth/auth-store";

const mockReplace = jest.fn();
let mockPathname = "/";

jest.mock("expo-router", () => ({
	usePathname: () => mockPathname,
	useRouter: () => ({
		replace: mockReplace,
	}),
}));

jest.mock("expo-splash-screen", () => ({
	hideAsync: jest.fn(() => Promise.resolve(true)),
}));

jest.mock("@cocrepo/api/idp/auth", () => ({
	logout: jest.fn(),
	verifyToken: jest.fn(),
}));

jest.mock("@cocrepo/api/idp/client", () => ({
	setIdpBaseUrl: jest.fn(),
	setIdpLoginRedirectUrl: jest.fn(),
}));

const resetAuthStore = () => {
	mobileAuthStore.authStatus = "unknown";
	mobileAuthStore.isAuthenticated = false;
	mobileAuthStore.isVerifying = false;
	mobileAuthStore.lastFailure = "";
	mobileAuthStore.nextPathAfterLogin = "/";
};

describe("AuthSessionGate", () => {
	beforeEach(() => {
		mockPathname = "/";
		mockReplace.mockReset();
		resetAuthStore();
		(SplashScreen.hideAsync as jest.Mock).mockClear();
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it("인증 상태가 unknown이면 세션 확인 전까지 화면과 splash hide를 보류한다", async () => {
		const verifySessionSpy = jest
			.spyOn(mobileAuthStore, "verifySession")
			.mockResolvedValue(false);

		render(
			<AuthSessionGate>
				<Text>home-screen</Text>
			</AuthSessionGate>,
		);

		await waitFor(() => {
			expect(verifySessionSpy).toHaveBeenCalled();
		});

		expect(screen.queryByText("home-screen")).toBeNull();
		expect(SplashScreen.hideAsync).not.toHaveBeenCalled();
	});

	it("비인증 상태면 로그인 라우트를 먼저 보낸 뒤 layout 이후 splash를 끈다", async () => {
		mobileAuthStore.authStatus = "unauthenticated";
		const view = render(
			<AuthSessionGate>
				<Text>login-screen</Text>
			</AuthSessionGate>,
		);

		await waitFor(() => {
			expect(mockReplace).toHaveBeenCalledWith({
				pathname: "/auth/login",
				params: { returnTo: "/" },
			});
		});
		expect(screen.queryByText("login-screen")).toBeNull();

		mockPathname = "/auth/login";
		view.rerender(
			<AuthSessionGate>
				<Text>login-screen</Text>
			</AuthSessionGate>,
		);

		expect(screen.getByText("login-screen")).toBeTruthy();

		act(() => {
			screen.getByLabelText("auth-session-ready").props.onLayout();
		});

		await waitFor(() => {
			expect(SplashScreen.hideAsync).toHaveBeenCalled();
		});
	});

	it("인증 상태에서 로그인 라우트에 있으면 홈 라우트를 먼저 보낸다", async () => {
		mockPathname = "/auth/login";
		mobileAuthStore.authStatus = "authenticated";

		render(
			<AuthSessionGate>
				<Text>login-screen</Text>
			</AuthSessionGate>,
		);

		await waitFor(() => {
			expect(mockReplace).toHaveBeenCalledWith("/");
		});
		expect(screen.queryByText("login-screen")).toBeNull();
	});

	it("인증 상태에서 모바일 탭이 아닌 웹 경로에 있으면 홈으로 보낸다", async () => {
		mockPathname = "/dashboard";
		mobileAuthStore.authStatus = "authenticated";

		render(
			<AuthSessionGate>
				<Text>idp-dashboard-screen</Text>
			</AuthSessionGate>,
		);

		await waitFor(() => {
			expect(mockReplace).toHaveBeenCalledWith("/");
		});
		expect(screen.queryByText("idp-dashboard-screen")).toBeNull();
	});

	it("비인증 상태에서 모바일 탭이 아닌 웹 경로에 있으면 returnTo를 홈으로 보정한다", async () => {
		mockPathname = "/dashboard";
		mobileAuthStore.authStatus = "unauthenticated";

		render(
			<AuthSessionGate>
				<Text>idp-dashboard-screen</Text>
			</AuthSessionGate>,
		);

		await waitFor(() => {
			expect(mockReplace).toHaveBeenCalledWith({
				pathname: "/auth/login",
				params: { returnTo: "/" },
			});
		});
		expect(screen.queryByText("idp-dashboard-screen")).toBeNull();
	});
});
