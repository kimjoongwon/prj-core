import { render, screen } from "@testing-library/react";
import { Surface } from "./Surface";

describe("Surface", () => {
	it("renders the default local panel as a clean light surface", () => {
		render(<Surface>panel</Surface>);

		const surface = screen.getByText("panel").closest("[data-slot='surface']");

		expect(surface).toHaveClass("bg-white");
		expect(surface).toHaveClass("border-border/70");
		expect(surface).toHaveClass("dark:bg-neutral-700/95");
	});

	it("keeps caller className overrides after the default surface palette", () => {
		render(<Surface className="bg-danger">warning</Surface>);

		const surface = screen
			.getByText("warning")
			.closest("[data-slot='surface']");

		expect(surface).toHaveClass("bg-danger");
	});
});
