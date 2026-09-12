import type { ReactElement } from "react";
import { ResponsiveFrame, type ResponsiveFrameProps } from "./index";

describe("ResponsiveFrame", () => {
	const renderResponsiveFrame = (
		props: ResponsiveFrameProps,
	): ReactElement<ResponsiveFrameProps> =>
		(
			ResponsiveFrame as unknown as {
				render: (props: ResponsiveFrameProps, ref: null) => ReactElement;
			}
		).render(props, null) as ReactElement<ResponsiveFrameProps>;

	it("Given mo size When 렌더링하면 Then 모바일 기준 고정 너비를 제공해야 한다", () => {
		const frame = renderResponsiveFrame({
			accessibilityLabel: "responsive-frame",
			children: "content",
			size: "mo",
		});

		expect(frame.props.style).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					width: 375,
				}),
			]),
		);
		expect(frame.props.children).toBe("content");
	});

	it("Given 직접 width와 className When 렌더링하면 Then 지정 너비와 className을 적용해야 한다", () => {
		const frame = renderResponsiveFrame({
			children: "content",
			className: "border border-border",
			size: "fo",
			width: 480,
		});

		expect(frame.props.className).toContain("min-w-0");
		expect(frame.props.className).toContain("border border-border");
		expect(frame.props.style).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					width: 480,
				}),
			]),
		);
	});
});
