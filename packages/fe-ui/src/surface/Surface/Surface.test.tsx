import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Surface } from "./Surface";

describe("Surface", () => {
	it("renders the default local panel as a clean light surface", () => {
		render(<Surface>panel</Surface>);

		const surface = screen.getByText("panel").closest("[data-slot='surface']");

		expect(surface).toHaveClass("bg-surface");
		expect(surface).toHaveClass("border-border");
		expect(surface).toHaveClass("text-surface-foreground");
		expect(surface).toHaveClass("shadow-none");
	});

	it("renders tertiary panels with the secondary surface palette", () => {
		render(<Surface variant="tertiary">tertiary panel</Surface>);

		const surface = screen
			.getByText("tertiary panel")
			.closest("[data-slot='surface']");

		expect(surface).toHaveClass("bg-surface-secondary");
		expect(surface).toHaveClass("text-surface-secondary-foreground");
	});

	it("keeps caller className overrides after the default surface palette", () => {
		render(<Surface className="bg-danger">warning</Surface>);

		const surface = screen
			.getByText("warning")
			.closest("[data-slot='surface']");

		expect(surface).toHaveClass("bg-danger");
	});
});
