---
to: src/shared/repositories/<%= h.inflection.pluralize(name) %>.repository.ts
---
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { UseEntity } from '../decorators/use-dto.decorator';
import { BaseRepository } from '../common/base.repository';
import { <%= h.changeCase.pascal(name) %> } from '../entities';

@Injectable()
@UseEntity(<%= h.changeCase.pascal(name) %>)
export class <%= h.inflection.pluralize(h.changeCase.pascal(name)) %>Repository extends BaseRepository<
  Prisma.<%= h.changeCase.pascal(name) %>CreateArgs,
  Prisma.<%= h.changeCase.pascal(name) %>UpsertArgs,
  Prisma.<%= h.changeCase.pascal(name) %>UpdateArgs,
  Prisma.<%= h.changeCase.pascal(name) %>UpdateManyArgs,
  Prisma.<%= h.changeCase.pascal(name) %>DeleteArgs,
  Prisma.<%= h.changeCase.pascal(name) %>FindManyArgs,
  Prisma.<%= h.changeCase.pascal(name) %>CountArgs,
  Prisma.<%= h.changeCase.pascal(name) %>AggregateArgs,
  Prisma.<%= h.changeCase.pascal(name) %>DeleteManyArgs,
  Prisma.<%= h.changeCase.pascal(name) %>FindFirstArgs,
  Prisma.<%= h.changeCase.pascal(name) %>FindUniqueArgs,
  Prisma.<%= h.changeCase.pascal(name) %>GroupByArgs,
  Prisma.<%= h.changeCase.pascal(name) %>CreateManyArgs,
  <%= h.changeCase.pascal(name) %>
> {
  constructor(prisma: PrismaService) {
    super(prisma, '<%= h.changeCase.pascal(name) %>');
  }
}
