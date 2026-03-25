import { initialReferenceDataMigration } from "./20260317190000_initial-reference-data";
import { authEmailTemplatesMigration } from "./20260323143000_auth-email-templates";
import { secondarySuperManagerMigration } from "./20260323160000_secondary-super-manager";
import { oidcClientAuthShellFieldsMigration } from "./20260325110000_oidc-client-auth-shell-fields";
import type { ReferenceDataMigration } from "./types";

export const referenceDataMigrations: ReferenceDataMigration[] = [
	initialReferenceDataMigration,
	authEmailTemplatesMigration,
	secondarySuperManagerMigration,
	oidcClientAuthShellFieldsMigration,
];
