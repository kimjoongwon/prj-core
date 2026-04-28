import { render, screen } from "@testing-library/react-native";
import HomeScreen from "./index";

jest.mock("@cocrepo/mo-ui", () => {
	const React = jest.requireActual<typeof import("react")>("react");
	const { Text } =
		jest.requireActual<typeof import("react-native")>("react-native");

	return {
		Button: ({ children }) => React.createElement(Text, null, children),
	};
});

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
	it("인벤토리 홈 화면의 핵심 섹션을 렌더링해야 한다", () => {
		render(<HomeScreen />);

		expect(screen.getByText("모바일 컴포넌트 인벤토리")).toBeTruthy();
		expect(screen.getByText("Button Showcase")).toBeTruthy();
		expect(screen.getAllByText("Control").length).toBeGreaterThan(0);
		expect(screen.getAllByText("Display").length).toBeGreaterThan(0);
		expect(screen.getAllByText("Layout").length).toBeGreaterThan(0);
		expect(screen.getByText("현재 상태")).toBeTruthy();
	});
});
