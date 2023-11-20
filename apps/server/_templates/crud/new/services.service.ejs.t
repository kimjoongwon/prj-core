---
to: src/modules/<%= name %>s//<%= name %>s.service.ts
---
import { Injectable } from '@nestjs/common';
import { last } from 'lodash';
import { PrismaService } from '../global/prisma/prisma.service';
import { queryBuilder } from '../../common/utils/query-builder';
import { Create<%= h.changeCase.pascal(name) %>Input } from './dto/create-<%=name %>.input';
import { Get<%= h.changeCase.pascal(name) %>sArgs } from './dto/get-<%=name %>s.args';
import { Update<%= h.changeCase.pascal(name) %>Input } from './dto/update-<%=name %>.input';
import { <%= Name %>Form } from './models/<%=name %>-form.model';
import { Paginated<%= h.changeCase.pascal(name) %> } from './models/paginated-<%=name %>.model';

@Injectable()
export class <%= h.changeCase.pascal(name) %>sService {
  constructor(private readonly prisma: PrismaService) {}

  create(create<%= h.changeCase.pascal(name) %>Input: Create<%= h.changeCase.pascal(name) %>Input) {
    return this.prisma.<%= h.changeCase.camel(name) %>.create({
      data: create<%= h.changeCase.pascal(name) %>Input,
    });
  }

  findForm(): <%= h.changeCase.pascal(name) %>Form {
    return {
      name: '',
    };
  }

  async findPaginated<%= h.changeCase.pascal(name) %>(args: Get<%= h.changeCase.pascal(name) %>sArgs): Promise<Paginated<%= h.changeCase.pascal(name) %>> {
    const query = queryBuilder(args, []);

    const <%= h.changeCase.camel(name) %>s = await this.prisma.<%= h.changeCase.camel(name) %>.findMany({
      ...query,
    });

    const totalCount = await this.prisma.<%= h.changeCase.camel(name) %>.count({
      where: query?.where,
    });

    const endCursor = last(<%= h.changeCase.camel(name) %>s)?.id;

    return {
      edges: <%= h.changeCase.camel(name) %>s.map(<%= h.changeCase.camel(name) %> => ({ node: <%= h.changeCase.camel(name) %> })),
      nodes: <%= h.changeCase.camel(name) %>s,
      pageInfo: {
        totalCount,
        endCursor,
        hasNextPage: !(<%= h.changeCase.camel(name) %>s.length < args.take),
      },
    };
  }

  delete(id: string) {
    return this.prisma.<%= h.changeCase.camel(name) %>.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  findOne(id: string) {
    return this.prisma.<%= h.changeCase.camel(name) %>.findUnique({
      where: { id },
    });
  }

  update(updateCategoryInput: Update<%= h.changeCase.pascal(name) %>Input) {
    return this.prisma.<%= h.changeCase.camel(name) %>.update({
      where: { id: updateCategoryInput.id },
      data: updateCategoryInput,
    });
  }
}
