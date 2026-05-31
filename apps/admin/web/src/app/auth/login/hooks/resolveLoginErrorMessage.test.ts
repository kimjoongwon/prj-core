import { describe, expect, it } from "vitest";
import { resolveLoginErrorMessage } from "./resolveLoginErrorMessage";

describe("resolveLoginErrorMessage", () => {
	it("서버 displayMessage를 가장 먼저 사용한다", () => {
		expect(
			resolveLoginErrorMessage({
				response: {
					data: {
						data: {
							displayMessage: "이메일 또는 비밀번호를 확인해주세요.",
						},
						message: "Unauthorized",
					},
				},
			}),
		).toBe("이메일 또는 비밀번호를 확인해주세요.");
	});

	it("서버 message 배열은 첫 번째 메시지를 사용한다", () => {
		expect(
			resolveLoginErrorMessage({
				response: {
					data: {
						message: [
							"이메일 형식이 올바르지 않습니다.",
							"비밀번호가 필요합니다.",
						],
					},
				},
			}),
		).toBe("이메일 형식이 올바르지 않습니다.");
	});

	it("상위 displayMessage도 사용할 수 있다", () => {
		expect(
			resolveLoginErrorMessage({
				response: {
					data: {
						displayMessage: "잠시 후 다시 시도해주세요.",
					},
				},
			}),
		).toBe("잠시 후 다시 시도해주세요.");
	});

	it("알 수 없는 에러면 기본 메시지를 사용한다", () => {
		expect(resolveLoginErrorMessage({})).toBe("로그인에 실패했습니다.");
	});
});
