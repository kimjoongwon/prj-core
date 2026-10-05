import { getMetadataStorage, validateSync } from "class-validator";
import { describe, expect, it } from "vitest";
import {
	Boolean,
	DateField,
	LoginSchema,
	Number,
	PartialSchemaType,
	PickSchemaType,
	RoleSchema,
	StringValidation,
	StringValidationOptional,
	UserFormSchema,
	UserSchema,
	validateSchemaSync,
	validateSchemaToFieldErrorsSync,
} from "../src";

class CreateRoleSchema extends PickSchemaType(RoleSchema, [
	"name",
	"displayName",
	"description",
] as const) {}
class UpdateRoleSchema extends PartialSchemaType(
	PickSchemaType(RoleSchema, ["displayName", "description"] as const),
) {}

class DefaultedSchema {
	@StringValidation() name = "DEFAULT";
	method() {
		return "도메인 동작";
	}
}
class TypedInput {
	@Number() count!: number;
	@Boolean() enabled!: boolean;
	@DateField() startedAt!: Date;
}
class NullContract {
	@StringValidationOptional() optional!: string;
	@StringValidation({ nullable: true }) nullable!: string | null;
}

describe("모델 Schema 파생", () => {
	it("Role 입력은 DB 식별자와 날짜 검증을 포함하지 않는다", () => {
		expect(
			validateSchemaSync(CreateRoleSchema, { name: "MANAGER" }).isValid,
		).toBe(true);
		expect(
			validateSchemaSync(CreateRoleSchema, { name: "manager" }).isValid,
		).toBe(false);
		expect(validateSchemaSync(CreateRoleSchema, {}).isValid).toBe(false);
		expect(
			validateSchemaSync(CreateRoleSchema, {
				name: "MANAGER",
				displayName: "a".repeat(51),
			}).isValid,
		).toBe(false);
	});
	it("기존 선택 필드와 null 허용 계약을 보존한다", () => {
		expect(
			validateSchemaSync(CreateRoleSchema, {
				name: "MANAGER",
				displayName: null,
			}).isValid,
		).toBe(true);
		expect(validateSchemaSync(UpdateRoleSchema, {}).isValid).toBe(true);
		expect(
			validateSchemaSync(UpdateRoleSchema, { displayName: null }).isValid,
		).toBe(true);
		expect(
			validateSync(Object.assign(new NullContract(), { nullable: null })),
		).toHaveLength(0);
		expect(
			validateSync(
				Object.assign(new NullContract(), { optional: null, nullable: null }),
			).map((error) => error.property),
		).toEqual(["optional"]);
		expect(
			validateSync(new NullContract()).map((error) => error.property),
		).toEqual(["nullable"]);
	});
	it("메타데이터만 복사하고 초기값과 메서드는 복사하지 않는다", () => {
		const PickedSchema = PickSchemaType(DefaultedSchema, ["name"] as const);
		expect(new PickedSchema()).not.toHaveProperty("name");
		expect(new PickedSchema()).not.toHaveProperty("method");
		expect(
			validateSync(new PickedSchema()).map((error) => error.property),
		).toEqual(["name"]);
	});
	it("상속된 검증을 다시 선택해도 규칙이 누락되거나 중복되지 않는다", () => {
		class DerivedRole extends CreateRoleSchema {}
		const RePickedRole = PickSchemaType(DerivedRole, ["name"] as const);
		const storage = getMetadataStorage();
		const sourceRules = storage
			.getTargetValidationMetadatas(RoleSchema, "", false, false)
			.filter((rule) => rule.propertyName === "name");
		const pickedRules = storage.getTargetValidationMetadatas(
			RePickedRole,
			"",
			false,
			false,
		);
		expect(pickedRules).toHaveLength(sourceRules.length);
		expect(
			validateSync(Object.assign(new RePickedRole(), { name: "bad" }))[0]
				.constraints,
		).toHaveProperty("matches");
	});
});

describe("User 공통 규칙과 평문 입력 규칙", () => {
	it("로그인 이메일 오류의 한글 메시지와 필수값 우선순위를 유지한다", () => {
		expect(
			validateSchemaToFieldErrorsSync(LoginSchema, {
				email: "invalid",
				password: "password",
			}).email,
		).toBe("유효한 이메일 주소를 입력해주세요");
		expect(
			validateSchemaToFieldErrorsSync(LoginSchema, {
				email: "",
				password: "password",
			}).email,
		).toBe("필수 입력 항목입니다");
	});
	it("로그인은 User에서 파생하지만 전체 User 필드는 요구하지 않는다", () => {
		expect(
			validateSchemaSync(LoginSchema, {
				email: "user@example.com",
				password: "password",
			}).isValid,
		).toBe(true);
		expect(
			validateSchemaSync(LoginSchema, {
				email: "invalid",
				password: "password",
			}).isValid,
		).toBe(false);
		expect(
			validateSchemaSync(LoginSchema, {
				email: "user@example.com",
				password: "short",
			}).isValid,
		).toBe(false);
	});
	it("저장 비밀번호에는 평문 길이 규칙이 유입되지 않는다", () => {
		const StoredPasswordSchema = PickSchemaType(UserSchema, [
			"password",
		] as const);
		expect(
			validateSchemaSync(StoredPasswordSchema, { password: "x" }).isValid,
		).toBe(true);
		expect(
			validateSchemaSync(StoredPasswordSchema, { password: 123 }).isValid,
		).toBe(false);
	});
	it("Form의 더 엄격한 이름 길이 규칙은 모델과 독립적으로 보존된다", () => {
		const ModelName = PickSchemaType(UserSchema, ["name"] as const);
		const FormName = PickSchemaType(UserFormSchema, ["name"] as const);
		expect(validateSchemaSync(ModelName, { name: "김" }).isValid).toBe(true);
		expect(validateSchemaSync(FormName, { name: "김" }).isValid).toBe(false);
		expect(
			validateSchemaSync(FormName, { name: "김".repeat(51) }).isValid,
		).toBe(false);
	});
});

describe("변환 없는 Form 검증", () => {
	it("숫자, boolean, 날짜 문자열을 자동 변환하지 않는다", () => {
		const input = { count: "1", enabled: "true", startedAt: "2026-09-06" };
		const validation = validateSchemaSync(TypedInput, input);
		expect(validation.isValid).toBe(false);
		if (!validation.isValid)
			expect(validation.errors.map((error) => error.field).sort()).toEqual([
				"count",
				"enabled",
				"startedAt",
			]);
		expect(input).toEqual({
			count: "1",
			enabled: "true",
			startedAt: "2026-09-06",
		});
	});
	it("올바른 값과 Date 인스턴스를 그대로 사용한다", () => {
		const startedAt = new Date("2026-09-06");
		const validation = validateSchemaSync(TypedInput, {
			count: 1,
			enabled: true,
			startedAt,
		});
		expect(validation.isValid).toBe(true);
		if (validation.isValid) expect(validation.data.startedAt).toBe(startedAt);
	});
	it("공백 이메일을 정리해서 통과시키지 않는다", () => {
		expect(
			validateSchemaSync(LoginSchema, {
				email: " user@example.com ",
				password: "password",
			}).isValid,
		).toBe(false);
	});
});
