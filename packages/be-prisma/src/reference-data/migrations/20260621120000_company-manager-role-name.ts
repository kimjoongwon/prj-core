import { Prisma } from "../../generated/client/client";
import { syncReferenceData } from "../sync-reference-data";
import type { ReferenceDataDbClient, ReferenceDataMigration } from "./types";

const COMPANY_MANAGER_ROLE_DATA = {
	name: "COMPANY_MANAGER",
	displayName: "Company 관리자",
	description:
		"특정 Company의 지점, 회원, 예약, 콘텐츠 등 운영 리소스를 관리하는 역할",
	removedAt: null,
} as const;

/**
 * 레거시 역할에 연결된 정책을 COMPANY_MANAGER로 옮기고 중복 연결은 제거합니다.
 */
async function transferRoleAssignments(
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

/**
 * SPACE_MANAGER 역할을 참조하는 운영 데이터를 COMPANY_MANAGER 역할로 병합합니다.
 */
async function mergeLegacyRoleIntoCompanyManager(
	db: ReferenceDataDbClient,
	legacyRoleId: string,
	legacyRoleSeq: number,
	companyManagerRoleSeq: number,
): Promise<void> {
	await db.tenant.updateMany({
		where: { roleSeq: legacyRoleSeq },
		data: { roleSeq: companyManagerRoleSeq },
	});
	await db.tenantAccessRequest.updateMany({
		where: { requestedRoleSeq: legacyRoleSeq },
		data: { requestedRoleSeq: companyManagerRoleSeq },
	});
	await db.tenantAccessRequest.updateMany({
		where: { previousRoleSeq: legacyRoleSeq },
		data: { previousRoleSeq: companyManagerRoleSeq },
	});

	await transferRoleAssignments(db, legacyRoleSeq, companyManagerRoleSeq);

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

/**
 * 이전 SPACE_MANAGER 시스템 정책과 그 연결을 제거합니다.
 */
async function removeSpaceManagerSystemPolicy(
	db: ReferenceDataDbClient,
): Promise<void> {
	const legacyPolicies = await db.policy.findMany({
		where: { name: "space-manager-system-policy" },
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

/**
 * 이미 20260620 마이그레이션이 실행된 DB에 남아 있을 수 있는 SPACE_MANAGER를 정리합니다.
 */
export const companyManagerRoleNameMigration: ReferenceDataMigration = {
	id: "20260621120000_company-manager-role-name",
	description: "Rename the system role SPACE_MANAGER to COMPANY_MANAGER.",
	sourcePath: __filename,
	async up(db) {
		await db.role.upsert({
			where: { name: COMPANY_MANAGER_ROLE_DATA.name },
			update: COMPANY_MANAGER_ROLE_DATA,
			create: COMPANY_MANAGER_ROLE_DATA,
		});

		const [legacyRole, companyManagerRole] = await Promise.all([
			db.role.findUnique({ where: { name: "SPACE_MANAGER" } }),
			db.role.findUnique({ where: { name: "COMPANY_MANAGER" } }),
		]);

		if (legacyRole && companyManagerRole) {
			await mergeLegacyRoleIntoCompanyManager(
				db,
				legacyRole.id,
				legacyRole.seq,
				companyManagerRole.seq,
			);
		}

		await removeSpaceManagerSystemPolicy(db);
		await syncReferenceData(db);
	},
};
