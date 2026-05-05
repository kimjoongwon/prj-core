import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import HomeScreen from "@/app/index";
import { mobileAuthStore } from "@/auth/auth-store";

const mockReplace = jest.fn();

jest.mock("@cocrepo/mo-ui", () => {
	const React = jest.requireActual<typeof import("react")>("react");
	const { runInAction } = jest.requireActual<typeof import("mobx")>("mobx");
	const { Pressable, Text, View } =
		jest.requireActual<typeof import("react-native")>("react-native");

	return {
		Button: ({ children, onPress }: any) =>
			React.createElement(Pressable, { onPress }, React.createElement(Text, null, children)),
		ScreenFrame: ({ children }: any) =>
			React.createElement(View, { accessibilityLabel: "screen-frame" }, children),
		Tabs: ({ options, path, state }: any) =>
			React.createElement(
				View,
				{ accessibilityLabel: "bottom-tabs" },
				options.map((option: any) =>
					React.createElement(
						Pressable,
						{
							key: option.value,
							onPress: () => {
								runInAction(() => {
									state[path] = option.value;
								});
							},
						},
						React.createElement(Text, null, option.text),
					),
				),
			),
	};
});

jest.mock("expo-router", () => ({
	useRouter: () => ({
		replace: mockReplace,
	}),
}));

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

	it("예약 플랫폼 하단 탭 홈 화면을 렌더링해야 한다", () => {
		render(<HomeScreen />);

		expect(screen.getByText("오노라")).toBeTruthy();
		expect(screen.getByText("오늘의 예약을 한눈에")).toBeTruthy();
		expect(screen.getByText("오늘 일정")).toBeTruthy();
		expect(screen.getByText("홈")).toBeTruthy();
		expect(screen.getByText("예약")).toBeTruthy();
		expect(screen.getByText("내 정보")).toBeTruthy();
		expect(screen.queryByText("모바일 컴포넌트 인벤토리")).toBeNull();
	});

	it("예약 탭과 내 정보 탭을 전환해야 한다", () => {
		render(<HomeScreen />);

		fireEvent.press(screen.getByText("예약"));
		expect(screen.getByText("내 예약")).toBeTruthy();
		expect(screen.getByText("스튜디오 촬영 상담")).toBeTruthy();

		fireEvent.press(screen.getByText("내 정보"));
		expect(screen.getByText("로그인 상태")).toBeTruthy();
		expect(screen.getByText("로그인됨")).toBeTruthy();
		expect(screen.getByText("로그아웃")).toBeTruthy();
	});

	it("내 정보 탭 로그아웃 버튼을 누르면 세션을 종료하고 로그인 화면으로 이동해야 한다", async () => {
		render(<HomeScreen />);

		fireEvent.press(screen.getByText("내 정보"));
		fireEvent.press(screen.getByText("로그아웃"));

		await waitFor(() => {
			expect(mockReplace).toHaveBeenCalledWith("/auth/login");
		});
		expect(mobileAuthStore.logout).toHaveBeenCalled();
	});
});
