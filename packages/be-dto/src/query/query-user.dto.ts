import type { Prisma } from "@cocrepo/prisma";
import { PrismaQueryDto } from "./prisma-query.dto";

export class QueryUserDto extends PrismaQueryDto<Prisma.UserWhereInput> {}
