import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const packageDirectory = resolve(
	fileURLToPath(new URL("..", import.meta.url)),
);

describe("public package export contract", () => {
	it("routes CommonJS and ESM consumers to matching root and runtime subpath artifacts", async () => {
		const packageJson = JSON.parse(
			await readFile(resolve(packageDirectory, "package.json"), "utf8"),
		) as {
			exports: Record<
				string,
				{ default: string; import: string; require: string; types: string }
			>;
		};

		expect(packageJson.exports["."]).toEqual({
			types: "./dist/index.d.ts",
			require: "./dist/index.js",
			import: "./dist/esm/index.js",
			default: "./dist/esm/index.js",
		});
		expect(packageJson.exports["./database-id"]).toEqual({
			types: "./dist/src/database-id.d.ts",
			require: "./dist/src/database-id.js",
			import: "./dist/esm/src/database-id.js",
			default: "./dist/esm/src/database-id.js",
		});
		expect(packageJson.exports["./bigint-json"]).toEqual({
			types: "./dist/src/bigint-json.d.ts",
			require: "./dist/src/bigint-json.js",
			import: "./dist/esm/src/bigint-json.js",
			default: "./dist/esm/src/bigint-json.js",
		});
	});
});
