import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import ProfileTabRoute from "@/app/(tabs)/profile";
import { mobileAuthStore } from "@/auth/auth-store";

const mockReplace = jest.fn();

jest.mock("@cocrepo/mo-ui", () => {
	const React = jest.requireActual<typeof import("react")>("react");
	const { Pressable, Text, View } =
		jest.requireActual<typeof import("react-native")>("react-native");

	return {
		Button: ({ children, onPress }: any) =>
			React.createElement(Pressable, { onPress }, React.createElement(Text, null, children)),
		ScreenFrame: ({ children }: any) =>
			React.createElement(View, { accessibilityLabel: "screen-frame" }, children),
	};
});

jest.mock("expo-router", () => ({
	useRouter: () => ({
		replace: mockReplace,
	}),
}));

describe("mobile profile tab route", () => {
	beforeEach(() => {
		mockReplace.mockReset();
		mobileAuthStore.authStatus = "authenticated";
		mobileAuthStore.isAuthenticated = true;
		mobileAuthStore.isVerifying = false;
		jest.spyOn(mobileAuthStore, "logout").mockResolvedValue(undefined);
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it("내 정보 탭에 로그아웃 버튼을 제공해야 한다", () => {
		render(<ProfileTabRoute />);

		expect(screen.getByText("내 정보")).toBeTruthy();
		expect(screen.getByText("로그인 상태")).toBeTruthy();
		expect(screen.getByText("로그인됨")).toBeTruthy();
		expect(screen.getByText("로그아웃")).toBeTruthy();
	});

	it("로그아웃 버튼을 누르면 세션을 종료하고 로그인 화면으로 이동해야 한다", async () => {
		render(<ProfileTabRoute />);

		fireEvent.press(screen.getByText("로그아웃"));

		await waitFor(() => {
			expect(mockReplace).toHaveBeenCalledWith("/auth/login");
		});
		expect(mobileAuthStore.logout).toHaveBeenCalled();
	});
});
