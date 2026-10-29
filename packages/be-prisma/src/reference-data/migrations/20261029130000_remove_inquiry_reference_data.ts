import type { ReferenceDataMigration } from "./types";

const INQUIRY_SUBJECT_NAMES = [
	"menu:inquiries",
	"menu:inquiries:list",
	"menu:inquiries:direct",
	"menu:inquiries:answered",
	"menu:inquiries:faq",
] as const;

/** Remove the legacy inquiry permission graph in FK-safe order. */
export const removeInquiryReferenceData: ReferenceDataMigration = {
	id: "20261029130000_remove_inquiry_reference_data",
	description: "Remove legacy inquiry menu subjects and permission entries.",
	sourcePath: __filename,
	async up(db) {
		const subjects = await db.subject.findMany({
			where: { name: { in: [...INQUIRY_SUBJECT_NAMES] } },
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
