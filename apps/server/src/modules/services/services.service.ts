import { Injectable } from '@nestjs/common';
import { last } from 'lodash';
import { queryBuilder } from '@common';
import { PaginatedService, ServiceForm } from './models';
import { CreateServiceInput, GetServicesArgs, UpdateServiceInput } from './dto';
import { PrismaService } from '@modules/global/prisma/prisma.service';

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createServiceInput: CreateServiceInput) {
    return this.prisma.service.create({
      data: createServiceInput,
    });
  }

  findForm(): ServiceForm {
    return {
      name: '',
    };
  }

  async findPaginatedService(args: GetServicesArgs): Promise<PaginatedService> {
    const query = queryBuilder(args, []);

    const services = await this.prisma.service.findMany({
      ...query,
    });

    const totalCount = await this.prisma.service.count({
      where: query?.where,
    });

    const endCursor = last(services)?.id;

    return {
      edges: services.map(service => ({ node: service })),
      nodes: services,
      pageInfo: {
        totalCount,
        endCursor,
        hasNextPage: !(services.length < args.take),
      },
    };
  }

  delete(id: string) {
    return this.prisma.service.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  findOne(id: string) {
    return this.prisma.service.findUnique({
      where: { id },
    });
  }

  update(updateCategoryInput: UpdateServiceInput) {
    return this.prisma.service.update({
      where: { id: updateCategoryInput.id },
      data: updateCategoryInput,
    });
  }
}
