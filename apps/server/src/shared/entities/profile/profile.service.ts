import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProfileDto: any) {
    return this.prisma.profile.create({
      data: createProfileDto,
      include: { user: true },
    });
  }
}
