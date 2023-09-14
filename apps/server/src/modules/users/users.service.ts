import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { PrismaService } from '../prisma/prisma.service';
import { GetPaginatedUsersArgs } from './dto/get-paginated-users.args';
import { queryBuilder } from '@common';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  create(createUserInput: CreateUserInput) {
    return this.prisma.user.create({
      data: {
        ...createUserInput,
      },
    });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  async findPaginatedUsers(args: GetPaginatedUsersArgs) {
    const query = queryBuilder(args, ['email']);
    console.log('query', query);
    const users = await this.prisma.user.findMany(query);
    const totalCount = await this.prisma.user.count(query);

    return {
      edges: users?.map(user => ({ node: user, cursor: user.id })),
      nodes: users,
      hasNextPage: true,
      totalCount,
    };
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }
}
