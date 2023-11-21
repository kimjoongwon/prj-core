import { Injectable } from '@nestjs/common';
import { last } from 'lodash';
import { PrismaService } from '../global/prisma/prisma.service';
import { queryBuilder } from '../../common/utils/query-builder';
import { CreateSessionInput } from './dto/create-session.input';
import { GetSessionsArgs } from './dto/get-sessions.args';
import { UpdateSessionInput } from './dto/update-session.input';
import { SessionForm, defaultSessionForm } from './models/session-form.model';
import { PaginatedSession } from './models/paginated-session.model';

@Injectable()
export class SessionsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createSessionInput: CreateSessionInput) {
    return this.prisma.session.create({
      data: createSessionInput,
    });
  }

  findForm(id: string): SessionForm {
    return defaultSessionForm;
  }

  async findPaginatedSession(args: GetSessionsArgs): Promise<PaginatedSession> {
    const query = queryBuilder(args, []);

    const sessions = await this.prisma.session.findMany({
      ...query,
      include: {
        timelines: true,
      },
    });

    const totalCount = await this.prisma.session.count({
      where: query?.where,
    });

    const endCursor = last(sessions)?.id;

    return {
      edges: sessions.map(session => ({ node: session })),
      nodes: sessions,
      pageInfo: {
        totalCount,
        endCursor,
        hasNextPage: !(sessions.length < args.take),
      },
    };
  }

  delete(id: string) {
    return this.prisma.session.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  findOne(id: string) {
    return this.prisma.session.findUnique({
      where: { id },
    });
  }

  update(updateCategoryInput: UpdateSessionInput) {
    return this.prisma.session.update({
      where: { id: updateCategoryInput.id },
      data: updateCategoryInput,
    });
  }
}
