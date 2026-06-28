import { describe, expect, it } from "vitest";

const removeTenantHeaderParameters = require("./remove-tenant-header.transformer.cjs");

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

		const result = removeTenantHeaderParameters(spec);

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
						parameters: [
							{ name: "x-tenant-id", in: "header", required: true },
						],
					},
				},
			},
		};

		const result = removeTenantHeaderParameters(spec);

		expect(result.paths["/api/v1/users"].get.parameters).toBeUndefined();
	});
});
