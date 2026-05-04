import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import HomeScreen from "@/app/index";
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

jest.mock("react-native-safe-area-context", () => {
	const React = jest.requireActual<typeof import("react")>("react");
	const { View } =
		jest.requireActual<typeof import("react-native")>("react-native");

	return {
		SafeAreaView: ({ children }) =>
			React.createElement(View, { accessibilityLabel: "safe-area" }, children),
	};
});

describe("mobile index route", () => {
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

	it("인벤토리 홈 화면의 핵심 섹션을 렌더링해야 한다", () => {
		render(<HomeScreen />);

		expect(screen.getByText("모바일 컴포넌트 인벤토리")).toBeTruthy();
		expect(screen.getByText("현재 세션")).toBeTruthy();
		expect(screen.getByText("인증됨")).toBeTruthy();
		expect(screen.getByText("로그아웃")).toBeTruthy();
		expect(screen.getByText("Button Showcase")).toBeTruthy();
		expect(screen.getAllByText("Action").length).toBeGreaterThan(0);
		expect(screen.getAllByText("Input").length).toBeGreaterThan(0);
		expect(screen.getAllByText("Selection").length).toBeGreaterThan(0);
		expect(screen.getAllByText("Navigation").length).toBeGreaterThan(0);
		expect(screen.getAllByText("Display").length).toBeGreaterThan(0);
		expect(screen.getAllByText("Layout").length).toBeGreaterThan(0);
		expect(screen.getByText("현재 상태")).toBeTruthy();
	});

	it("로그아웃 버튼을 누르면 세션을 종료하고 로그인 화면으로 이동해야 한다", async () => {
		render(<HomeScreen />);

		fireEvent.press(screen.getByText("로그아웃"));

		await waitFor(() => {
			expect(mockReplace).toHaveBeenCalledWith("/auth/login");
		});
		expect(mobileAuthStore.logout).toHaveBeenCalled();
	});
});
