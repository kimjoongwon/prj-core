import { Injectable } from "@nestjs/common";
import { Prisma, UseEntity, User } from "@shared/schema";
import { BaseRepository } from "../common/base.repository";
import { PrismaService } from "../service/prisma.service";

@Injectable()
@UseEntity(User)
export class UsersRepository extends BaseRepository<
	Prisma.UserCreateArgs,
	Prisma.UserUpsertArgs,
	Prisma.UserUpdateArgs,
	Prisma.UserUpdateManyArgs,
	Prisma.UserDeleteArgs,
	Prisma.UserFindManyArgs,
	Prisma.UserCountArgs,
	Prisma.UserAggregateArgs,
	Prisma.UserDeleteManyArgs,
	Prisma.UserFindFirstArgs,
	Prisma.UserFindUniqueArgs,
	Prisma.UserGroupByArgs,
	Prisma.UserCreateManyArgs,
	User
> {
	constructor(prisma: PrismaService) {
		super(prisma, "User");
	}
}
