import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import test from "node:test";

test("공개 enum 경계는 private Prisma package를 참조하지 않는다", () => {
	const source = readFileSync("src/index.ts", "utf8");
	const generatedSource = readFileSync(
		"src/generated/prisma-enums.ts",
		"utf8",
	);

	assert.equal(source.includes("@cocrepo/prisma"), false);
	assert.equal(generatedSource.includes("@cocrepo/prisma"), false);
});
