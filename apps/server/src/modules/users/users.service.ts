import { Injectable, Logger } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { PrismaService } from '../prisma/prisma.service';
import { GetPaginatedUserArgs } from './dto/get-paginated-user.args';
import { queryBuilder } from '@common';
import { PaginatedUser } from './models/paginated-user.model';
import { set } from 'lodash';
import { UpdateUserInput } from './dto/update-user.input';
import { SignupInput } from '@modules/auth/dto/signup.input';

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

  async findPaginatedUsers(args: GetPaginatedUserArgs): Promise<PaginatedUser> {
    const query = queryBuilder(args, ['email']);
    const users = await this.prisma.user.findMany({
      ...query,
      orderBy: { ...set({}, args.sortingKey, args.sortingValue), id: 'desc' },
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

  findOne(cuid: string) {
    return this.prisma.user.findUnique({
      where: { cuid },
      include: {
        profile: true,
      },
    });
  }

  update(id: number, updateUserInput: UpdateUserInput) {
    return this.prisma.user.update({
      where: { id },
      data: {
        ...updateUserInput,
        profile: {
          update: {
            ...updateUserInput.profile,
          },
        },
      },
    });
  }
}
