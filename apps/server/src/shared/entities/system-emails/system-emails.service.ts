import { Injectable } from '@nestjs/common';
import { SystemEmailsRepository } from './system-emails.repository';
import { SystemEmailQueryDto } from './dtos/system-email-query.dto';
import { PaginationMananger } from '../../utils';
import { Prisma } from '@prisma/client';

@Injectable()
export class SystemEmailsService {
  constructor(private readonly repository: SystemEmailsRepository) {}

  getUnique(args: Prisma.SystemEmailFindUniqueArgs) {
    return this.repository.findUnique(args);
  }

  getFirst(args: Prisma.SystemEmailFindFirstArgs) {
    return this.repository.findFirst(args);
  }

  removeMany(ids: string[]) {
    return this.repository.updateMany({
      where: {
        id: {
          in: ids,
        },
      },
      data: {
        removedAt: new Date(),
      },
    });
  }

  delete(id: string) {
    return this.repository.delete({ where: { id } });
  }

  create(args: Prisma.SystemEmailCreateArgs) {
    return this.repository.create(args);
  }

  async getManyByQuery(pageQuery: SystemEmailQueryDto) {
    const args = PaginationMananger.toArgs(pageQuery);
    const systemEmails = await this.repository.findMany(args);
    const count = await this.repository.count(args);
    return {
      systemEmails,
      count,
    };
  }

  update(args: Prisma.SystemEmailUpdateArgs) {
    return this.repository.update(args);
  }

  remove(id: string) {
    return this.repository.update({
      where: { id },
      data: { removedAt: new Date() },
    });
  }
}
