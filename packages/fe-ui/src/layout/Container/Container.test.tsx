import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Container } from "./Container";

describe("Container", () => {
	it("Given default props When rendered Then page width and centering classes are applied", () => {
		render(<Container>콘텐츠</Container>);

		const element = screen.getByText("콘텐츠").closest("div");
		expect(element?.className).toContain("mx-auto");
		expect(element?.className).toContain("w-full");
		expect(element?.className).toContain("max-w-7xl");
	});

	it("Given each width role When rendered Then matching max-width class is applied", () => {
		const widthCases = [
			{ width: "narrow", expected: "max-w-[40rem]" },
			{ width: "content", expected: "max-w-4xl" },
			{ width: "page", expected: "max-w-7xl" },
			{ width: "wide", expected: "max-w-[96rem]" },
			{ width: "full", expected: "max-w-none" },
		] as const;

		for (const { width, expected } of widthCases) {
			const { unmount } = render(<Container width={width}>콘텐츠</Container>);
			const element = screen.getByText("콘텐츠").closest("div");
			expect(element?.className).toContain(expected);
			unmount();
		}
	});

	it("Given containerQuery true When rendered Then container query class is applied", () => {
		render(
			<Container containerQuery>
				<div className="@md:flex-row">콘텐츠</div>
			</Container>,
		);

		const element = screen.getByText("콘텐츠").closest("div")?.parentElement;
		expect(element?.className).toContain("@container");
	});

	it("Given containerQuery omitted When rendered Then container query class is absent", () => {
		render(<Container>콘텐츠</Container>);

		const element = screen.getByText("콘텐츠").closest("div");
		expect(element?.className).not.toContain("@container");
	});

	it("Given className When rendered Then extra class is combined with structural classes", () => {
		render(<Container className="py-8">콘텐츠</Container>);

		const element = screen.getByText("콘텐츠").closest("div");
		expect(element?.className).toContain("py-8");
		expect(element?.className).toContain("mx-auto");
		expect(element?.className).toContain("max-w-7xl");
	});

	it("Given children When rendered Then container does not own vertical rhythm classes", () => {
		render(<Container>콘텐츠</Container>);

		const element = screen.getByText("콘텐츠").closest("div");
		expect(element?.className).not.toContain("flex-col");
		expect(element?.className).not.toMatch(/(^|\s)gap-/);
	});
});
