import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { AssetKind, ReservationStatus } from "../src/generated/client/enums";

// 생성 enum 진입점에 서버 런타임이 연결되면 프론트 import가 실패하므로 경계를 고정합니다.
describe("브라우저 enum 진입점", () => {
	it("Prisma 생성 상수를 변형 없이 공개한다", () => {
		expect(AssetKind.IMAGE).toBe("IMAGE");
		expect(Object.values(ReservationStatus)).toContain("CONFIRMED");
	});

	it("생성 enum 파일에는 런타임 import가 없다", () => {
		const enumSource = readFileSync("src/generated/client/enums.ts", "utf8");
		expect(enumSource).not.toMatch(/^\s*import\s/m);
		expect(enumSource).not.toMatch(/\brequire\s*\(/);
		expect(enumSource).not.toMatch(/^\s*export\s+.*\sfrom\s/m);
	});

	it("ESM과 CommonJS 모두 Client가 아닌 enum 파일을 선택한다", () => {
		const packageManifest = JSON.parse(readFileSync("package.json", "utf8"));
		expect(packageManifest.exports["./enums"]).toEqual({
			types: "./src/generated/client/enums.ts",
			import: "./src/generated/client/enums.ts",
			require: "./dist/src/generated/client/enums.js",
			default: "./src/generated/client/enums.ts",
		});
		expect(packageManifest.devDependencies).not.toHaveProperty("@cocrepo/enum");
	});
});
