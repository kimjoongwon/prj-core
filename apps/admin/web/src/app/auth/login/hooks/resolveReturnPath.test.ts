import { describe, expect, it } from "vitest";
import { resolveReturnPath } from "./resolveReturnPath";

describe("resolveReturnPath", () => {
	const origin = "http://localhost:3000";

	it("returnTo가 없으면 dashboard로 이동한다", () => {
		expect(resolveReturnPath("", origin)).toBe("/dashboard");
	});

	it("같은 origin 내부 경로를 허용한다", () => {
		expect(resolveReturnPath("?returnTo=/dashboard?tab=today", origin)).toBe(
			"/dashboard?tab=today",
		);
	});

	it("admin basePath를 router 내부 경로로 정규화한다", () => {
		expect(resolveReturnPath("?returnTo=/admin/spaces#ground", origin)).toBe(
			"/spaces#ground",
		);
	});

	it("외부 origin은 dashboard로 보낸다", () => {
		expect(
			resolveReturnPath("?returnTo=https://evil.example/admin/spaces", origin),
		).toBe("/dashboard");
	});

	it("scheme-relative 외부 URL도 차단한다", () => {
		expect(resolveReturnPath("?returnTo=//evil.example/spaces", origin)).toBe(
			"/dashboard",
		);
	});
});
