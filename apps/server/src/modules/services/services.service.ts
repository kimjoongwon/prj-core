import { Injectable } from '@nestjs/common';
import { last } from 'lodash';
import { PrismaService } from '../global/prisma/prisma.service';
import { queryBuilder } from '../../common/utils';
import { PaginatedService } from './models/paginated-service.model';
import { ServiceForm } from './models/service-form.model';
import { CreateServiceInput } from './dto/create-service.input';
import { GetServicesArgs } from './dto/get-services.args';
import { UpdateServiceInput } from './dto/update-service.input';

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createServiceInput: CreateServiceInput) {
    return this.prisma.service.create({
      data: createServiceInput,
    });
  }

  async findForm(): Promise<ServiceForm> {
    return {
      name: '',
    };
  }

  async findAllServiceOptions() {
    const services = await this.prisma.service.findMany();
    return services.map(service => ({
      name: service.name,
      value: service.id,
    }));
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
