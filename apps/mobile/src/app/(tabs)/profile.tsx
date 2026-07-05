import { MyPageScreen, type QuickActionListItem } from "@cocrepo/mo-ui";
import type { Href } from "expo-router";
import { useRouter } from "expo-router";
import { observer } from "mobx-react-lite";
import { mobileSession } from "@/auth/mobile-session";
import { mobileApiScope } from "@/auth/mobile-api-scope";

const ProfileTabRoute = observer(() => {
	const router = useRouter();

	/**
	 * 내 예약 빠른 이동 행을 눌렀을 때 예약 탭으로 이동합니다.
	 *
	 * @returns 예약 탭 이동 side effect
	 */
	const onPressMyReservationsAction = () => {
		router.push("/reservations" as Href);
	};

	const quickActions: QuickActionListItem[] = [
		{
			description: "예약 확정과 대기 상태를 확인합니다.",
			iconName: "calendarCheck",
			id: "reservations",
			label: "내 예약",
			onPress: onPressMyReservationsAction,
		},
		{
			description: "예약 알림과 앱 설정 관리는 다음 단계에서 제공합니다.",
			disabled: true,
			iconName: "info",
			id: "settings",
			label: "알림/설정",
		},
	];

	/**
	 * 로그아웃 버튼을 눌렀을 때 native session을 정리하고 로그인 화면으로 이동합니다.
	 *
	 * @returns 로그아웃 후 login route 이동 side effect
	 */
	const onPressLogoutButton = async () => {
		await mobileSession.logout();
		router.replace("/auth/login" as Href);
	};

	return (
		<MyPageScreen
			accountDescription="오노라 예약 알림과 계정 상태를 관리합니다."
			currentSpaceName={mobileApiScope.groundName ?? "지점 선택 필요"}
			displayName="회원"
			isAuthenticated={mobileSession.isAuthenticated}
			isLogoutPending={mobileSession.isVerifying}
			onPressLogout={onPressLogoutButton}
			quickActions={quickActions}
		/>
	);
});

export default ProfileTabRoute;
