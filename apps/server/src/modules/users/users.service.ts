import { Injectable, Logger } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { PrismaService } from '../prisma/prisma.service';
import { GetPaginatedUserArgs } from './dto/get-paginated-user.args';
import { queryBuilder } from '@common';
import { PaginatedUser } from './models/paginated-user.model';

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

  async findPaginatedUsers(args: GetPaginatedUserArgs): Promise<PaginatedUser> {
    const query = queryBuilder(args, ['email']);
    const users = await this.prisma.user.findMany({
      ...query,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        profile: true,
      },
    });
    const totalCount = await this.prisma.user.count({});

    return {
      edges: users.map(user => ({ node: user })),
      nodes: users,
      pageInfo: {
        totalCount,
        hasNextPage: !(users.length < args.take),
      },
    };
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }
}
