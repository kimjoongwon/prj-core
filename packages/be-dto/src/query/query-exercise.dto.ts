import type { Prisma } from "@cocrepo/prisma";
import { PrismaQueryDto } from "./prisma-query.dto";

export class QueryExerciseDto extends PrismaQueryDto<Prisma.ExerciseWhereInput> {}
