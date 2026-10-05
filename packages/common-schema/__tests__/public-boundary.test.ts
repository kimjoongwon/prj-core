import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import type { JsonValue } from "@cocrepo/type";
import { describe, expect, expectTypeOf, it } from "vitest";
import {
	AbilitySchema,
	type InferSchema,
	SessionSchema,
	UserSchema,
} from "../src";

function findTypeScriptFiles(directoryPath: string): string[] {
	return readdirSync(directoryPath, { withFileTypes: true }).flatMap(
		(directoryEntry) => {
			const entryPath = resolve(directoryPath, directoryEntry.name);
			if (directoryEntry.isDirectory()) return findTypeScriptFiles(entryPath);
			return directoryEntry.isFile() && entryPath.endsWith(".ts")
				? [entryPath]
				: [];
		},
	);
}

describe("공개 Schema package 경계", () => {
	it("Schema source와 package dependency가 private Prisma package를 참조하지 않는다", () => {
		const packageRootPath = resolve(__dirname, "..");
		const schemaSourcePaths = findTypeScriptFiles(resolve(packageRootPath, "src"));
		const packageJson = readFileSync(
			resolve(packageRootPath, "package.json"),
			"utf8",
		);

		for (const schemaSourcePath of schemaSourcePaths) {
			expect(readFileSync(schemaSourcePath, "utf8")).not.toContain(
				"@cocrepo/prisma",
			);
		}
		expect(packageJson).not.toContain("@cocrepo/prisma");
	});

	it("Schema 생성자에서 scalar, enum, JSON 필드 타입을 추론한다", () => {
		type User = InferSchema<typeof UserSchema>;
		type Session = InferSchema<typeof SessionSchema>;
		type Ability = InferSchema<typeof AbilitySchema>;

		expectTypeOf<User["email"]>().toEqualTypeOf<string>();
		expectTypeOf<User["lockedUntil"]>().toEqualTypeOf<Date | null>();
		expectTypeOf<Session["type"]>().toEqualTypeOf<
			"ONE_TIME" | "ONE_TIME_RANGE" | "RECURRING"
		>();
		expectTypeOf<Ability["conditions"]>().toEqualTypeOf<JsonValue>();
	});
});
