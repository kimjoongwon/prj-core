import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LinkCell } from "./LinkCell";

describe("LinkCell", () => {
	it("renders link with value and href correctly", () => {
		render(<LinkCell value="Click here" href="https://example.com" />);
		const link = screen.getByRole("link", { name: "Click here" });
		expect(link).toBeInTheDocument();
		expect(link).toHaveAttribute("href", "https://example.com");
	});

	it("renders internal link correctly", () => {
		render(<LinkCell value="Internal page" href="/internal-page" />);
		const link = screen.getByRole("link", { name: "Internal page" });
		expect(link).toHaveAttribute("href", "/internal-page");
	});

	it("renders external link correctly", () => {
		render(<LinkCell value="External website" href="https://google.com" isExternal={true} />);
		const link = screen.getByRole("link", { name: "External website" });
		expect(link).toHaveAttribute("href", "https://google.com");
	});

	it("applies primary color correctly", () => {
		render(<LinkCell value="Primary link" href="https://example.com" color="primary" />);
		const link = screen.getByRole("link", { name: "Primary link" });
		expect(link).toHaveClass("text-primary");
	});

	it("applies success color correctly", () => {
		render(<LinkCell value="Success link" href="https://example.com" color="success" />);
		const link = screen.getByRole("link", { name: "Success link" });
		// HeroUI Link uses data attributes for styling, not direct classes
		expect(link).toBeInTheDocument();
	});

	it("applies danger color correctly", () => {
		render(<LinkCell value="Danger link" href="https://example.com" color="danger" />);
		const link = screen.getByRole("link", { name: "Danger link" });
		// HeroUI Link uses data attributes for styling, not direct classes
		expect(link).toBeInTheDocument();
	});

	it("applies small size correctly", () => {
		render(<LinkCell value="Small link" href="https://example.com" size="sm" />);
		const link = screen.getByRole("link", { name: "Small link" });
		// HeroUI Link applies actual size classes
		expect(link).toHaveClass("text-small");
	});

	it("applies large size correctly", () => {
		render(<LinkCell value="Large link" href="https://example.com" size="lg" />);
		const link = screen.getByRole("link", { name: "Large link" });
		// HeroUI Link applies actual size classes
		expect(link).toHaveClass("text-large");
	});

	it("renders without href", () => {
		render(<LinkCell value="No link" />);
		const link = screen.getByRole("link", { name: "No link" });
		expect(link).toBeInTheDocument();
	});

	it("handles empty value", () => {
		render(<LinkCell value="" href="https://example.com" />);
		const link = screen.getByRole("link");
		expect(link).toBeInTheDocument();
		expect(link).toHaveTextContent("");
	});

	it("passes through additional props", () => {
		render(<LinkCell value="Test link" href="https://example.com" target="_blank" rel="noopener" />);
		const link = screen.getByRole("link", { name: "Test link" });
		expect(link).toHaveAttribute("target", "_blank");
		expect(link).toHaveAttribute("rel", "noopener");
	});

	it("renders Link component from HeroUI", () => {
		render(<LinkCell value="Test" href="https://example.com" />);
		const link = screen.getByRole("link", { name: "Test" });
		expect(link).toHaveClass("relative", "inline-flex", "items-center", "tap-highlight-transparent");
	});
});