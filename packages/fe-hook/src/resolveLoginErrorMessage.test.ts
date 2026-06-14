import { describe, expect, it } from "vitest";
import { resolveLoginErrorMessage } from "./resolveLoginErrorMessage";

describe("resolveLoginErrorMessage", () => {
	it("중첩된 displayMessage를 가장 먼저 사용합니다.", () => {
		expect(
			resolveLoginErrorMessage({
				response: {
					data: {
						displayMessage: "outer",
						data: {
							displayMessage: "inner",
							message: "message",
						},
					},
				},
			}),
		).toBe("inner");
	});

	it("message 배열은 첫 번째 메시지로 정규화합니다.", () => {
		expect(
			resolveLoginErrorMessage({
				response: {
					data: {
						message: ["first", "second"],
					},
				},
			}),
		).toBe("first");
	});

	it("API 응답 메시지가 없으면 error.message를 사용합니다.", () => {
		expect(resolveLoginErrorMessage(new Error("network error"))).toBe(
			"network error",
		);
	});

	it("알 수 없는 오류는 기본 메시지를 반환합니다.", () => {
		expect(resolveLoginErrorMessage({})).toBe("로그인에 실패했습니다.");
	});
});
