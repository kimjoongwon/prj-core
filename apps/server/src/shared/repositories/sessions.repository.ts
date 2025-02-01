import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { UseEntity } from '../decorators/use-dto.decorator';
import { BaseRepository } from '../common/base.repository';
import { Session } from '../entities/session.entity';

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
  Prisma.GroupCreateManyArgs,
  Session
> {
  constructor(prisma: PrismaService) {
    super(prisma, 'Session');
  }
}
