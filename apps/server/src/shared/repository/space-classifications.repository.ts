import { Injectable } from "@nestjs/common";
import { Prisma, SpaceClassification } from "@shared/schema";
import { BaseRepository } from "../common/base.repository";
import { UseEntity } from "../decorator/use-dto.decorator";
import { PrismaService } from "../service/prisma.service";

@Injectable()
@UseEntity(SpaceClassification)
export class SpaceClassificationsRepository extends BaseRepository<
	Prisma.SpaceClassificationCreateArgs,
	Prisma.SpaceClassificationUpsertArgs,
	Prisma.SpaceClassificationUpdateArgs,
	Prisma.SpaceClassificationUpdateManyArgs,
	Prisma.SpaceClassificationDeleteArgs,
	Prisma.SpaceClassificationFindManyArgs,
	Prisma.SpaceClassificationCountArgs,
	Prisma.SpaceClassificationAggregateArgs,
	Prisma.SpaceClassificationDeleteManyArgs,
	Prisma.SpaceClassificationFindFirstArgs,
	Prisma.SpaceClassificationFindUniqueArgs,
	Prisma.SpaceClassificationGroupByArgs,
	Prisma.SpaceClassificationCreateManyArgs,
	SpaceClassification
> {
	constructor(prisma: PrismaService) {
		super(prisma, "SpaceClassification");
	}
}
