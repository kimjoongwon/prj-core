import { syncReferenceData } from "../sync-reference-data";
import type { ReferenceDataDbClient, ReferenceDataMigration } from "./types";

const COMPANY_MANAGER_ROLE_DATA = {
	name: "COMPANY_MANAGER",
	displayName: "Company 관리자",
	description:
		"특정 Company의 지점, 회원, 예약, 콘텐츠 등 운영 리소스를 관리하는 역할",
	isSystem: true,
	removedAt: null,
} as const;

/**
 * 레거시 역할에 연결된 정책을 COMPANY_MANAGER로 옮기고 중복 연결은 제거합니다.
 */
async function transferRolePolicies(
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
			await db.rolePolicy.delete({ where: { id: legacyRolePolicy.id } });
			continue;
		}

		await db.rolePolicy.update({
			where: { id: legacyRolePolicy.id },
			data: { roleId: canonicalRoleId },
		});
	}
}

/**
 * SPACE_MANAGER 역할을 참조하는 운영 데이터를 COMPANY_MANAGER 역할로 병합합니다.
 */
async function mergeLegacyRoleIntoCompanyManager(
	db: ReferenceDataDbClient,
	legacyRoleId: string,
	companyManagerRoleId: string,
): Promise<void> {
	await db.tenant.updateMany({
		where: { roleId: legacyRoleId },
		data: { roleId: companyManagerRoleId },
	});
	await db.tenantAccessRequest.updateMany({
		where: { requestedRoleId: legacyRoleId },
		data: { requestedRoleId: companyManagerRoleId },
	});
	await db.tenantAccessRequest.updateMany({
		where: { previousRoleId: legacyRoleId },
		data: { previousRoleId: companyManagerRoleId },
	});

	await transferRolePolicies(db, legacyRoleId, companyManagerRoleId);

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

/**
 * 이전 SPACE_MANAGER 시스템 정책과 그 연결을 제거합니다.
 */
async function removeSpaceManagerSystemPolicy(
	db: ReferenceDataDbClient,
): Promise<void> {
	const legacyPolicies = await db.policy.findMany({
		where: { name: "space-manager-system-policy" },
		select: { id: true },
	});
	if (legacyPolicies.length === 0) {
		return;
	}

	const legacyPolicyIds = legacyPolicies.map((policy) => policy.id);
	await db.rolePolicy.deleteMany({
		where: { policyId: { in: legacyPolicyIds } },
	});
	await db.userPolicy.deleteMany({
		where: { policyId: { in: legacyPolicyIds } },
	});
	await db.policyAbility.deleteMany({
		where: { policyId: { in: legacyPolicyIds } },
	});
	await db.policy.deleteMany({
		where: { id: { in: legacyPolicyIds } },
	});
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
				companyManagerRole.id,
			);
		}

		await removeSpaceManagerSystemPolicy(db);
		await syncReferenceData(db);
	},
};
