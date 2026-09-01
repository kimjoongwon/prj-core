import { describe, expect, it } from "vitest";
import {
	deserializeQueryCacheData,
	serializeQueryCacheData,
} from "./query-cache-serializer";

describe("query cache serializer", () => {
	it("Date와 bigint를 serialize/deserialize 왕복 후에도 보존한다", () => {
		const createdAt = new Date("2026-08-30T00:00:00.000Z");
		const sequence = BigInt("9007199254740993");
		const serializedQueryCacheData = serializeQueryCacheData({
			createdAt,
			sequence,
		});
		const restoredQueryCacheData = deserializeQueryCacheData(
			serializedQueryCacheData,
		) as {
			createdAt: unknown;
			sequence: unknown;
		};

		expect(restoredQueryCacheData.createdAt).toBeInstanceOf(Date);
		expect(restoredQueryCacheData.createdAt).toEqual(createdAt);
		expect(typeof restoredQueryCacheData.sequence).toBe("bigint");
		expect(restoredQueryCacheData.sequence).toBe(sequence);
	});
});
