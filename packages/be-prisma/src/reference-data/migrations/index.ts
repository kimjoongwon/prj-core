import { identityPrismaV2ReferenceBaseline } from "./20260802001000_identity-prisma-v2-reference-baseline";
import { removeSafeWalletReferenceData } from "./20261027130000_remove_safe_wallet_reference_data";
import type { ReferenceDataMigration } from "./types";

export const referenceDataMigrations: ReferenceDataMigration[] = [
	identityPrismaV2ReferenceBaseline,
	removeSafeWalletReferenceData,
];
