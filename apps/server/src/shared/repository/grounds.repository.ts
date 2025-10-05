import { Injectable } from "@nestjs/common";
import { Ground, Prisma } from "@shared/schema";
import { BaseRepository } from "../common/base.repository";
import { UseEntity } from "@shared/schema";
import { PrismaService } from "../service/prisma.service";

@Injectable()
@UseEntity(Ground)
export class GroundsRepository extends BaseRepository<
	Prisma.GroundCreateArgs,
	Prisma.GroundUpsertArgs,
	Prisma.GroundUpdateArgs,
	Prisma.GroundUpdateManyArgs,
	Prisma.GroundDeleteArgs,
	Prisma.GroundFindManyArgs,
	Prisma.GroundCountArgs,
	Prisma.GroundAggregateArgs,
	Prisma.GroundDeleteManyArgs,
	Prisma.GroundFindFirstArgs,
	Prisma.GroundFindUniqueArgs,
	Prisma.GroundGroupByArgs,
	Prisma.GroundCreateManyArgs,
	Ground
> {
	constructor(prisma: PrismaService) {
		super(prisma, "Ground");
	}
}
