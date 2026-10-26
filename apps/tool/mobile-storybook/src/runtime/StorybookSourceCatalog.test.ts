import { describe, expect, it } from "@jest/globals";
import {
	getMobileStorySourceCatalogSize,
	resolveMobileStorySource,
} from "./StorybookSourceCatalog";

describe("StorybookSourceCatalog", () => {
	it("contains every generated mobile story source", () => {
		expect(getMobileStorySourceCatalogSize()).toBeGreaterThanOrEqual(65);
	});

	it("resolves source using the generated title key", () => {
		const source = resolveMobileStorySource("mo-ui/input/TextField");

		expect(source).toContain('title: "input/TextField"');
		expect(source).toContain("export const Default");
	});

	it("does not hide missing story mappings", () => {
		expect(() => resolveMobileStorySource("mo-ui/unknown/Story")).toThrow(
			"Mobile Storybook source is missing",
		);
	});
});
