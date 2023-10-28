import { Injectable } from '@nestjs/common';
import { last } from 'lodash';
import { queryBuilder } from '@common';
import { PaginatedUserService, UserServiceForm } from './models';
import { CreateUserServiceInput, GetUserServicesArgs, UpdateUserServiceInput } from './dto';
import { PrismaService } from '@modules/global/prisma/prisma.service';

@Injectable()
export class UserServicesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createUserServiceInput: CreateUserServiceInput) {
    return this.prisma.userService.create({
      data: createUserServiceInput,
    });
  }

  findForm(): UserServiceForm {
    return {
      id: '',
      name: '',
      name: '',
    };
  }

  async findPaginatedUserService(args: GetUserServicesArgs): Promise<PaginatedUserService> {
    const query = queryBuilder(args, []);

    const userServices = await this.prisma.userService.findMany({
      ...query,
    });

    const totalCount = await this.prisma.userService.count({
      where: query?.where,
    });

    const endCursor = last(userServices)?.id;

    return {
      edges: userServices.map(userService => ({ node: userService })),
      nodes: userServices,
      pageInfo: {
        totalCount,
        endCursor,
        hasNextPage: !(userServices.length < args.take),
      },
    };
  }

  delete(id: string) {
    return this.prisma.userService.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  findOne(id: string) {
    return this.prisma.userService.findUnique({
      where: { id },
    });
  }

  update(updateCategoryInput: UpdateUserServiceInput) {
    return this.prisma.userService.update({
      where: { id: updateCategoryInput.id },
      data: updateCategoryInput,
    });
  }
}
