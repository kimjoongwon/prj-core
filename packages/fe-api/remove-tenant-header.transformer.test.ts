import { describe, expect, it } from "vitest";

const transformSpecForCodegen = require("./remove-tenant-header.transformer.cjs");

describe("removeTenantHeaderParameters", () => {
	it("Given OpenAPI parameters When transforming Then x-tenant-id header만 제거하고 다른 parameter는 유지한다", () => {
		const spec = {
			openapi: "3.0.0",
			info: { title: "test", version: "1.0.0" },
			paths: {
				"/api/v1/users/{userId}": {
					parameters: [
						{ name: "x-tenant-id", in: "header", required: true },
						{ name: "trace-id", in: "header", required: false },
					],
					get: {
						parameters: [
							{ name: "userId", in: "path", required: true },
							{ name: "search", in: "query", required: false },
							{ name: "X-Tenant-Id", in: "header", required: true },
						],
					},
				},
			},
		};

		const result = transformSpecForCodegen(spec, { writeManifest: false });

		expect(result.paths["/api/v1/users/{userId}"].parameters).toEqual([
			{ name: "trace-id", in: "header", required: false },
		]);
		expect(result.paths["/api/v1/users/{userId}"].get.parameters).toEqual([
			{ name: "userId", in: "path", required: true },
			{ name: "search", in: "query", required: false },
		]);
		expect(spec.paths["/api/v1/users/{userId}"].get.parameters).toHaveLength(3);
	});

	it("Given operation에 tenant header만 있을 때 When transforming Then 빈 parameters 배열을 제거한다", () => {
		const spec = {
			openapi: "3.0.0",
			info: { title: "test", version: "1.0.0" },
			paths: {
				"/api/v1/users": {
					get: {
						parameters: [{ name: "x-tenant-id", in: "header", required: true }],
					},
				},
			},
		};

		const result = transformSpecForCodegen(spec, { writeManifest: false });

		expect(result.paths["/api/v1/users"].get.parameters).toBeUndefined();
	});

	it("bigint extension schema만 clone에서 integer/int64로 바꾸고 runtime manifest를 만든다", () => {
		const spec = {
			openapi: "3.0.0",
			info: { title: "test", version: "1.0.0" },
			paths: {
				"/records": {
					post: {
						operationId: "createRecord",
						requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/Record" } } } },
						responses: { 201: { content: { "application/json": { schema: { $ref: "#/components/schemas/Record" } } } } },
					},
				},
			},
			components: { schemas: { Record: { type: "object", properties: { id: { type: "string", "x-runtime-type": "bigint" }, label: { type: "string" } } } } },
		};
		const result = transformSpecForCodegen(spec, { writeManifest: false });
		const manifest = transformSpecForCodegen.createRuntimeManifest(result);

		expect(result.components.schemas.Record.properties.id).toMatchObject({ type: "integer", format: "int64", "x-runtime-type": "bigint" });
		expect(spec.components.schemas.Record.properties.id.type).toBe("string");
		expect(manifest.operations[0]).toMatchObject({ operationId: "createRecord", method: "POST", path: "/records" });
	});
});
