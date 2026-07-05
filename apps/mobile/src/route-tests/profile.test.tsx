import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import ProfileTabRoute from "@/app/(tabs)/profile";
import { mobileSession } from "@/auth/mobile-session";
import { mobileApiScope } from "@/auth/mobile-api-scope";
import { runInAction } from "mobx";

const mockPush = jest.fn();
const mockReplace = jest.fn();

interface ProfileQuickAction {
	disabled?: boolean;
	id: string;
	label?: string;
	onPress?: () => void;
}

interface MyPageScreenProps {
	currentSpaceName?: string;
	isAuthenticated?: boolean;
	onPressLogout?: () => void;
	quickActions: ProfileQuickAction[];
}

jest.mock("@cocrepo/mo-ui", () => {
	const React = jest.requireActual<typeof import("react")>("react");
	const { Pressable, Text, View } =
		jest.requireActual<typeof import("react-native")>("react-native");

	return {
		MyPageScreen: ({
			currentSpaceName,
			isAuthenticated,
			onPressLogout,
			quickActions,
		}: MyPageScreenProps) =>
			React.createElement(
				View,
				{ accessibilityLabel: "my-page-screen" },
				React.createElement(
					Text,
					null,
					isAuthenticated ? "로그인됨" : "확인 필요",
				),
				React.createElement(Text, null, currentSpaceName),
				quickActions.map((item) =>
					React.createElement(
						Pressable,
						{
							disabled: item.disabled,
							key: item.id,
							onPress: item.onPress,
						},
						React.createElement(Text, null, item.label),
					),
				),
				React.createElement(
					Pressable,
					{ onPress: onPressLogout },
					React.createElement(Text, null, "로그아웃"),
				),
			),
	};
});

jest.mock("expo-router", () => ({
	useRouter: () => ({
		push: mockPush,
		replace: mockReplace,
	}),
}));

describe("mobile profile tab route", () => {
	beforeEach(() => {
		mockPush.mockReset();
		mockReplace.mockReset();
		runInAction(() => {
			mobileSession.authStatus = "authenticated";
			mobileSession.isAuthenticated = true;
			mobileSession.isVerifying = false;
			mobileApiScope.setSpaceInfo({
				groundName: "광화문 스튜디오",
				spaceId: "space-1",
				tenantId: "tenant-1",
			});
		});
		jest.spyOn(mobileSession, "logout").mockResolvedValue(undefined);
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it("마이 페이지 screen에 인증 상태와 현재 지점, 빠른 이동을 전달해야 한다", () => {
		render(<ProfileTabRoute />);

		expect(screen.getByText("로그인됨")).toBeTruthy();
		expect(screen.getByText("광화문 스튜디오")).toBeTruthy();
		expect(screen.getByText("내 예약")).toBeTruthy();
		expect(screen.getByText("알림/설정")).toBeTruthy();
		expect(screen.getByText("로그아웃")).toBeTruthy();
	});

	it("내 예약 빠른 이동을 누르면 예약 탭으로 이동해야 한다", () => {
		render(<ProfileTabRoute />);

		fireEvent.press(screen.getByText("내 예약"));

		expect(mockPush).toHaveBeenCalledWith("/reservations");
	});

	it("로그아웃 버튼을 누르면 세션을 종료하고 로그인 화면으로 이동해야 한다", async () => {
		render(<ProfileTabRoute />);

		fireEvent.press(screen.getByText("로그아웃"));

		await waitFor(() => {
			expect(mockReplace).toHaveBeenCalledWith("/auth/login");
		});
		expect(mobileSession.logout).toHaveBeenCalled();
	});
});
