import { describe, expect, it } from "vitest";
import { DECORATORS } from "@nestjs/swagger/dist/constants";
import { Policy } from "../src/policy.entity";
import { PolicyEntry } from "../src/policy-entry.entity";
import { Role } from "../src/role.entity";
import { RoleAssignment } from "../src/role-assignment.entity";
import { Translation } from "../src/translation.entity";
import { User } from "../src/user.entity";
import { hydrateEntity } from "../src/hydrate-entity";

describe("Entity Schema 상속과 내부 복원", () => {
	it("모델 Entity가 대응 Schema를 상속하고 도메인 메서드를 유지합니다", () => {
		const role = new Role();
		const user = new User();
		expect(role).toBeInstanceOf(Role);
		expect(user).toBeInstanceOf(User);
		user.tenants = [{ id: 7n }];
		expect(user.hasTenantAccess(7n)).toBe(true);
	});

	it("DB 값의 bigint, Date, 비밀번호, ULID를 변환 없이 복원합니다", () => {
		const createdAt = new Date("2026-01-02T03:04:05.000Z");
		const user = hydrateEntity(User, {
			id: 11n,
			userId: "01ARZ3NDEKTSV4RRFFQ69G5FAV",
			email: "MixedCase@example.com",
			password: "stored-hash",
			createdAt,
		});
		expect(user).toBeInstanceOf(User);
		expect(user.id).toBe(11n);
		expect(user.createdAt).toBe(createdAt);
		expect(user.email).toBe("MixedCase@example.com");
		expect(user.password).toBe("stored-hash");
		expect(user.userId).toBe("01ARZ3NDEKTSV4RRFFQ69G5FAV");
	});

	it("권한 그래프의 명시적 중첩 관계를 Entity 인스턴스로 복원합니다", () => {
		const policy = hydrateEntity(Policy, {
			entries: [{ ability: { name: "read" } }],
			roleAssignments: [],
		});
		expect(policy).toBeInstanceOf(Policy);
		expect(policy.entries?.[0]).toBeInstanceOf(PolicyEntry);
		expect(policy.entries?.[0]?.ability?.name).toBe("read");
	});

	it("indexed declare 필드의 직접 Swagger 타입을 보존합니다", () => {
		expect(
			Reflect.getMetadata(
				DECORATORS.API_MODEL_PROPERTIES,
				Policy.prototype,
				"displayName",
			).type,
		).toBe(String);
		expect(
			Reflect.getMetadata(
				DECORATORS.API_MODEL_PROPERTIES,
				RoleAssignment.prototype,
				"isActive",
			).type,
		).toBe(Boolean);
		expect(
			Reflect.getMetadata(
				DECORATORS.API_MODEL_PROPERTIES,
				RoleAssignment.prototype,
				"priority",
			).type,
		).toBe(Number);
		expect(
			Reflect.getMetadata(
				DECORATORS.API_MODEL_PROPERTIES,
				Translation.prototype,
				"text",
			).type,
		).toBe(String);
	});
});
