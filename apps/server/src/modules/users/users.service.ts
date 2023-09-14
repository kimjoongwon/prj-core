import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { PrismaService } from '../prisma/prisma.service';
import { GetPaginatedUsersArgs } from './dto/get-paginated-users.args';

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

  async findPaginatedUsers({
    email,
    skip,
    take,
    cursor,
  }: GetPaginatedUsersArgs) {
    const query = {
      take,
      skip,
      cursor: {
        id: cursor,
      },
      where: {
        email: {
          contains: email,
        },
      },
    };
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
