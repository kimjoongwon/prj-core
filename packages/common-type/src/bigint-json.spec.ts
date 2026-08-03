import { describe, expect, it } from "vitest";
import { parseBigIntJson, stringifyBigIntJson } from "./bigint-json";

describe("bigint JSON", () => {
	it("Given 중첩 bigint 값 When 직렬화 후 역직렬화하면 Then bigint 타입과 값이 보존된다", () => {
		const serialized = stringifyBigIntJson({
			id: 1n,
			relations: [{ userId: 9223372036854775807n }],
		});

		expect(parseBigIntJson(serialized)).toEqual({
			id: 1n,
			relations: [{ userId: 9223372036854775807n }],
		});
	});

	it("Given 태그 이름과 닮은 일반 객체 When 역직렬화하면 Then 유효한 단일 태그가 아니면 그대로 둔다", () => {
		const serialized = JSON.stringify({
			metadata: { __cocrepoBigInt: "1", source: "external" },
			invalid: { __cocrepoBigInt: "01" },
		});

		expect(parseBigIntJson(serialized)).toEqual({
			metadata: { __cocrepoBigInt: "1", source: "external" },
			invalid: { __cocrepoBigInt: "01" },
		});
	});
});
