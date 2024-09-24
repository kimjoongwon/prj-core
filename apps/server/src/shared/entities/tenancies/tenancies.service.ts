import { Injectable } from '@nestjs/common';
import { CreateTenancyDto } from './dto/create-tenancy.dto';
import { TenanciesRepository } from './tenancies.repository';
import { IService } from '../../types';
import { TenancyQueryDto } from './dto/tenancy-query.dto';
import { PaginationMananger } from '../../utils';
import { UpdateTenancyDto } from './dto/update-tenancy.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class TenanciesService implements IService {
  constructor(private readonly repository: TenanciesRepository) {}

  getUnique(args: Prisma.TenancyFindUniqueArgs) {
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

  create(args: Prisma.TenancyCreateArgs) {
    return this.repository.create(args);
  }

  async getManyByQuery(query: TenancyQueryDto) {
    const args = PaginationMananger.toArgs(query);
    const templates = await this.repository.findMany(args);
    const count = await this.repository.count(args);
    return {
      templates,
      count,
    };
  }

  update(templateId: string, updateTenancyDto: UpdateTenancyDto) {
    return this.repository.update({
      where: {
        id: templateId,
      },
      data: updateTenancyDto,
    });
  }

  remove(id: string) {
    return this.repository.update({
      where: { id },
      data: { removedAt: new Date() },
    });
  }
}
