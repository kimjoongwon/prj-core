import { Injectable } from "@nestjs/common";
import { Group, Prisma } from "@shared/schema";
import { BaseRepository } from "../common/base.repository";
import { UseEntity } from "@shared/schema";
import { PrismaService } from "../service/prisma.service";

@Injectable()
@UseEntity(Group)
export class GroupsRepository extends BaseRepository<
	Prisma.GroupCreateArgs,
	Prisma.GroupUpsertArgs,
	Prisma.GroupUpdateArgs,
	Prisma.GroupUpdateManyArgs,
	Prisma.GroupDeleteArgs,
	Prisma.GroupFindManyArgs,
	Prisma.GroupCountArgs,
	Prisma.GroupAggregateArgs,
	Prisma.GroupDeleteManyArgs,
	Prisma.GroupFindFirstArgs,
	Prisma.GroupFindUniqueArgs,
	Prisma.GroupGroupByArgs,
	Prisma.GroupCreateManyAndReturnArgs,
	Group
> {
	constructor(prisma: PrismaService) {
		super(prisma, "Group");
	}
}
