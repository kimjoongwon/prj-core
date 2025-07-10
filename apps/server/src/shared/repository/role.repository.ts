import { Injectable } from '@nestjs/common';
import type { Prisma } from '@shared/schema';
import { Role } from '@shared/schema';
import type { PrismaService } from 'nestjs-prisma';
import { BaseRepository } from '../common/base.repository';
import { UseEntity } from '../decorator/use-dto.decorator';

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
