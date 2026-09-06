import { describe, expect, it } from "vitest";
import {
	DEFAULT_SCHEMA_PASSWORD_MIN_LENGTH,
	UserFormSchema,
	validateFieldSync,
	validateSchemaSync,
} from "../src";

describe("UserFormSchema", () => {
	const validUser = {
		name: "홍길동",
		email: "hong@example.com",
		phone: "01012345678",
		password: "password10",
	};

	it("Given 올바른 User 입력값 When 검증하면 Then 통과하고 원래 값을 반환한다", () => {
		const result = validateSchemaSync(UserFormSchema, {
			name: "  홍길동  ",
			email: "HONG@EXAMPLE.COM",
			phone: "010-1234-5678",
			password: "password10",
		});

		expect(result.isValid).toBe(true);
		if (!result.isValid) {
			throw new Error("UserFormSchema 검증이 실패했습니다.");
		}
		expect(result.data.name).toBe("  홍길동  ");
		expect(result.data.email).toBe("HONG@EXAMPLE.COM");
		expect(result.data.phone).toBe("010-1234-5678");
		expect(result.data.password).toBe("password10");
	});

	it("Given 이름이 2자보다 짧으면 When 단일 필드를 검증하면 Then 치환된 최소 길이 오류를 반환한다", () => {
		const error = validateFieldSync(
			UserFormSchema,
			{
				...validUser,
				name: "김",
			},
			"name",
		);

		expect(error).toEqual({
			field: "name",
			messages: ["최소 2자 이상 입력해주세요"],
		});
	});

	it("Given 이메일 형식이 아니면 When 검증하면 Then email 필드가 실패한다", () => {
		const result = validateSchemaSync(UserFormSchema, {
			...validUser,
			email: "invalid-email",
		});

		expect(result.isValid).toBe(false);
		if (result.isValid) {
			throw new Error("UserFormSchema email 검증이 통과했습니다.");
		}
		expect(result.errors.map((error) => error.field)).toContain("email");
	});

	it("Given 전화번호 형식이 아니면 When 검증하면 Then phone 필드가 실패한다", () => {
		const result = validateSchemaSync(UserFormSchema, {
			...validUser,
			phone: "12345",
		});

		expect(result.isValid).toBe(false);
		if (result.isValid) {
			throw new Error("UserFormSchema phone 검증이 통과했습니다.");
		}
		expect(result.errors.map((error) => error.field)).toContain("phone");
	});

	it("Given 비밀번호가 10자보다 짧으면 When 단일 필드를 검증하면 Then 치환된 최소 길이 오류를 반환한다", () => {
		const error = validateFieldSync(
			UserFormSchema,
			{
				...validUser,
				password: "a".repeat(DEFAULT_SCHEMA_PASSWORD_MIN_LENGTH - 1),
			},
			"password",
		);

		expect(error).toEqual({
			field: "password",
			messages: ["최소 10자 이상 입력해주세요"],
		});
	});
});
