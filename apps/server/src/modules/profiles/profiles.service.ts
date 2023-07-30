import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProfilesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.profile.findMany();
  }

  findOneByUserId(userId: string) {
    return this.prisma.profile.findUnique({
      where: {
        userId,
      },
    });
  }
}
