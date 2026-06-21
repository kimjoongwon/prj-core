import { initialReferenceDataMigration } from "./20260317190000_initial-reference-data";
import { authEmailTemplatesMigration } from "./20260323143000_auth-email-templates";
import { legacySystemRoleBridgeMigration } from "./20260323150000_legacy-system-role-bridge";
import { secondarySuperManagerMigration } from "./20260323160000_secondary-super-manager";
import { oidcClientAuthShellFieldsMigration } from "./20260325110000_oidc-client-auth-shell-fields";
import { adminMenuPageReferenceCatalogMigration } from "./20260406120000_admin-menu-page-reference-catalog";
import { oidcClientIdRenameMigration } from "./20260414110000_oidc-client-id-rename";
import { systemAdminBranchManageTenantsMigration } from "./20260427030000_system-admin-branch-manage-tenants";
import { systemAdminNonPlatformManageTenantsMigration } from "./20260427031000_system-admin-non-platform-manage-tenants";
import { systemRoleDomainNamesMigration } from "./20260620120000_system-role-domain-names";
import { companyManagerRoleNameMigration } from "./20260621120000_company-manager-role-name";
import type { ReferenceDataMigration } from "./types";

export const referenceDataMigrations: ReferenceDataMigration[] = [
	initialReferenceDataMigration,
	authEmailTemplatesMigration,
	legacySystemRoleBridgeMigration,
	secondarySuperManagerMigration,
	oidcClientAuthShellFieldsMigration,
	adminMenuPageReferenceCatalogMigration,
	oidcClientIdRenameMigration,
	systemAdminBranchManageTenantsMigration,
	systemAdminNonPlatformManageTenantsMigration,
	systemRoleDomainNamesMigration,
	companyManagerRoleNameMigration,
];
