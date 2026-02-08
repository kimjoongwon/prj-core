import type { Prisma } from "@cocrepo/prisma";
import { PrismaQueryDto } from "./prisma-query.dto";

export class QueryRoutineDto extends PrismaQueryDto<Prisma.RoutineWhereInput> {}
