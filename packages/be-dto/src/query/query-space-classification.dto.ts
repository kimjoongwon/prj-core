import type { Prisma } from "@cocrepo/prisma";
import { PrismaQueryDto } from "./prisma-query.dto";

export class QuerySpaceClassificationDto extends PrismaQueryDto<Prisma.SpaceClassificationWhereInput> {}
