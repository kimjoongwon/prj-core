import { Injectable } from "@nestjs/common";
import { Assignment, Prisma } from "@shared/schema";
import { PrismaService } from "../service/prisma.service";
import { BaseRepository } from "../common/base.repository";
import { UseEntity } from "../decorator/use-dto.decorator";

@Injectable()
@UseEntity(Assignment)
export class AssignmentsRepository extends BaseRepository<
	Prisma.AssignmentCreateArgs,
	Prisma.AssignmentUpsertArgs,
	Prisma.AssignmentUpdateArgs,
	Prisma.AssignmentUpdateManyArgs,
	Prisma.AssignmentDeleteArgs,
	Prisma.AssignmentFindManyArgs,
	Prisma.AssignmentCountArgs,
	Prisma.AssignmentAggregateArgs,
	Prisma.AssignmentDeleteManyArgs,
	Prisma.AssignmentFindFirstArgs,
	Prisma.AssignmentFindUniqueArgs,
	Prisma.AssignmentGroupByArgs,
	Prisma.AssignmentCreateManyArgs,
	Assignment
> {
	constructor(prisma: PrismaService) {
		super(prisma, "Assignment");
	}
}
