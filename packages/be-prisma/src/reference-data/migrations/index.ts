import { identityPrismaV2ReferenceBaseline } from "./20260802001000_identity-prisma-v2-reference-baseline";
import { syncIdentityReferenceCatalogMigration } from "./20261025000000_sync_identity_reference_catalog";
import type { ReferenceDataMigration } from "./types";

export const referenceDataMigrations: ReferenceDataMigration[] = [
	identityPrismaV2ReferenceBaseline,
	syncIdentityReferenceCatalogMigration,
];
