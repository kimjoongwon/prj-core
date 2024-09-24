import { Injectable } from '@nestjs/common';
import { UpsertUserDto } from './dtos/upsert-user.dto';
import { Prisma } from '@prisma/client';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly repository: UsersRepository) {}

  getUnique(args: Prisma.UserFindUniqueArgs) {
    return this.repository.findUnique(args);
  }

  upsert(upsertUserDto: UpsertUserDto) {
    const { email } = upsertUserDto;
    return this.repository.upsert({
      where: {
        email,
      },
      update: upsertUserDto,
      create: upsertUserDto,
    });
  }

  async findUniqueByEmail(email: string) {
    return this.repository.findUnique({
      where: { email },
      include: {
        profiles: true,
        tenants: {
          include: {
            tenancy: {
              include: {
                tenants: true,
              },
            },
            role: true,
          },
        },
      },
    });
  }

  async getUniqueById(id: string) {
    return this.repository.findUnique({
      where: { id },
      include: {
        profiles: true,
        tenants: {
          include: {
            tenancy: {
              include: {
                tenants: true,
              },
            },
            role: true,
          },
        },
      },
    });
  }

  create(args: Prisma.UserCreateArgs) {
    return this.repository.create(args);
  }
}
