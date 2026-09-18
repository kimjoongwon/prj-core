import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const packageDirectory = resolve(
	fileURLToPath(new URL("../..", import.meta.url)),
);

describe("public package export contract", () => {
	it("routes CommonJS and ESM consumers to matching build artifacts", async () => {
		const packageJson = JSON.parse(
			await readFile(resolve(packageDirectory, "package.json"), "utf8"),
		) as {
			exports: {
				".": { import: string; require: string; types: string };
			};
		};

		expect(packageJson.exports["."]).toEqual({
			types: "./dist/index.d.ts",
			require: "./dist/index.js",
			import: "./dist/esm/index.js",
			default: "./dist/esm/index.js",
		});
	});
});
