import { render, screen } from "@testing-library/react-native";
import ReservationsTabRoute from "@/app/(tabs)/reservations";

jest.mock("@cocrepo/mo-ui", () => {
	const React = jest.requireActual<typeof import("react")>("react");
	const { View } =
		jest.requireActual<typeof import("react-native")>("react-native");

	return {
		ScreenFrame: ({ children }: any) =>
			React.createElement(View, { accessibilityLabel: "screen-frame" }, children),
	};
});

describe("mobile reservations tab route", () => {
	it("예약 탭에서 다가오는 예약 목록을 렌더링해야 한다", () => {
		render(<ReservationsTabRoute />);

		expect(screen.getByText("내 예약")).toBeTruthy();
		expect(screen.getByText("요청부터 확정까지 다가오는 예약을 확인합니다.")).toBeTruthy();
		expect(screen.getByText("스튜디오 촬영 상담")).toBeTruthy();
	});
});
