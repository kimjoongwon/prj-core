import { Injectable } from '@nestjs/common';
import type { Prisma } from '@shared/schema';
import { Session } from '@shared/schema';
import type { PrismaService } from 'nestjs-prisma';
import { BaseRepository } from '../common/base.repository';
import { UseEntity } from '../decorator/use-dto.decorator';

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
    super(prisma, 'Session');
  }
}
