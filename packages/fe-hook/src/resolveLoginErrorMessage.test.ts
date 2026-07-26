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

	it("P2022는 인증 실패가 아닌 데이터베이스 준비 오류로 표시합니다.", () => {
		expect(
			resolveLoginErrorMessage({
				response: {
					data: {
						message: "서버 데이터베이스가 최신 상태가 아닙니다.",
						data: {
							code: "P2022",
							target: "fitness_centers.space_id",
							retryable: false,
						},
					},
				},
			}),
		).toBe(
			"서버가 최신 상태로 준비되지 않았습니다. 잠시 후 다시 시도하거나 관리자에게 문의해 주세요.",
		);
	});
});
