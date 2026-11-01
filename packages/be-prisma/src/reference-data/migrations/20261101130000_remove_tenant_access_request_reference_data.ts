import type { ReferenceDataMigration } from "./types";

const TENANT_ACCESS_REQUEST_SUBJECT_NAMES = ["TenantAccessRequest"] as const;

/** 과거 DMMF 동기화로 생성됐을 수 있는 접근 신청 권한 그래프를 FK 순서로 제거합니다. */
export const removeTenantAccessRequestReferenceData: ReferenceDataMigration = {
	id: "20261101130000_remove_tenant_access_request_reference_data",
	description:
		"Remove legacy TenantAccessRequest subject and permission entries.",
	sourcePath: __filename,
	async up(db) {
		const subjects = await db.subject.findMany({
			where: { name: { in: [...TENANT_ACCESS_REQUEST_SUBJECT_NAMES] } },
			select: { id: true },
		});
		const subjectIds = subjects.map(({ id }) => id);
		if (subjectIds.length === 0) return;

		const abilities = await db.ability.findMany({
			where: { subjectId: { in: subjectIds } },
			select: { id: true },
		});
		const abilityIds = abilities.map(({ id }) => id);
		if (abilityIds.length > 0) {
			await db.policyEntry.deleteMany({
				where: { abilityId: { in: abilityIds } },
			});
			await db.ability.deleteMany({ where: { id: { in: abilityIds } } });
		}
		await db.subject.deleteMany({ where: { id: { in: subjectIds } } });
	},
};
