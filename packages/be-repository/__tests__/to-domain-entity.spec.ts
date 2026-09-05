import {
	Ability,
	Policy,
	PolicyEntry,
	RoleAssignment,
	User,
} from "@cocrepo/entity";
import { toDomainEntity } from "../src/to-domain-entity";

class ExampleEntity {
	id!: bigint;
	name?: string;
	spaceId!: bigint | null;
	space!: { id: bigint; name: string };
	children?: Array<{ id: bigint; name: string }>;
}

describe("toDomainEntity", () => {
	it("관계를 포함한 Prisma 결과를 그대로 도메인 객체로 변환한다", () => {
		// Given
		const persistenceRow = {
			id: 10n,
			name: "본사 공지",
			spaceId: 20n,
			space: {
				id: 20n,
				name: "본사",
			},
		};

		// When
		const result = toDomainEntity(ExampleEntity, persistenceRow);

		// Then
		expect(result).toBeInstanceOf(ExampleEntity);
		expect(result).toEqual({
			id: 10n,
			name: "본사 공지",
			spaceId: 20n,
			space: {
				id: 20n,
				name: "본사",
			},
		});
	});

	it("배열과 중첩 객체도 원본 값을 유지한다", () => {
		// Given
		const persistenceRows = [
			{
				id: 10n,
				children: [{ id: 30n, name: "child" }],
			},
		];

		// When
		const result = toDomainEntity(ExampleEntity, persistenceRows);

		// Then
		expect(result[0]).toBeInstanceOf(ExampleEntity);
		expect(result).toEqual([
			{
				id: 10n,
				children: [{ id: 30n, name: "child" }],
			},
		]);
	});

	it("nullable 관계와 관계 ID를 그대로 유지한다", () => {
		// Given
		const persistenceRow = {
			id: 10n,
			spaceId: null,
			space: null,
		};

		// When
		const result = toDomainEntity(ExampleEntity, persistenceRow);

		// Then
		expect(result.spaceId).toBeNull();
		expect(result.space).toBeNull();
	});

	it("Prisma scalar를 변형하지 않고 User domain method를 사용할 수 있게 복원한다", () => {
		const lockedUntil = new Date("2030-01-01T00:00:00.000Z");
		const persistenceRow = {
			id: 101n,
			userId: "01J00000000000000000000000",
			name: "관리자",
			email: "ADMIN@EXAMPLE.COM",
			phone: "010-0000-0000",
			password: "$2b$10$hashedPassword",
			failedLoginAttempts: 0,
			lockedUntil,
			passwordChangedAt: null,
			lastLoginAt: null,
			lastLoginIp: null,
			isPermanentlyLocked: false,
			mustChangePassword: false,
			isActive: true,
			currentTenantId: 202n,
			createdAt: new Date("2026-01-01T00:00:00.000Z"),
			updatedAt: null,
			removedAt: null,
			tenants: [{ id: 303n, spaceId: 404n }],
	};

		const result = toDomainEntity(User, persistenceRow);

		expect(result).toBeInstanceOf(User);
		expect(result.email).toBe("ADMIN@EXAMPLE.COM");
		expect(result.userId).toBe(persistenceRow.userId);
		expect(result.password).toBe(persistenceRow.password);
		expect(result.id).toBe(101n);
		expect(result.currentTenantId).toBe(202n);
		expect(result.lockedUntil).toBe(lockedUntil);
		expect(result.hasTenantAccess(303n)).toBe(true);
	});

	it("Policy graph의 기존 nested Entity prototype과 순환·공유 참조를 보존한다", () => {
		const sharedAbility = {
			id: 701n,
			abilityId: "01J00000000000000000000001",
			name: "READ_USER",
			description: null,
			fields: [],
			conditions: null,
			inverted: false,
			reason: null,
			subjectId: 702n,
			actionId: 703n,
			createdAt: new Date("2026-01-01T00:00:00.000Z"),
			updatedAt: null,
			removedAt: null,
		};
		const policyRow: Record<string, unknown> = {
			id: 601n,
			policyId: "01J00000000000000000000002",
			spaceId: 602n,
			createdById: null,
			name: "기본 정책",
			displayName: null,
			description: null,
			createdAt: new Date("2026-01-01T00:00:00.000Z"),
			updatedAt: null,
			removedAt: null,
			entries: [
				{
					id: 801n,
					policyEntryId: "01J00000000000000000000003",
					policyId: 601n,
					abilityId: 701n,
					ability: sharedAbility,
				},
				{
					id: 802n,
					policyEntryId: "01J00000000000000000000004",
					policyId: 601n,
					abilityId: 701n,
					ability: sharedAbility,
				},
			],
		};
		const assignmentRow = {
			id: 901n,
			roleAssignmentId: "01J00000000000000000000005",
			roleId: 902n,
			policyId: 601n,
			isActive: true,
			priority: 0,
			createdAt: new Date("2026-01-01T00:00:00.000Z"),
			updatedAt: null,
			removedAt: null,
			policy: policyRow,
		};
		policyRow.roleAssignments = [assignmentRow];

		const result = toDomainEntity(Policy, policyRow);

		expect(result).toBeInstanceOf(Policy);
		expect(result.entries?.[0]).toBeInstanceOf(PolicyEntry);
		expect(result.entries?.[0]?.ability).toBeInstanceOf(Ability);
		expect(result.entries?.[0]?.ability).toBe(result.entries?.[1]?.ability);
		expect(result.entries?.[0]?.ability?.isAllowed()).toBe(true);
		expect(result.roleAssignments?.[0]).toBeInstanceOf(RoleAssignment);
		expect(result.roleAssignments?.[0]?.policy).toBe(result);
		expect(result.roleAssignments?.[0]?.isEnabled()).toBe(true);
		expect(result.isRemoved()).toBe(false);
	});
});
