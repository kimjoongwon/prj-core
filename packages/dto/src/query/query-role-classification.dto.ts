import type { Prisma } from "@cocrepo/prisma";
import { PrismaQueryDto } from "./prisma-query.dto";

export class QueryRoleClassificationDto extends PrismaQueryDto<Prisma.RoleClassificationWhereInput> {}
