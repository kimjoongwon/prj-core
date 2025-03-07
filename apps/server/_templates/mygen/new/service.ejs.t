---
to: src/shared/services/<%= h.inflection.pluralize(name) %>.service.ts
---
import { Injectable } from '@nestjs/common';
import { <%= h.inflection.pluralize(h.changeCase.pascal(name)) %>Repository } from '../repositories/<%= h.inflection.pluralize(name) %>.repository';
import { Create<%= h.changeCase.pascal(name) %>Dto, <%= h.changeCase.pascal(name) %>QueryDto, Update<%= h.changeCase.pascal(name) %>Dto } from '../dtos';

@Injectable()
export class <%= h.changeCase.pascal(h.inflection.pluralize(name)) %>Service {
  constructor(private readonly repository: <%= h.inflection.pluralize(h.changeCase.pascal(name)) %>Repository) {}

  getById(id: string) {
    return this.repository.findUnique({
      where: { id },
    });
  }

  removeManyByIds(ids: string[]) {
    return this.repository.updateMany({
      where: {
        id: {
          in: ids,
        },
      },
      data: { removedAt: new Date() },
    });
  }

  create(create<%= h.changeCase.pascal(name) %>Dto: Create<%= h.changeCase.pascal(name) %>Dto) {
    return this.repository.create({
      data: create<%= h.changeCase.pascal(name) %>Dto,
    });
  }

  updateById(id: string, update<%= h.changeCase.pascal(name) %>Dto: Update<%= h.changeCase.pascal(name) %>Dto) {
    return this.repository.update({
      where: { id },
      data: update<%= h.changeCase.pascal(name) %>Dto,
    });
  }

  async getManyByQuery(query: <%= h.changeCase.pascal(name) %>QueryDto) {
    const args = query.toArgs();
    const countArgs = query.toCountArgs();
    const <%= h.inflection.pluralize(name) %> = await this.repository.findMany(args);
    const count = await this.repository.count(countArgs);
    return {
      <%= h.inflection.pluralize(name) %>,
      count,
    };
  }

  deleteById(id: string) {
    return this.repository.delete({
      where: { id },
    });
  }

  removeById(id: string) {
    return this.repository.update({
      where: { id },
      data: { removedAt: new Date() },
    });
  }
}
