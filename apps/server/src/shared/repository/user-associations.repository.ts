import { Injectable } from "@nestjs/common";
import { Prisma, UserAssociation } from "@shared/schema";
import { BaseRepository } from "../common/base.repository";
import { UseEntity } from "@shared/schema";
import { PrismaService } from "../service/prisma.service";

@Injectable()
@UseEntity(UserAssociation)
export class UserAssociationsRepository extends BaseRepository<
	Prisma.UserAssociationCreateArgs,
	Prisma.UserAssociationUpsertArgs,
	Prisma.UserAssociationUpdateArgs,
	Prisma.UserAssociationUpdateManyArgs,
	Prisma.UserAssociationDeleteArgs,
	Prisma.UserAssociationFindManyArgs,
	Prisma.UserAssociationCountArgs,
	Prisma.UserAssociationAggregateArgs,
	Prisma.UserAssociationDeleteManyArgs,
	Prisma.UserAssociationFindFirstArgs,
	Prisma.UserAssociationFindUniqueArgs,
	Prisma.UserAssociationGroupByArgs,
	Prisma.UserAssociationCreateManyArgs,
	UserAssociation
> {
	constructor(prisma: PrismaService) {
		super(prisma, "UserAssociation");
	}
}
