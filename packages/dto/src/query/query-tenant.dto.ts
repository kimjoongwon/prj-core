import type { Prisma } from "@cocrepo/prisma";
import { PrismaQueryDto } from "./prisma-query.dto";

export class QueryTenantDto extends PrismaQueryDto<Prisma.TenantWhereInput> {}
