import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";
import { LoginPayloadDto } from "./login-payload.dto";
import { OidcLoginPayloadDto } from "../oidc/oidc-login-payload.dto";

describe("login payload DTO", () => {
	it("백엔드 경계에서 이메일 정규화를 유지한다", () => {
		const payload = plainToInstance(LoginPayloadDto, {
			email: "  USER@Example.COM ",
			password: "password123",
		});

		expect(payload.email).toBe("user@example.com");
		expect(payload.password).toBe("password123");
	});

	it("로그인 비밀번호 규칙을 DTO에서 검증한다", async () => {
		const payload = plainToInstance(OidcLoginPayloadDto, {
			email: "user@example.com",
			password: "short",
			remember: false,
		});

		const errors = await validate(payload);

		expect(errors.map(({ property }) => property)).toContain("password");
	});
});
