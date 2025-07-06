import { Injectable } from '@nestjs/common';
import { Prisma } from '@shared/schema';
import { PrismaService } from 'nestjs-prisma';
import { UseEntity } from '../decorator/use-dto.decorator';
import { BaseRepository } from '../common/base.repository';
import { User } from '@shared/schema';

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
