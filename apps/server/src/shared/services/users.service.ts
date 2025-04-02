import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repositories/users.repository';
import { GymsRepository } from '../repositories/gyms.repository';
import { Prisma } from '@prisma/client';
import { ContextProvider } from '../providers';

@Injectable()
export class UsersService {
  constructor(
    private readonly repository: UsersRepository,
    private readonly gymsRepository: GymsRepository,
  ) {}

  getMyGyms() {
    return this.gymsRepository.findMany({
      where: {
        space: {
          tenants: {
            some: {
              userId: ContextProvider.getAuthUserId(),
            },
          },
        },
        removedAt: null,
      },
      include: {
        space: true,
      },
    });
  }

  getUnique(args: Prisma.UserFindUniqueArgs) {
    return this.repository.findUnique(args);
  }

  getFirst(args: Prisma.UserFindFirstArgs) {
    return this.repository.findFirst(args);
  }

  removeMany(ids: string[]) {
    return this.repository.updateMany({
      where: { id: { in: ids } },
      data: { removedAt: new Date() },
    });
  }

  delete(args: Prisma.UserDeleteArgs) {
    return this.repository.delete(args);
  }

  create(args: Prisma.UserCreateArgs) {
    return this.repository.create(args);
  }

  async getManyByQuery(args: Prisma.UserFindManyArgs) {
    const users = await this.repository.findMany({
      ...args,
      include: {
        tenants: true,
      },
    });
    const count = await this.repository.count(args as Prisma.UserCountArgs);

    return { users, count };
  }

  update(args: Prisma.UserUpdateArgs) {
    return this.repository.update(args);
  }

  remove(id: string) {
    return this.update({ where: { id }, data: { removedAt: new Date() } });
  }
}
