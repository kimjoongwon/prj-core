import { describe, expect, it } from "vitest";
import {
	fromRouteKey,
	isRouteKey,
	isUuid,
	toRouteKey,
	tryFromRouteKey,
} from "../RouteKey";

describe("RouteKey", () => {
	const uuid = "018f9e5e-1d3b-7a91-bc21-1e0d9c3d01ab";
	const routeKey = "AY-eXh07epG8IR4NnD0Bqw";

	it("UUID를 22자 route key로 변환한다", () => {
		expect(toRouteKey(uuid)).toBe(routeKey);
		expect(toRouteKey(uuid)).toHaveLength(22);
	});

	it("route key를 UUID로 복원한다", () => {
		expect(fromRouteKey(routeKey)).toBe(uuid);
		expect(tryFromRouteKey(routeKey)).toBe(uuid);
	});

	it("legacy UUID는 그대로 통과한다", () => {
		expect(fromRouteKey(uuid)).toBe(uuid);
		expect(tryFromRouteKey(uuid)).toBe(uuid);
		expect(toRouteKey("not-a-uuid")).toBe("not-a-uuid");
	});

	it("invalid route key는 null 또는 원본으로 처리한다", () => {
		expect(tryFromRouteKey("not-a-route-key")).toBeNull();
		expect(fromRouteKey("not-a-route-key")).toBe("not-a-route-key");
	});

	it("UUID와 route key 형식을 판별한다", () => {
		expect(isUuid(uuid)).toBe(true);
		expect(isUuid(routeKey)).toBe(false);
		expect(isRouteKey(routeKey)).toBe(true);
		expect(isRouteKey(uuid)).toBe(false);
		expect(isRouteKey("not-a-route-key")).toBe(false);
	});
});
