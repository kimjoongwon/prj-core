import { Injectable } from '@nestjs/common';
import { CreateTenancyDto } from './dto/create-tenancy.dto';
import { TenanciesRepository } from './tenancies.repository';
import { IService } from '../../types';
import { TenancyQueryDto } from './dto/tenancy-query.dto';
import { PaginationMananger } from '../../utils';
import { UpdateTenancyDto } from './dto/update-tenancy.dto';

@Injectable()
export class TenanciesService implements IService {
  constructor(private readonly repository: TenanciesRepository) {}

  getUnique(id: string) {
    return this.repository.findUnique({ where: { id } });
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

  create(createTenancyDto: CreateTenancyDto) {
    return this.repository.create({ data: createTenancyDto });
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
