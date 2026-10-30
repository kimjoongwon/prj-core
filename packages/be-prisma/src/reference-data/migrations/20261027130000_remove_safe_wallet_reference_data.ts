import type { ReferenceDataMigration } from "./types";

const SAFE_WALLET_SUBJECT_NAMES = [
	"menu:wallets",
	"menu:wallets:list",
	"menu:wallets:transactions",
] as const;

/** Remove the legacy SafeWallet permission graph in FK-safe order. */
export const removeSafeWalletReferenceData: ReferenceDataMigration = {
	id: "20261027130000_remove_safe_wallet_reference_data",
	description: "Remove legacy SafeWallet menu subjects and permission entries.",
	sourcePath: __filename,
	async up(db) {
		const subjects = await db.subject.findMany({
			where: { name: { in: [...SAFE_WALLET_SUBJECT_NAMES] } },
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
