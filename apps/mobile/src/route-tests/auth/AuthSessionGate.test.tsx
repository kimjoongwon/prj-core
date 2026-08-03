import { Text } from "@cocrepo/mo-ui";
import { act, render, screen, waitFor } from "@testing-library/react-native";
import * as SplashScreen from "expo-splash-screen";
import * as SecureStore from "expo-secure-store";
import { AuthSessionGate } from "@/auth/AuthSessionGate";
import { mobileSession } from "@/auth/mobile-session";
import { mobileApiScope } from "@/auth/mobile-api-scope";

const mockReplace = jest.fn();
let mockPathname = "/";
const mockGetCurrentSpace = jest.fn();
const mockGetMySpaces = jest.fn();
const mockSetApiNativeRefreshHandler = jest.fn();
const mockSetApiSessionScope = jest.fn();
const mockSetIdpNativeRefreshHandler = jest.fn();
const mockSetIdpSessionScope = jest.fn();
const mockVerifyToken = jest.fn();

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
	getCurrentSpace: (...args: unknown[]) => mockGetCurrentSpace(...args),
	getMySpaces: (...args: unknown[]) => mockGetMySpaces(...args),
	logout: jest.fn(),
	verifyToken: (...args: unknown[]) => mockVerifyToken(...args),
}));

jest.mock("@cocrepo/api/core/client", () => ({
	setApiNativeRefreshHandler: (...args: unknown[]) =>
		mockSetApiNativeRefreshHandler(...args),
	setApiSessionScope: (...args: unknown[]) =>
		mockSetApiSessionScope(...args),
}));

jest.mock("@cocrepo/api/idp/client", () => ({
	setIdpBaseUrl: jest.fn(),
	setIdpLoginRedirectUrl: jest.fn(),
	setIdpNativeRefreshHandler: (...args: unknown[]) =>
		mockSetIdpNativeRefreshHandler(...args),
	setIdpSessionScope: (...args: unknown[]) =>
		mockSetIdpSessionScope(...args),
}));

jest.mock("expo-secure-store", () => ({
	deleteItemAsync: jest.fn(async () => undefined),
	getItemAsync: jest.fn(async () => null),
	setItemAsync: jest.fn(async () => undefined),
}));

const resetMobileSession = () => {
	mobileSession.authStatus = "unknown";
	mobileSession.isAuthenticated = false;
	mobileSession.isVerifying = false;
	mobileSession.lastFailure = "";
	mobileSession.nextPathAfterLogin = "/";
	mobileApiScope.clear();
};

describe("AuthSessionGate", () => {
	beforeEach(() => {
		mockPathname = "/";
		mockReplace.mockReset();
		mockGetCurrentSpace.mockReset();
		mockGetMySpaces.mockReset();
		mockSetApiNativeRefreshHandler.mockReset();
		mockSetApiSessionScope.mockReset();
		mockSetIdpNativeRefreshHandler.mockReset();
		mockSetIdpSessionScope.mockReset();
		mockVerifyToken.mockReset();
		(SecureStore.getItemAsync as jest.Mock).mockImplementation(async () => null);
		(SecureStore.setItemAsync as jest.Mock).mockClear();
		(SecureStore.deleteItemAsync as jest.Mock).mockClear();
		resetMobileSession();
		(SplashScreen.hideAsync as jest.Mock).mockClear();
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it("인증 상태가 unknown이면 세션 확인 전까지 화면과 splash hide를 보류한다", async () => {
		const verifySessionSpy = jest
			.spyOn(mobileSession, "verifySession")
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

	it("세션 검증 시 현재 Space를 Core API 요청 scope에 연결한다", async () => {
		const currentSpace = {
			id: "101",
			tenantId: "201",
			contentLanguageCode: "ko_KR",
			fitnessCenter: {
				address: "서울 강남구",
				company: {
					logoImageFileId: "company-logo-branch",
				},
				name: "강남점",
			},
		};
		(SecureStore.getItemAsync as jest.Mock).mockImplementation(
			async (key: string) =>
				key.includes("space-selection")
					? JSON.stringify({
							address: "서울 강남구",
							contentLanguageCode: "ko_KR",
							fitnessCenterName: "강남점",
							spaceId: "101",
							tenantId: "201",
							version: 2,
						})
					: null,
		);
		mockVerifyToken.mockResolvedValue({
			data: {
				accessTokenExpiresAt: Date.now() + 60_000,
				refreshTokenExpiresAt: Date.now() + 120_000,
				valid: true,
			},
		});
		mockGetMySpaces.mockResolvedValue({ data: [currentSpace] });
		mockGetCurrentSpace.mockResolvedValue({ data: currentSpace });
		mobileApiScope.setSessionTokens({
			accessToken: "mobile-access-token",
			refreshToken: "mobile-refresh-token",
			sessionId: "user-mobile.session-1",
		});

		const verified = await mobileSession.verifySession();

		expect(verified).toBe(true);
		expect(mobileSession.authStatus).toBe("authenticated");
		expect(mobileApiScope.tenantId).toBe("201");
		expect(mobileApiScope.spaceId).toBe("101");
		expect(mobileApiScope.fitnessCenterName).toBe("강남점");
		expect(mobileApiScope.isSpaceSelectionResolved).toBe(true);
		expect(mockGetCurrentSpace).toHaveBeenCalled();
		expect(mockSetApiSessionScope).toHaveBeenCalledWith(mobileApiScope);
		expect(mockSetIdpSessionScope).toHaveBeenCalledWith(mobileApiScope);
		expect(mockSetApiNativeRefreshHandler).toHaveBeenCalled();
		expect(mockSetIdpNativeRefreshHandler).toHaveBeenCalled();
	});

	it("인증됐지만 지점 선택이 미확정이면 지점 선택 라우트로 보낸다", async () => {
		mobileSession.authStatus = "authenticated";
		mobileApiScope.markSpaceSelectionPending();

		render(
			<AuthSessionGate>
				<Text>home-screen</Text>
			</AuthSessionGate>,
		);

		await waitFor(() => {
			expect(mockReplace).toHaveBeenCalledWith({
				pathname: "/select-space",
				params: { returnTo: "/" },
			});
		});
		expect(screen.queryByText("home-screen")).toBeNull();
	});

	it("비인증 상태면 로그인 라우트를 먼저 보낸 뒤 layout 이후 splash를 끈다", async () => {
		mobileSession.authStatus = "unauthenticated";
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
		mobileSession.authStatus = "authenticated";

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
		mobileSession.authStatus = "authenticated";

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
		mobileSession.authStatus = "unauthenticated";

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
