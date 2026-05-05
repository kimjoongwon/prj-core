import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import CallbackPage from "@/app/auth/callback";
import * as authUtils from "@/auth/_utils/auth";
import { mobileAuthStore } from "@/auth/auth-store";

const mockReplace = jest.fn();
const mockUseLocalSearchParams = jest.fn();

jest.mock("@cocrepo/mo-ui", () => {
	const React = jest.requireActual<typeof import("react")>("react");
	const { Pressable, Text } =
		jest.requireActual<typeof import("react-native")>("react-native");

	return {
		Button: ({ children, onPress }: any) =>
			React.createElement(Pressable, { onPress }, React.createElement(Text, null, children)),
		ScreenFrame: ({ children }: any) => {
			const { View: MockView } =
				jest.requireActual<typeof import("react-native")>("react-native");

			return React.createElement(
				MockView,
				{ accessibilityLabel: "screen-frame" },
				children,
			);
		},
	};
});

jest.mock("expo-router", () => ({
	useRouter: () => ({
		replace: mockReplace,
	}),
	useLocalSearchParams: () => mockUseLocalSearchParams(),
}));

jest.mock("@cocrepo/api/idp/auth", () => ({
	logout: jest.fn(),
	verifyToken: jest.fn(),
}));

jest.mock("@cocrepo/api/idp/client", () => ({
	setIdpBaseUrl: jest.fn(),
	setIdpLoginRedirectUrl: jest.fn(),
}));

describe("mobile auth callback route", () => {
	beforeEach(() => {
		mockReplace.mockReset();
		mockUseLocalSearchParams.mockReset();
		jest.spyOn(authUtils, "verifySession").mockReset();
		jest
			.spyOn(mobileAuthStore, "verifySession")
			.mockReset()
			.mockResolvedValue(true);
	});

	afterEach(() => {
		jest.useRealTimers();
		jest.restoreAllMocks();
	});

	it("콜백 에러 파라미터가 있으면 실패 상태를 표시해야 한다", async () => {
		(authUtils.verifySession as jest.Mock).mockResolvedValue({
			status: "error",
			nextRoute: "/",
			message: "로그인 처리 중 오류가 발생했습니다.",
		});

		mockUseLocalSearchParams.mockReturnValue({
			error: "access_denied",
			error_description: "사용자 거부",
		});
		render(<CallbackPage />);

		await waitFor(() => {
			expect(screen.getByText("로그인 처리 중 오류가 발생했습니다.")).toBeTruthy();
			expect(screen.getByText("로그인 다시 시도")).toBeTruthy();
			expect(screen.queryByText(/복귀 경로/)).toBeNull();
		});
	});

	it("세션 검증 성공 시 다음 경로로 이동해야 한다", async () => {
		mockUseLocalSearchParams.mockReturnValue({ returnTo: "/" });
		(authUtils.verifySession as jest.Mock).mockResolvedValue({
			status: "success",
			nextRoute: "/",
			message: "성공",
			exchange: undefined,
		});

		render(<CallbackPage />);

		await waitFor(() => {
			expect(mockReplace).toHaveBeenCalledWith("/");
		});
		expect(authUtils.verifySession).toHaveBeenCalledWith(
			{ returnTo: "/" },
			expect.objectContaining({
				clientId: "user-mobile",
				callbackScheme: "onora-mobile",
			}),
		);
		expect(mobileAuthStore.verifySession).toHaveBeenCalled();
	});

	it("콜백 성공 후 앱 세션 검증이 실패하면 홈으로 이동하지 않아야 한다", async () => {
		mockUseLocalSearchParams.mockReturnValue({ returnTo: "/" });
		(authUtils.verifySession as jest.Mock).mockResolvedValue({
			status: "success",
			nextRoute: "/",
			message: "성공",
			exchange: undefined,
		});
		(mobileAuthStore.verifySession as jest.Mock).mockResolvedValue(false);

		render(<CallbackPage />);

		await waitFor(() => {
			expect(
				screen.getByText(
					"로그인은 완료됐지만 앱에서 세션을 확인하지 못했습니다. 다시 로그인해 주세요.",
				),
			).toBeTruthy();
		});
		expect(mockReplace).not.toHaveBeenCalled();
	});

	it("세션 검증 실패 시 재시도 버튼으로 로그인 라우트를 노출해야 한다", async () => {
		mockUseLocalSearchParams.mockReturnValue({ returnTo: "/" });
		(authUtils.verifySession as jest.Mock).mockResolvedValue({
			status: "error",
			nextRoute: "/",
			message: "실패",
			exchange: undefined,
		});

		render(<CallbackPage />);

		await waitFor(() => {
			expect(screen.getByText("실패")).toBeTruthy();
		});

		const retryButton = screen.getByText("로그인 다시 시도");
		fireEvent.press(retryButton);

		expect(mockReplace).toHaveBeenCalledWith({
			pathname: "/auth/login",
			params: { returnTo: "/" },
		});
	});
});
