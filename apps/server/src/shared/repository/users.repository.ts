import { Injectable } from '@nestjs/common';
import type { Prisma } from '@shared/schema';
import { User } from '@shared/schema';
import type { PrismaService } from 'nestjs-prisma';
import { BaseRepository } from '../common/base.repository';
import { UseEntity } from '../decorator/use-dto.decorator';

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
    super(prisma, 'User');
  }
}
