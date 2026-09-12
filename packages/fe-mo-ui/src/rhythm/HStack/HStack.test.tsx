import type { ReactElement } from "react";
import { HStack, type HStackProps } from "./index";

describe("HStack", () => {
	const renderHStack = (props: HStackProps): ReactElement<HStackProps> =>
		(
			HStack as unknown as {
				render: (props: HStackProps, ref: null) => ReactElement;
			}
		).render(props, null) as ReactElement<HStackProps>;

	it("기본 가로 리듬과 gap을 적용해야 한다", () => {
		const stack = renderHStack({
			accessibilityLabel: "horizontal-stack",
			children: "content",
		});

		expect(stack.props.className).toContain("flex-row");
		expect(stack.props.className).toContain("gap-2");
	});

	it("정렬과 너비를 기본 gap className과 조합해야 한다", () => {
		const stack = renderHStack({
			alignItems: "center",
			children: "content",
			className: "px-3",
			fullWidth: true,
			justifyContent: "between",
		});

		expect(stack.props.className).toContain("items-center");
		expect(stack.props.className).toContain("justify-between");
		expect(stack.props.className).toContain("w-full");
		expect(stack.props.className).toContain("gap-2");
		expect(stack.props.className).toContain("px-3");
	});

	it("시맨틱 gap preset이 DESIGN.md 체계의 className으로 반영되어야 한다", () => {
		const stack = renderHStack({
			children: "content",
			gap: "roomy",
		});

		expect(stack.props.className).toContain("gap-8");
		expect(stack.props.className).not.toContain("gap-2");
	});
});
