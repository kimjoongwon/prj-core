import { describe, expect, it } from "vitest";
import { getGetUsersUrl } from "../core/users/users";

// orval fetch 생성기의 쿼리 직렬화 계약을 고정한다. transformRequestConfig
// 제거 후 date-time 쿼리 직렬화는 생성된 URL 빌더가 단독으로 담당하므로,
// 재생성 시 이 동작이 조용히 바뀌면 여기서 잡힌다.
describe("생성 URL 빌더 쿼리 직렬화", () => {
	it("date-time 파라미터(Date)를 ISO 8601 문자열로 직렬화한다", () => {
		const usersUrl = getGetUsersUrl({
			createdFrom: new Date("2026-09-27T01:02:03.000Z"),
			createdTo: new Date("2026-09-28T04:05:06.000Z"),
		});

		const queryParams = new URL(usersUrl, "http://runtime.local").searchParams;
		expect(queryParams.get("createdFrom")).toBe("2026-09-27T01:02:03.000Z");
		expect(queryParams.get("createdTo")).toBe("2026-09-28T04:05:06.000Z");
	});

	it("explode 배열 파라미터는 키를 반복하고 undefined는 생략한다", () => {
		const usersUrl = getGetUsersUrl({
			roles: ["ADMIN", "STAFF"],
			groupIds: ["1", "2"],
			name: undefined,
		});

		const queryParams = new URL(usersUrl, "http://runtime.local").searchParams;
		expect(queryParams.getAll("roles")).toEqual(["ADMIN", "STAFF"]);
		expect(queryParams.getAll("groupIds")).toEqual(["1", "2"]);
		expect(queryParams.has("name")).toBe(false);
	});

	it("무효한 Date는 toISOString의 RangeError로 실패한다", () => {
		expect(() => getGetUsersUrl({ createdFrom: new Date(Number.NaN) })).toThrow(
			RangeError,
		);
	});
});
