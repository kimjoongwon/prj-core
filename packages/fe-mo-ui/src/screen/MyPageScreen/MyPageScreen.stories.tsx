import type { Meta, StoryObj } from "@storybook/react-native";
import { MyPageScreen } from "./MyPageScreen";

const meta = {
	title: "screen/MyPageScreen",
	component: MyPageScreen,
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof MyPageScreen>;

export default meta;

type Story = StoryObj<typeof MyPageScreen>;

export const Default: Story = {
	args: {
		accountDescription: "Plate 예약 알림과 계정 상태를 관리합니다.",
		currentSpaceName: "광화문 스튜디오",
		displayName: "회원",
		isAuthenticated: true,
		quickActions: [
			{
				description: "예약 확정과 대기 상태를 확인합니다.",
				iconName: "calendarCheck",
				id: "reservations",
				label: "내 예약",
				onPress: () => undefined,
			},
			{
				description: "예약 알림과 앱 설정 관리는 다음 단계에서 제공합니다.",
				disabled: true,
				iconName: "info",
				id: "settings",
				label: "알림/설정",
			},
		],
	},
};

export const LogoutPending: Story = {
	args: {
		...Default.args,
		isLogoutPending: true,
	},
};
