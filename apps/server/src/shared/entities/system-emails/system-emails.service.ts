import { Injectable } from '@nestjs/common';
import { CreateSystemEmailDto } from './dtos/create-system-email.dto';
import { UpdateSystemEmailDto } from './dtos/update-system-email.dto';
import { SystemEmailsRepository } from './system-emails.repository';
import { SystemEmailQueryDto } from './dtos/system-email-query.dto';
import { PaginationMananger } from '../../utils';
import { IService } from '../../types/interfaces/service.interface';
import { Prisma } from '@prisma/client';

@Injectable()
export class SystemEmailsService implements IService {
  constructor(private readonly repository: SystemEmailsRepository) {}

  getUnique(args: Prisma.SystemEmailFindUniqueArgs) {
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

  create(createSystemEmailDto: CreateSystemEmailDto) {
    return this.repository.create({ data: createSystemEmailDto });
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

  update(systemEmailId: string, updateSystemEmailDto: UpdateSystemEmailDto) {
    return this.repository.update({
      where: {
        id: systemEmailId,
      },
      data: updateSystemEmailDto,
    });
  }

  remove(id: string) {
    return this.repository.update({
      where: { id },
      data: { removedAt: new Date() },
    });
  }
}
