import { Injectable } from '@nestjs/common';
import { CreateTemplateDto } from './dtos/create-template.dto';
import { UpdateTemplateDto } from './dtos/update-template.dto';
import { TemplateRepository } from './template.repository';
import { TemplatePageQueryDto } from './dtos/template-page-query.dto';
import { PaginationMananger } from '../../utils';
import { R } from '../../libs/remeda';
import { IService } from '../../types/interfaces/service.interface';

@Injectable()
export class TemplateService implements IService {
  constructor(private readonly repository: TemplateRepository) {}

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

  create(createTemplateDto: CreateTemplateDto) {
    return this.repository.create({ data: createTemplateDto });
  }

  async getManyByQuery(pageQuery: TemplatePageQueryDto) {
    const args = PaginationMananger.toArgs(pageQuery);
    const templates = await this.repository.findMany(args);
    const count = await this.repository.count(args);
    return {
      templates,
      count,
    };
  }

  update(templateId: string, updateTemplateDto: UpdateTemplateDto) {
    return this.repository.update({
      where: {
        id: templateId,
      },
      data: updateTemplateDto,
    });
  }

  remove(id: string) {
    return this.repository.update({
      where: { id },
      data: { removedAt: new Date() },
    });
  }
}
