import { render, screen } from "@testing-library/react";
import { ResponsiveFrame } from "./ResponsiveFrame";

describe("ResponsiveFrame", () => {
	it("Given mo size When 렌더링하면 Then 모바일 기준 고정 너비를 제공한다", () => {
		render(
			<ResponsiveFrame data-testid="responsive-frame" size="mo">
				content
			</ResponsiveFrame>,
		);

		const frame = screen.getByTestId("responsive-frame");

		expect(frame).toHaveStyle({ width: "375px" });
		expect(frame).toHaveTextContent("content");
	});

	it("Given fo size When 렌더링하면 Then FO 기준 고정 너비를 제공한다", () => {
		render(<ResponsiveFrame data-testid="responsive-frame" size="fo" />);

		expect(screen.getByTestId("responsive-frame")).toHaveStyle({
			width: "1200px",
		});
	});

	it("Given 직접 width와 className When 렌더링하면 Then preset 대신 지정 너비와 className을 적용한다", () => {
		render(
			<ResponsiveFrame
				className="border border-border"
				data-testid="responsive-frame"
				size="mo"
				width="42rem"
			/>,
		);

		const frame = screen.getByTestId("responsive-frame");

		expect(frame).toHaveStyle({ width: "42rem" });
		expect(frame.className).toContain("min-w-0");
		expect(frame.className).toContain("border border-border");
	});
});
