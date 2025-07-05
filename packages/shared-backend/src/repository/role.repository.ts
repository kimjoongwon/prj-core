import { Injectable } from '@nestjs/common';
import { Prisma } from '@shared/schema';
import { PrismaService } from 'nestjs-prisma';
import { UseEntity } from '../decorator/use-dto.decorator';
import { BaseRepository } from '../common/base.repository';
import { Role } from '@shared/schema';

@Injectable()
@UseEntity(Role)
export class RolesRepository extends BaseRepository<
  Prisma.RoleCreateArgs,
  Prisma.RoleUpsertArgs,
  Prisma.RoleUpdateArgs,
  Prisma.RoleUpdateManyArgs,
  Prisma.RoleDeleteArgs,
  Prisma.RoleFindManyArgs,
  Prisma.RoleCountArgs,
  Prisma.RoleAggregateArgs,
  Prisma.RoleDeleteManyArgs,
  Prisma.RoleFindFirstArgs,
  Prisma.RoleFindUniqueArgs,
  Prisma.RoleGroupByArgs,
  Prisma.RoleCreateManyAndReturnArgs,
  Role
> {
  constructor(prisma: PrismaService) {
    super(prisma, 'Role');
  }
}
