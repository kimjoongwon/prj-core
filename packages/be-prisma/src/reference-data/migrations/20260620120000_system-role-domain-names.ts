import { Prisma } from "../../generated/client/client";
import { syncReferenceData } from "../sync-reference-data";
import type { ReferenceDataDbClient, ReferenceDataMigration } from "./types";

const CANONICAL_ROLE_DATA = [
	{
		name: "PLATFORM_ADMIN",
		displayName: "플랫폼 관리자",
		description:
			"플랫폼 전체를 운영하고 모든 Space와 시스템 리소스에 접근하는 역할",
		removedAt: null,
	},
	{
		name: "COMPANY_MANAGER",
		displayName: "Company 관리자",
		description:
			"특정 Company의 지점, 회원, 예약, 콘텐츠 등 운영 리소스를 관리하는 역할",
		removedAt: null,
	},
	{
		name: "MEMBER",
		displayName: "회원",
		description: "자신의 정보와 예약을 관리하고 시설/콘텐츠를 조회하는 역할",
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
		select: { id: true, seq: true },
	});
	if (legacyPolicies.length === 0) {
		return;
	}

	const legacyPolicyIds = legacyPolicies.map((policy) => policy.id);
	const legacyPolicySeqs = legacyPolicies.map((policy) => policy.seq);
	await db.roleAssignment.deleteMany({
		where: { policySeq: { in: legacyPolicySeqs } },
	});
	await removeLegacyPersonalPolicyRowsByPolicyIds(db, legacyPolicyIds);
	await db.policyEntry.deleteMany({
		where: { policySeq: { in: legacyPolicySeqs } },
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

async function transferLegacyRoleAssignments(
	db: ReferenceDataDbClient,
	legacyRoleSeq: number,
	canonicalRoleSeq: number,
): Promise<void> {
	const legacyRoleAssignments = await db.roleAssignment.findMany({
		where: { roleSeq: legacyRoleSeq },
		select: { id: true, policySeq: true },
	});

	for (const legacyRoleAssignment of legacyRoleAssignments) {
		const existingCanonicalRoleAssignment = await db.roleAssignment.findFirst({
			where: {
				roleSeq: canonicalRoleSeq,
				policySeq: legacyRoleAssignment.policySeq,
			},
			select: { id: true },
		});

		if (existingCanonicalRoleAssignment) {
			await db.roleAssignment.delete({
				where: { id: legacyRoleAssignment.id },
			});
			continue;
		}

		await db.roleAssignment.update({
			where: { id: legacyRoleAssignment.id },
			data: { roleSeq: canonicalRoleSeq },
		});
	}
}

async function mergeLegacyRoleIntoCanonical(
	db: ReferenceDataDbClient,
	legacyRoleId: string,
	legacyRoleSeq: number,
	canonicalRoleSeq: number,
): Promise<void> {
	await db.tenant.updateMany({
		where: { roleSeq: legacyRoleSeq },
		data: { roleSeq: canonicalRoleSeq },
	});
	await db.tenantAccessRequest.updateMany({
		where: { requestedRoleSeq: legacyRoleSeq },
		data: { requestedRoleSeq: canonicalRoleSeq },
	});
	await db.tenantAccessRequest.updateMany({
		where: { previousRoleSeq: legacyRoleSeq },
		data: { previousRoleSeq: canonicalRoleSeq },
	});

	await transferLegacyRoleAssignments(db, legacyRoleSeq, canonicalRoleSeq);

	await db.roleAssociation.deleteMany({
		where: { roleSeq: legacyRoleSeq },
	});
	await db.roleClassification.deleteMany({
		where: { roleSeq: legacyRoleSeq },
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

			await mergeLegacyRoleIntoCanonical(
				db,
				legacyRole.id,
				legacyRole.seq,
				canonicalRole.seq,
			);
		}

		await syncReferenceData(db);
	},
};
