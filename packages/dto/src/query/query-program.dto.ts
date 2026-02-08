import type { Prisma } from "@cocrepo/prisma";
import { PrismaQueryDto } from "./prisma-query.dto";

export class QueryProgramDto extends PrismaQueryDto<Prisma.ProgramWhereInput> {}
