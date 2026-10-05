import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
	it("renders the canonical variant and content contract", () => {
		render(
			<Button
				variant="primary"
				startContent={<span data-testid="start-content" />}
				endContent={<span data-testid="end-content" />}
			>
				저장
			</Button>,
		);

		expect(screen.getByRole("button", { name: "저장" })).toBeInTheDocument();
		expect(screen.getByTestId("start-content")).toBeInTheDocument();
		expect(screen.getByTestId("end-content")).toBeInTheDocument();
	});
});
