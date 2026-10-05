import type { SystemRoleName } from "@cocrepo/constant";
import { SetMetadata } from "@nestjs/common";

export const ROLES_KEY = "roles";

export const Roles = (roles: SystemRoleName[]) => SetMetadata(ROLES_KEY, roles);
