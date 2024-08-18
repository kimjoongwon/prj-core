import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { UpsertUserDto } from './dtos/upsert-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  upsert(upsertUserDto: UpsertUserDto) {
    const { email } = upsertUserDto;
    return this.prisma.user.upsert({
      where: {
        email,
      },
      update: upsertUserDto,
      create: upsertUserDto,
    });
  }

  async findUniqueByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async getUniqueById(id: string) {
    return this.prisma.user.findUnique({
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
}
