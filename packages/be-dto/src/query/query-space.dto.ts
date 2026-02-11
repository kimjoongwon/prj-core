import type { Prisma } from "@cocrepo/prisma";
import { PrismaQueryDto } from "./prisma-query.dto";

export class QuerySpaceDto extends PrismaQueryDto<Prisma.SpaceWhereInput> {}
