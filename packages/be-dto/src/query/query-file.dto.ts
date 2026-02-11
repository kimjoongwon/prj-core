import type { Prisma } from "@cocrepo/prisma";
import { PrismaQueryDto } from "./prisma-query.dto";

export class QueryFileDto extends PrismaQueryDto<Prisma.FileWhereInput> {}
