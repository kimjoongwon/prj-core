import type { Prisma } from "@cocrepo/prisma";
import { PrismaQueryDto } from "./prisma-query.dto";

export class QueryRoleDto extends PrismaQueryDto<Prisma.RoleWhereInput> {}
