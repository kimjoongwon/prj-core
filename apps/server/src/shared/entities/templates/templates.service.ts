import { Injectable } from '@nestjs/common';
import { TemplatesRepository } from './templates.repository';
import { TemplatePageQueryDto } from './dtos/template-page-query.dto';
import { Prisma } from '@prisma/client';
import { PaginationUtil } from '@shared/utils';

@Injectable()
export class TemplatesService {
  constructor(private readonly repository: TemplatesRepository) {}

  getUnique(args: Prisma.TemplateFindUniqueArgs) {
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

  create(args: Prisma.TemplateCreateArgs) {
    return this.repository.create(args);
  }

  async getManyByQuery(pageQuery: TemplatePageQueryDto) {
    const args = PaginationUtil.toArgs(pageQuery);
    const templates = await this.repository.findMany(args);
    const count = await this.repository.count(args);
    return {
      templates,
      count,
    };
  }

  update(args: Prisma.TemplateUpdateArgs) {
    return this.repository.update(args);
  }

  remove(id: string) {
    return this.repository.update({
      where: { id },
      data: { removedAt: new Date() },
    });
  }
}
