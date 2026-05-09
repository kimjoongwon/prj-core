import type { ReactElement } from "react";
import { ScreenFrame, type ScreenFrameProps } from "./index";

jest.mock("react-native", () => ({
	View: "View",
}));

jest.mock("react-native-safe-area-context", () => ({
	useSafeAreaInsets: () => ({
		bottom: 30,
		left: 40,
		right: 20,
		top: 10,
	}),
}));

describe("ScreenFrame", () => {
	const renderScreenFrame = (props: ScreenFrameProps) =>
		(
			ScreenFrame as unknown as {
				render: (props: ScreenFrameProps, ref: null) => ReactElement;
			}
		).render(props, null);

	it("기본 edge safe-area padding과 배경색을 적용해야 한다", () => {
		const frame = renderScreenFrame({
			accessibilityLabel: "screen-frame",
			backgroundColor: "#0c0f0b",
			children: "content",
		});

		expect(frame.props.style).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					backgroundColor: "#0c0f0b",
					paddingBottom: 30,
					paddingLeft: 40,
					paddingRight: 20,
					paddingTop: 10,
				}),
			]),
		);
		expect(frame.props.className).toBe("flex-1");
	});

	it("선택한 edge에만 safe-area padding을 적용해야 한다", () => {
		const frame = renderScreenFrame({
			accessibilityLabel: "screen-frame",
			backgroundColor: "#020617",
			children: "content",
			edges: ["top", "bottom"],
		});

		expect(frame.props.style).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					backgroundColor: "#020617",
					paddingBottom: 30,
					paddingLeft: 0,
					paddingRight: 0,
					paddingTop: 10,
				}),
			]),
		);
	});
});
