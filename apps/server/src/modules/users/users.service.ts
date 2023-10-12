import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GetPaginatedUserArgs } from './dto/get-paginated-user.args';
import { queryBuilder } from '@common';
import { last, set } from 'lodash';
import { UpdateUserInput } from './dto/update-user.input';
import { Users } from './models/paginated-user.model';
import { userForm } from './models';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany();
  }

  async findPaginatedUsers(args: GetPaginatedUserArgs): Promise<Users> {
    const query = queryBuilder(args, ['email']);

    const users = await this.prisma.user.findMany({
      ...query,
      include: {
        profile: true,
      },
    });

    const totalCount = await this.prisma.user.count({
      where: query?.where,
    });

    const endCursor = last(users).id;

    return {
      edges: users.map(user => ({ node: user })),
      nodes: users,
      pageInfo: {
        totalCount,
        endCursor,
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

  async findForm(cuid: string) {
    if (cuid === 'new') {
      return userForm;
    }

    const user = await this.prisma.user.findUnique({
      where: { cuid },
      include: { profile: true },
    });

    return {
      email: user.email,
      password: '',
      profile: user.profile,
    };
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
