import { describe, expect, it } from "vitest";
import type { RuntimeManifest } from "./runtimeSchema";
import { transformRequestConfig, transformResponseData } from "./runtimeSchema";

const manifest: RuntimeManifest = {
	operations: [{
		operationId: "saveTimeline",
		method: "POST",
		path: "/api/timelines/{timelineId}",
		requestSchema: { $ref: "#/components/schemas/Timeline" },
		parameterSchemas: { "query:cursor": { "x-runtime-type": "bigint" } },
		responseSchemas: { "200": { type: "array", items: { $ref: "#/components/schemas/Timeline" } } },
	}],
	schemas: {
		Timeline: { type: "object", properties: {
			createdAt: { type: "string", format: "date-time" },
			sequence: { type: "integer", format: "int64", "x-runtime-type": "bigint" },
			child: { nullable: true, $ref: "#/components/schemas/TimelineChild" },
		} },
		TimelineChild: { type: "object", properties: { occurredAt: { type: "string", format: "date-time" } } },
	},
};

describe("runtimeSchema", () => {
	it("request의 nested Date와 bigint, query bigint를 schema 기반 wire 값으로 변환한다", () => {
		const config = transformRequestConfig({
			method: "post", url: "/api/timelines/42", params: { cursor: 99n },
			data: { createdAt: new Date("2026-01-02T03:04:05.000Z"), sequence: 7n, child: { occurredAt: new Date("2026-02-03T04:05:06.000Z") } },
		}, manifest);
		expect(config.params.cursor).toBe("99");
		expect(config.data).toEqual({ createdAt: "2026-01-02T03:04:05.000Z", sequence: "7", child: { occurredAt: "2026-02-03T04:05:06.000Z" } });
	});

	it("response의 arrays, nested ref, nullable Date와 bigint를 runtime 값으로 변환한다", () => {
		const result = transformResponseData([
			{ createdAt: "2026-01-02T03:04:05.000Z", sequence: "9007199254740993", child: null },
		], 200, "POST", "/api/timelines/42", manifest) as Array<Record<string, unknown>>;
		expect(result[0].createdAt).toEqual(new Date("2026-01-02T03:04:05.000Z"));
		expect(result[0].sequence).toBe(9007199254740993n);
		expect(result[0].child).toBeNull();
	});

	it("변환 실패 오류에 operation과 field path를 포함한다", () => {
		expect(() => transformResponseData([{ createdAt: "invalid", sequence: "1", child: null }], 200, "POST", "/api/timelines/42", manifest))
			.toThrow("Runtime conversion failed for saveTimeline at response.body[0].createdAt");
	});
});
