import type { Prisma } from "@cocrepo/prisma";
import { PrismaQueryDto } from "./prisma-query.dto";

export class QueryUserClassificationDto extends PrismaQueryDto<Prisma.UserClassificationWhereInput> {}
