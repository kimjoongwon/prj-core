import type { Roles as RolesEnum } from "@cocrepo/prisma";
import { SetMetadata } from "@nestjs/common";

export const ROLES_KEY = "roles";

export const Roles = (roles: RolesEnum[]) => SetMetadata(ROLES_KEY, roles);
