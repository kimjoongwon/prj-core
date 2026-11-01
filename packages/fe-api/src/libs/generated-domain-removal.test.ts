import { existsSync, readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { runtimeManifest } from "./runtimeManifest";

const removedDomainPattern = /tenant[-_]?access[-_]?request/i;
const coreSourceUrl = new URL("../core/", import.meta.url);
const coreManifest = JSON.parse(
	readFileSync(new URL("./runtimeManifest.core.json", import.meta.url), "utf8"),
);

describe("제거된 도메인의 생성 SDK 계약", () => {
	it("TenantAccessRequest의 태그와 모델을 공개하지 않는다", () => {
		expect(existsSync(new URL("tenant-access-requests/", coreSourceUrl))).toBe(
			false,
		);
		expect(
			readdirSync(new URL("model/", coreSourceUrl)).filter((modelFileName) =>
				removedDomainPattern.test(modelFileName),
			),
		).toEqual([]);
		for (const barrelPath of ["index.ts", "model/index.ts"]) {
			expect(
				readFileSync(new URL(barrelPath, coreSourceUrl), "utf8"),
			).not.toMatch(removedDomainPattern);
		}
	});

	it("파편과 병합 매니페스트에 제거된 operation과 schema를 남기지 않는다", () => {
		for (const manifest of [coreManifest, runtimeManifest]) {
			expect(JSON.stringify(manifest)).not.toMatch(removedDomainPattern);
		}
	});

	it("공통 사용자·역할·Tenant 계약을 유지한다", () => {
		for (const manifest of [coreManifest, runtimeManifest]) {
			expect(manifest.schemas).toHaveProperty("UserDto");
			expect(manifest.schemas).toHaveProperty("RoleDto");
			expect(manifest.schemas).toHaveProperty("TenantDto");
			expect(
				manifest.operations.map(
					(operation: { operationId: string }) => operation.operationId,
				),
			).toEqual(
				expect.arrayContaining(["getUsers", "getRoles", "getUserTenantDetail"]),
			);
		}
	});
});
