import type { ReactElement } from "react";
import { HStack, type HStackProps } from "./index";

jest.mock("react-native", () => ({
	View: "View",
}));

describe("HStack", () => {
	const renderHStack = (props: HStackProps): ReactElement<HStackProps> =>
		(
			HStack as unknown as {
				render: (props: HStackProps, ref: null) => ReactElement;
			}
		).render(props, null) as ReactElement<HStackProps>;

	it("기본 가로 리듬과 inline gap을 적용해야 한다", () => {
		const stack = renderHStack({
			accessibilityLabel: "horizontal-stack",
			children: "content",
		});

		expect(stack.props.className).toContain("flex-row");
		expect(stack.props.className).toContain("gap-2");
	});

	it("정렬, 너비, numeric gap을 className으로 조합해야 한다", () => {
		const stack = renderHStack({
			alignItems: "center",
			children: "content",
			className: "px-3",
			fullWidth: true,
			gap: 5,
			justifyContent: "between",
		});

		expect(stack.props.className).toContain("items-center");
		expect(stack.props.className).toContain("justify-between");
		expect(stack.props.className).toContain("w-full");
		expect(stack.props.className).toContain("gap-5");
		expect(stack.props.className).toContain("px-3");
	});
});
