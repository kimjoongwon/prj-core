import type { Prisma } from "@cocrepo/prisma";
import { PrismaQueryDto } from "./prisma-query.dto";

export class QueryActionDto extends PrismaQueryDto<Prisma.ActionWhereInput> {}
