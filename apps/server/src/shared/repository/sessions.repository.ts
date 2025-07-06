import { Injectable } from '@nestjs/common';
import { Prisma } from '@shared/schema';
import { PrismaService } from 'nestjs-prisma';
import { UseEntity } from '../decorator/use-dto.decorator';
import { BaseRepository } from '../common/base.repository';
import { Session } from '@shared/schema';

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
