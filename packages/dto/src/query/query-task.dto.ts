import type { Prisma } from "@cocrepo/prisma";
import { PrismaQueryDto } from "./prisma-query.dto";

export class QueryTaskDto extends PrismaQueryDto<Prisma.TaskWhereInput> {}
