import type { Roles as RolesEnum } from "@cocrepo/prisma";
import { Reflector } from "@nestjs/core";

export const Roles: ReturnType<typeof Reflector.createDecorator<RolesEnum[]>> =
	Reflector.createDecorator<RolesEnum[]>();
