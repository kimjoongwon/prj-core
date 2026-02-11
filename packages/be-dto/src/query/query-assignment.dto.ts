import type { Prisma } from "@cocrepo/prisma";
import { PrismaQueryDto } from "./prisma-query.dto";

export class QueryAssignmentDto extends PrismaQueryDto<Prisma.AssignmentWhereInput> {}
