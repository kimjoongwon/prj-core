import type { ReferenceDataMigration, ReferenceDataDbClient } from "./types";

const memberSelfDataAbilityConditions = [
	{ name: "Can 조회 사용자", conditions: { id: "${user.id}" } },
	{ name: "Can 수정 사용자", conditions: { id: "${user.id}" } },
	{
		name: "Can 조회 예약",
		conditions: { userSeq: "${user.seq}" },
	},
	{
		name: "Can 수정 예약",
		conditions: { userSeq: "${user.seq}" },
	},
] as const;

const obsoleteBrandingTranslationKeys = ["오노라 계정 센터"] as const;

async function reconcileIdentityReferenceCatalog(
	db: ReferenceDataDbClient,
): Promise<void> {
	for (const ability of memberSelfDataAbilityConditions) {
		const updated = await db.ability.updateMany({
			where: { name: ability.name },
			data: { conditions: ability.conditions },
		});
		if (updated.count !== 1) {
			throw new Error(`Missing code-owned ability reference: ${ability.name}`);
		}
	}

	await db.translation.deleteMany({
		where: { key: { in: [...obsoleteBrandingTranslationKeys] } },
	});
}

export const syncIdentityReferenceCatalogMigration: ReferenceDataMigration = {
	id: "20261025000000-sync-identity-reference-catalog",
	description: "회원 자기 데이터 권한 네 건과 이전 identity 번역 기준 데이터 정합성 보정",
	sourcePath: __filename,
	up: reconcileIdentityReferenceCatalog,
};
