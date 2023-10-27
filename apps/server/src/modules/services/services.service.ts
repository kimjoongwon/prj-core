import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceInput } from './dto/create-service.input';
import { GetServicesArgs } from './dto/get-service.args';
import { queryBuilder } from '@common';
import { PaginatedService } from './model/paginated-service.model';
import { last } from 'lodash';
import { serviceForm } from './model/service-form.model';
import { UpdateServiceInput } from './dto/update-service.input';

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createServiceInput: CreateServiceInput) {
    return this.prisma.service.create({
      data: createServiceInput,
    });
  }

  async findForm(id: string) {
    if (id === 'new') {
      return serviceForm;
    }

    const service = await this.prisma.service.findUnique({
      where: { id },
    });

    return {
      id: service.id,
      name: service.name,
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
      include: {
        category: true,
      },
    });
  }

  update(updateCategoryInput: UpdateServiceInput) {
    return this.prisma.service.update({
      where: { id: updateCategoryInput.id },
      data: updateCategoryInput,
    });
  }
}
