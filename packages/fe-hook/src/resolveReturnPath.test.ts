import { describe, expect, it } from "vitest";
import { resolveReturnPath } from "./resolveReturnPath";

describe("resolveReturnPath", () => {
	it("same-origin returnTo에서 admin basePath를 제거합니다.", () => {
		expect(
			resolveReturnPath(
				"?returnTo=https%3A%2F%2Fconsole.test%2Fadmin%2Fcourses%3Fpage%3D2%23list",
				"https://console.test",
			),
		).toBe("/courses?page=2#list");
	});

	it("외부 origin returnTo는 dashboard로 보냅니다.", () => {
		expect(
			resolveReturnPath(
				"?returnTo=https%3A%2F%2Fevil.test%2Fadmin%2Fcourses",
				"https://console.test",
			),
		).toBe("/dashboard");
	});

	it("returnTo가 없으면 dashboard로 보냅니다.", () => {
		expect(resolveReturnPath("", "https://console.test")).toBe("/dashboard");
	});

	it("basePath 자체로 돌아오는 경우 root path로 정규화합니다.", () => {
		expect(
			resolveReturnPath(
				"?returnTo=https%3A%2F%2Fconsole.test%2Fadmin",
				"https://console.test",
			),
		).toBe("/");
	});
});
