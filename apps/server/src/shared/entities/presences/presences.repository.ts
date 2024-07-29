import { PrismaService } from 'nestjs-prisma';
import { Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PresencesRepository {
  constructor(private readonly prisma: PrismaService) {}
  upsert(args: Prisma.PresenceUpsertArgs) {
    return this.prisma.presence.upsert(args);
  }

  findMany(args: Prisma.PresenceFindManyArgs) {
    return this.prisma.presence.findMany(args);
  }

  update(args: Prisma.PresenceUpdateArgs) {
    return this.prisma.presence.update(args);
  }
}
