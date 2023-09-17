import { Injectable, Logger } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { PrismaService } from '../prisma/prisma.service';
import { GetPaginatedUsersArgs } from './dto/get-paginated-users.args';
import { queryBuilder } from '@common';
import { OffsetBasedPaginatedUser } from './entities/offset-paginated-user.entity';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: Logger,
  ) {}

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

  async findPaginatedUsers(
    args: GetPaginatedUsersArgs,
  ): Promise<OffsetBasedPaginatedUser> {
    const query = queryBuilder(args, ['email']);
    const users = await this.prisma.user.findMany({
      ...query,
      orderBy: {
        createdAt: 'desc',
      },
    });
    const totalCount = await this.prisma.user.count({});

    return {
      edges: users.map(user => ({ node: user })),
      nodes: users,
      pageInfo: {
        hasNextPage: !(users.length < args.take),
      },
      totalCount,
    };
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }
}
