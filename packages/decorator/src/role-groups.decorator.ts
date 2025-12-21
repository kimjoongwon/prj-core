import { SetMetadata } from "@nestjs/common";

export const ROLE_GROUPS_KEY = "roleGroups";

export const RoleGroups = (groups: string[]) =>
	SetMetadata(ROLE_GROUPS_KEY, groups);
