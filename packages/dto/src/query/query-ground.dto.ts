import type { Prisma } from "@cocrepo/prisma";
import { PrismaQueryDto } from "./prisma-query.dto";

export class QueryGroundDto extends PrismaQueryDto<Prisma.GroundWhereInput> {}
