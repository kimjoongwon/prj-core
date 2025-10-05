import { Injectable } from "@nestjs/common";
import { Prisma, SpaceAssociation } from "@shared/schema";
import { BaseRepository } from "../common/base.repository";
import { UseEntity } from "@shared/schema";
import { PrismaService } from "../service/prisma.service";

@Injectable()
@UseEntity(SpaceAssociation)
export class SpaceAssociationsRepository extends BaseRepository<
	Prisma.SpaceAssociationCreateArgs,
	Prisma.SpaceAssociationUpsertArgs,
	Prisma.SpaceAssociationUpdateArgs,
	Prisma.SpaceAssociationUpdateManyArgs,
	Prisma.SpaceAssociationDeleteArgs,
	Prisma.SpaceAssociationFindManyArgs,
	Prisma.SpaceAssociationCountArgs,
	Prisma.SpaceAssociationAggregateArgs,
	Prisma.SpaceAssociationDeleteManyArgs,
	Prisma.SpaceAssociationFindFirstArgs,
	Prisma.SpaceAssociationFindUniqueArgs,
	Prisma.SpaceAssociationGroupByArgs,
	Prisma.SpaceAssociationCreateManyArgs,
	SpaceAssociation
> {
	constructor(prisma: PrismaService) {
		super(prisma, "SpaceAssociation");
	}
}
