import { Injectable } from "@nestjs/common";
import { Prisma, Space } from "@shared/schema";
import { BaseRepository } from "../common/base.repository";
import { UseEntity } from "@shared/schema";
import { PrismaService } from "../service/prisma.service";

@Injectable()
@UseEntity(Space)
export class SpacesRepository extends BaseRepository<
	Prisma.SpaceCreateArgs,
	Prisma.SpaceUpsertArgs,
	Prisma.SpaceUpdateArgs,
	Prisma.SpaceUpdateManyArgs,
	Prisma.SpaceDeleteArgs,
	Prisma.SpaceFindManyArgs,
	Prisma.SpaceCountArgs,
	Prisma.SpaceAggregateArgs,
	Prisma.SpaceDeleteManyArgs,
	Prisma.SpaceFindFirstArgs,
	Prisma.SpaceFindUniqueArgs,
	Prisma.SpaceGroupByArgs,
	Prisma.SpaceCreateManyArgs,
	Space
> {
	constructor(prisma: PrismaService) {
		super(prisma, "Space");
	}
}
