import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { UnderConstruction } from "./UnderConstruction";

describe("UnderConstruction", () => {
	it("Given a title When rendered Then it announces the default construction message", () => {
		render(<UnderConstruction title="회원 상세" />);

		expect(screen.getByRole("status")).toHaveTextContent("회원 상세");
		expect(screen.getByText("이 기능은 준비 중입니다.")).toBeInTheDocument();
	});

	it("Given a custom description When rendered Then it shows the provided message", () => {
		render(
			<UnderConstruction
				description="회원 상세 기능을 준비하고 있습니다."
				title="회원 상세"
			/>,
		);

		expect(
			screen.getByText("회원 상세 기능을 준비하고 있습니다."),
		).toBeInTheDocument();
	});
});
