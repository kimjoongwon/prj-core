import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { PrismaService } from '../prisma/prisma.service';
import { GetUsersArgs } from './dto/get-users.args';
import { PaginatedUser } from './entities/user.entity';

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

  async findByArgs(args: GetUsersArgs) {
    const query = {
      take: args.limit,
      skip: args.offset,
      where: {
        email: {
          contains: args.email,
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

  // update(id: string, updateUserInput: UpdateUserInput) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: string) {
  //   return `This action removes a #${id} user`;
  // }
}
