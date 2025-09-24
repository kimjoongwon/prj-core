import { Injectable } from "@nestjs/common";
import { Prisma, RoleClassification } from "@shared/schema";
import { BaseRepository } from "../common/base.repository";
import { UseEntity } from "../decorator/use-dto.decorator";
import { PrismaService } from "../service/prisma.service";

@Injectable()
@UseEntity(RoleClassification)
export class RoleClassificationsRepository extends BaseRepository<
	Prisma.RoleClassificationCreateArgs,
	Prisma.RoleClassificationUpsertArgs,
	Prisma.RoleClassificationUpdateArgs,
	Prisma.RoleClassificationUpdateManyArgs,
	Prisma.RoleClassificationDeleteArgs,
	Prisma.RoleClassificationFindManyArgs,
	Prisma.RoleClassificationCountArgs,
	Prisma.RoleClassificationAggregateArgs,
	Prisma.RoleClassificationDeleteManyArgs,
	Prisma.RoleClassificationFindFirstArgs,
	Prisma.RoleClassificationFindUniqueArgs,
	Prisma.RoleClassificationGroupByArgs,
	Prisma.RoleClassificationCreateManyArgs,
	RoleClassification
> {
	constructor(prisma: PrismaService) {
		super(prisma, "RoleClassification");
	}
}
