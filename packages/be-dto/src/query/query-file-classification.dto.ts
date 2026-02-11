import type { Prisma } from "@cocrepo/prisma";
import { PrismaQueryDto } from "./prisma-query.dto";

export class QueryFileClassificationDto extends PrismaQueryDto<Prisma.FileClassificationWhereInput> {}
