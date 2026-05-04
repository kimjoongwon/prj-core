import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import DashboardPage from "@/app/dashboard";
import { mobileAuthStore } from "@/auth/auth-store";

const mockReplace = jest.fn();

jest.mock("@cocrepo/mo-ui", () => {
	const React = jest.requireActual<typeof import("react")>("react");
	const { Pressable, Text } =
		jest.requireActual<typeof import("react-native")>("react-native");

	return {
		Button: ({ children, onPress }: any) =>
			React.createElement(Pressable, { onPress }, React.createElement(Text, null, children)),
	};
});

jest.mock("expo-router", () => ({
	useRouter: () => ({
		replace: mockReplace,
	}),
}));

describe("mobile dashboard route", () => {
	beforeEach(() => {
		mockReplace.mockReset();
		mobileAuthStore.authStatus = "authenticated";
		mobileAuthStore.isAuthenticated = true;
		jest.spyOn(mobileAuthStore, "logout").mockResolvedValue(undefined);
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it("인증 상태면 로그아웃 버튼 클릭 시 로그아웃 후 로그인 화면으로 이동해야 한다", async () => {
		render(<DashboardPage />);

		expect(screen.getByText("모바일 대시보드")).toBeTruthy();
		expect(screen.getByText("상태: 인증됨")).toBeTruthy();

		const logoutButton = screen.getByText("로그아웃");
		fireEvent.press(logoutButton);

		await waitFor(() => {
			expect(mockReplace).toHaveBeenCalledWith("/auth/login");
		});

		expect(mobileAuthStore.logout).toHaveBeenCalled();
	});
});
