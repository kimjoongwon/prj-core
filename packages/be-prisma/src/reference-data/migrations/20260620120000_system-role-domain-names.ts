import { Prisma } from "../../generated/client/client";
import { syncReferenceData } from "../sync-reference-data";
import type { ReferenceDataDbClient, ReferenceDataMigration } from "./types";

const CANONICAL_ROLE_DATA = [
	{
		name: "PLATFORM_ADMIN",
		displayName: "플랫폼 관리자",
		description:
			"플랫폼 전체를 운영하고 모든 Space와 시스템 리소스에 접근하는 역할",
		isSystem: true,
		removedAt: null,
	},
	{
		name: "COMPANY_MANAGER",
		displayName: "Company 관리자",
		description:
			"특정 Company의 지점, 회원, 예약, 콘텐츠 등 운영 리소스를 관리하는 역할",
		isSystem: true,
		removedAt: null,
	},
	{
		name: "MEMBER",
		displayName: "회원",
		description: "자신의 정보와 예약을 관리하고 시설/콘텐츠를 조회하는 역할",
		isSystem: true,
		removedAt: null,
	},
] as const;

const LEGACY_ROLE_RENAMES = [
	{ legacyName: "FULL_ACCESS", canonicalName: "PLATFORM_ADMIN" },
	{ legacyName: "MANAGE", canonicalName: "COMPANY_MANAGER" },
	{ legacyName: "SPACE_MANAGER", canonicalName: "COMPANY_MANAGER" },
	{ legacyName: "VIEW", canonicalName: "MEMBER" },
] as const;

const LEGACY_SYSTEM_POLICY_NAMES = [
	"full-access-system-policy",
	"manage-system-policy",
	"space-manager-system-policy",
	"view-system-policy",
] as const;

async function removeLegacySystemPolicies(
	db: ReferenceDataDbClient,
): Promise<void> {
	const legacyPolicies = await db.policy.findMany({
		where: { name: { in: [...LEGACY_SYSTEM_POLICY_NAMES] } },
		select: { id: true },
	});
	if (legacyPolicies.length === 0) {
		return;
	}

	const legacyPolicyIds = legacyPolicies.map((policy) => policy.id);
	await db.rolePolicy.deleteMany({
		where: { policyId: { in: legacyPolicyIds } },
	});
	await removeLegacyPersonalPolicyRowsByPolicyIds(db, legacyPolicyIds);
	await db.policyAbility.deleteMany({
		where: { policyId: { in: legacyPolicyIds } },
	});
	await db.policy.deleteMany({
		where: { id: { in: legacyPolicyIds } },
	});
}

async function removeLegacyPersonalPolicyRowsByPolicyIds(
	db: ReferenceDataDbClient,
	policyIds: string[],
): Promise<void> {
	if (policyIds.length === 0) {
		return;
	}

	const [legacyPersonalPolicyTable] = await db.$queryRaw<{ exists: boolean }[]>`
		SELECT to_regclass('public.user_policies') IS NOT NULL AS "exists"
	`;
	if (!legacyPersonalPolicyTable?.exists) {
		return;
	}

	await db.$executeRaw`
		DELETE FROM "user_policies"
		WHERE "policy_id" IN (${Prisma.join(policyIds)})
	`;
}

async function transferLegacyRolePolicies(
	db: ReferenceDataDbClient,
	legacyRoleId: string,
	canonicalRoleId: string,
): Promise<void> {
	const legacyRolePolicies = await db.rolePolicy.findMany({
		where: { roleId: legacyRoleId },
		select: { id: true, policyId: true },
	});

	for (const legacyRolePolicy of legacyRolePolicies) {
		const existingCanonicalRolePolicy = await db.rolePolicy.findFirst({
			where: {
				roleId: canonicalRoleId,
				policyId: legacyRolePolicy.policyId,
			},
			select: { id: true },
		});

		if (existingCanonicalRolePolicy) {
			await db.rolePolicy.delete({
				where: { id: legacyRolePolicy.id },
			});
			continue;
		}

		await db.rolePolicy.update({
			where: { id: legacyRolePolicy.id },
			data: { roleId: canonicalRoleId },
		});
	}
}

async function mergeLegacyRoleIntoCanonical(
	db: ReferenceDataDbClient,
	legacyRoleId: string,
	canonicalRoleId: string,
): Promise<void> {
	await db.tenant.updateMany({
		where: { roleId: legacyRoleId },
		data: { roleId: canonicalRoleId },
	});
	await db.tenantAccessRequest.updateMany({
		where: { requestedRoleId: legacyRoleId },
		data: { requestedRoleId: canonicalRoleId },
	});
	await db.tenantAccessRequest.updateMany({
		where: { previousRoleId: legacyRoleId },
		data: { previousRoleId: canonicalRoleId },
	});

	await transferLegacyRolePolicies(db, legacyRoleId, canonicalRoleId);

	await db.roleAssociation.deleteMany({
		where: { roleId: legacyRoleId },
	});
	await db.roleClassification.deleteMany({
		where: { roleId: legacyRoleId },
	});
	await db.role.delete({
		where: { id: legacyRoleId },
	});
}

export const systemRoleDomainNamesMigration: ReferenceDataMigration = {
	id: "20260620120000_system-role-domain-names",
	description:
		"Rename legacy system roles FULL_ACCESS, MANAGE, SPACE_MANAGER, and VIEW to domain role names.",
	sourcePath: __filename,
	async up(db) {
		for (const roleData of CANONICAL_ROLE_DATA) {
			await db.role.upsert({
				where: { name: roleData.name },
				update: roleData,
				create: roleData,
			});
		}

		await removeLegacySystemPolicies(db);

		for (const roleRename of LEGACY_ROLE_RENAMES) {
			const [legacyRole, canonicalRole] = await Promise.all([
				db.role.findUnique({ where: { name: roleRename.legacyName } }),
				db.role.findUnique({ where: { name: roleRename.canonicalName } }),
			]);

			if (!legacyRole || !canonicalRole) {
				continue;
			}

			await mergeLegacyRoleIntoCanonical(db, legacyRole.id, canonicalRole.id);
		}

		await syncReferenceData(db);
	},
};
