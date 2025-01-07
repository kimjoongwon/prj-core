import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { UseEntity } from '../decorators/use-dto.decorator';
import { BaseRepository } from '../common/base.repository';
import { User } from '../entities/user.entity';

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
    super(prisma, 'Service');
  }
}
