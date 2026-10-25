import { describe, expect, it } from "vitest";
import {
	getStorySourceCatalogSize,
	resolveStorySource,
} from "./StorybookSourceCatalog";

describe("StorybookSourceCatalog", () => {
	it("loads every web story source into the catalog", () => {
		expect(getStorySourceCatalogSize()).toBeGreaterThanOrEqual(100);
	});

	it("resolves source by the story title path", () => {
		const source = resolveStorySource({ title: "input/TextField" });

		expect(source).toContain("TextField");
		expect(source).toContain("export const Default");
	});

	it("returns an empty source for unknown titles", () => {
		expect(resolveStorySource({ title: "unknown/Story" })).toBe("");
	});
});
