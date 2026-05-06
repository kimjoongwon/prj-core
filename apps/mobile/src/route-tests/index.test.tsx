import { render, screen } from "@testing-library/react-native";
import HomeTabRoute from "@/app/(tabs)/index";

jest.mock("@cocrepo/mo-ui", () => {
	const React = jest.requireActual<typeof import("react")>("react");
	const { View } =
		jest.requireActual<typeof import("react-native")>("react-native");

	return {
		ScreenFrame: ({ children }: any) =>
			React.createElement(View, { accessibilityLabel: "screen-frame" }, children),
	};
});

describe("mobile home tab route", () => {
	it("예약 플랫폼 홈 탭 화면을 렌더링해야 한다", () => {
		render(<HomeTabRoute />);

		expect(screen.getByText("오노라")).toBeTruthy();
		expect(screen.getByText("오늘의 예약을 한눈에")).toBeTruthy();
		expect(screen.getByText("오늘 일정")).toBeTruthy();
		expect(screen.getByText("헤어 케어 예약")).toBeTruthy();
		expect(screen.queryByText("모바일 컴포넌트 인벤토리")).toBeNull();
	});
});
