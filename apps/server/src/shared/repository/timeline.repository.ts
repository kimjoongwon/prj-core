import { Injectable } from "@nestjs/common";
import { Prisma, Timeline } from "@shared/schema";
import { BaseRepository } from "../common/base.repository";
import { UseEntity } from "@shared/schema";
import { PrismaService } from "../service/prisma.service";

@Injectable()
@UseEntity(Timeline)
export class TimelinesRepository extends BaseRepository<
	Prisma.TimelineCreateArgs,
	Prisma.TimelineUpsertArgs,
	Prisma.TimelineUpdateArgs,
	Prisma.TimelineUpdateManyArgs,
	Prisma.TimelineDeleteArgs,
	Prisma.TimelineFindManyArgs,
	Prisma.TimelineCountArgs,
	Prisma.TimelineAggregateArgs,
	Prisma.TimelineDeleteManyArgs,
	Prisma.TimelineFindFirstArgs,
	Prisma.TimelineFindUniqueArgs,
	Prisma.TimelineGroupByArgs,
	Prisma.TimelineCreateManyAndReturnArgs,
	Timeline
> {
	constructor(prisma: PrismaService) {
		super(prisma, "Timeline");
	}
}
