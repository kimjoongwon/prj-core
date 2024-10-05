import { Injectable } from '@nestjs/common';
import { CreateEmailDto } from './dtos/create-email.dto';
import { UpdateEmailDto } from './dtos/update-email.dto';
import { EmailsRepository } from './emails.repository';
import { EmailQueryDto } from './dtos/email-query.dto';
import { PaginationMananger } from '../../utils';
import { IService } from '../../types/interfaces/service.interface';
import { Prisma } from '@prisma/client';

@Injectable()
export class EmailsService implements IService {
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
    const args = PaginationMananger.toArgs(query);
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
