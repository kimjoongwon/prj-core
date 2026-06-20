import type { ReactElement } from "react";
import { VStack, type VStackProps } from "./index";

jest.mock("react-native", () => ({
	View: "View",
}));

describe("VStack", () => {
	const renderVStack = (props: VStackProps): ReactElement<VStackProps> =>
		(
			VStack as unknown as {
				render: (props: VStackProps, ref: null) => ReactElement;
			}
		).render(props, null) as ReactElement<VStackProps>;

	it("기본 세로 리듬과 section gap을 적용해야 한다", () => {
		const stack = renderVStack({
			accessibilityLabel: "vertical-stack",
			children: "content",
		});

		expect(stack.props.className).toContain("flex-col");
		expect(stack.props.className).toContain("gap-4");
	});

	it("정렬, 너비, semantic gap을 className으로 조합해야 한다", () => {
		const stack = renderVStack({
			alignItems: "center",
			children: "content",
			className: "px-4",
			fullWidth: true,
			gap: "roomy",
			justifyContent: "between",
		});

		expect(stack.props.className).toContain("items-center");
		expect(stack.props.className).toContain("justify-between");
		expect(stack.props.className).toContain("w-full");
		expect(stack.props.className).toContain("gap-6");
		expect(stack.props.className).toContain("px-4");
	});
});
