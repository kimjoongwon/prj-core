import { Injectable } from "@nestjs/common";
import { Prisma, Session } from "@shared/schema";
import { BaseRepository } from "../common/base.repository";
import { UseEntity } from "@shared/schema";
import { PrismaService } from "../service/prisma.service";

@Injectable()
@UseEntity(Session)
export class SessionsRepository extends BaseRepository<
	Prisma.SessionCreateArgs,
	Prisma.SessionUpsertArgs,
	Prisma.SessionUpdateArgs,
	Prisma.SessionUpdateManyArgs,
	Prisma.SessionDeleteArgs,
	Prisma.SessionFindManyArgs,
	Prisma.SessionCountArgs,
	Prisma.SessionAggregateArgs,
	Prisma.SessionDeleteManyArgs,
	Prisma.SessionFindFirstArgs,
	Prisma.SessionFindUniqueArgs,
	Prisma.SessionGroupByArgs,
	Prisma.SessionCreateManyAndReturnArgs,
	Session
> {
	constructor(prisma: PrismaService) {
		super(prisma, "Session");
	}
}
