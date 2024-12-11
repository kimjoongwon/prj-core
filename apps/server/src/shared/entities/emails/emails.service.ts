import { Injectable } from '@nestjs/common';
import { CreateEmailDto } from './dtos/create-email.dto';
import { EmailsRepository } from './emails.repository';
import { EmailQueryDto } from './dtos/email-query.dto';
import { Prisma } from '@prisma/client';
import { PaginationUtil } from '@shared/utils';

@Injectable()
export class EmailsService {
  constructor(private readonly repository: EmailsRepository) {}

  getUnique(args: Prisma.EmailFindUniqueArgs) {
    return this.repository.findUnique(args);
  }

  getFirst(id: string) {
    return this.repository.findFirst({ where: { id } });
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

  create(createEmailDto: CreateEmailDto) {
    return this.repository.create({ data: createEmailDto });
  }

  async getManyByQuery(query: EmailQueryDto) {
    const args = PaginationUtil.toArgs(query);
    const emails = await this.repository.findMany(args);
    const count = await this.repository.count(args);
    return {
      emails,
      count,
    };
  }

  update(args: Prisma.EmailUpdateArgs) {
    return this.repository.update(args);
  }

  remove(id: string) {
    return this.repository.update({
      where: { id },
      data: { removedAt: new Date() },
    });
  }
}
